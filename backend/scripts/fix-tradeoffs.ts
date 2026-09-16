// scripts/recalculate-tradeoffs.ts

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ========== TIPOS ==========

interface TradeoffEntry {
  side: 'left' | 'right';
  question: string;
  scenario: string;
  valueVar?: number;
  valueFixed?: number;
  mediana?: number;
}

interface AnswersJson {
  responses: Array<{ label: string; choice: string | number }>;
  tradeoffs: TradeoffEntry[];
}

// ========== FUNÇÕES DE CÁLCULO ==========

function getInitialValues(
  scenario: number,
  medianaAnterior?: number,
): { valorVar: number; valorFixo: number } {
  switch (scenario) {
    case 1:
      return { valorVar: 500, valorFixo: 1000 };
    case 2:
      return { valorVar: -1000, valorFixo: 1000 };
    case 3:
      // Cenário 3 usa a última mediana do cenário 2
      return {
        valorVar: calculateValueBase(3, medianaAnterior ?? 0),
        valorFixo: medianaAnterior ?? 0,
      };
    default:
      return { valorVar: 0, valorFixo: 0 };
  }
}

function calculateValueBase(scenario: number, valorFixo: number): number {
  switch (scenario) {
    case 1:
      return valorFixo * 0.5; // Safe * 0.5
    case 2:
      return -valorFixo; // -Risk
    case 3:
      return valorFixo * 0.5; // Risk * 0.5
    default:
      return 0;
  }
}

function calculateMedian(
  sideSelected: 'left' | 'right',
  valueBase: number,
  question: number,
  valueVar: number,
  scenario: number,
): number {
  const divisor = Math.pow(2, question);

  switch (scenario) {
    case 1:
      return sideSelected === 'left'
        ? valueVar + valueBase / divisor
        : valueVar - valueBase / divisor;
    case 2:
    case 3:
      return sideSelected === 'left'
        ? valueVar - valueBase / divisor
        : valueVar + valueBase / divisor;
    default:
      return valueVar;
  }
}

// ========== RECÁLCULO PRINCIPAL ==========

function recalculateTradeoffs(tradeoffs: TradeoffEntry[]): {
  updatedTradeoffs: TradeoffEntry[];
  finalValues: { scenario1: number; scenario2: number; scenario3: number };
} {
  const updatedTradeoffs: TradeoffEntry[] = [];
  const finalValues = { scenario1: 0, scenario2: 0, scenario3: 0 };

  // Agrupa por cenário
  const byScenario = new Map<number, TradeoffEntry[]>();
  for (const t of tradeoffs) {
    const scenario = parseInt(t.scenario);
    if (!byScenario.has(scenario)) byScenario.set(scenario, []);
    byScenario.get(scenario)!.push({ ...t });
  }

  // Processa cenários em ordem: 1 → 2 → 3
  let medianaFinalCenario2 = 0;

  for (const scenario of [1, 2, 3]) {
    const entries = byScenario.get(scenario);
    if (!entries) continue;

    // Ordena por questão
    entries.sort((a, b) => parseInt(a.question) - parseInt(b.question));

    // Valores iniciais (cenário 3 depende do cenário 2)
    const { valorVar: initialValueVar, valorFixo } = getInitialValues(
      scenario,
      scenario === 3 ? medianaFinalCenario2 : 0,
    );
    const valueBase = calculateValueBase(scenario, valorFixo);

    let currentMediana = initialValueVar;

    for (const entry of entries) {
      const question = parseInt(entry.question);

      if (question === 0) {
        // Questão 0: define valores iniciais
        updatedTradeoffs.push({
          ...entry,
          valueVar: initialValueVar,
          valueFixed: valorFixo,
          mediana: Math.round(currentMediana),
        });
      } else {
        // Questões 1-4: cálculo iterativo
        const newMediana = calculateMedian(
          entry.side,
          valueBase,
          question,
          currentMediana,
          scenario,
        );

        updatedTradeoffs.push({
          ...entry,
          mediana: Math.round(newMediana),
        });

        currentMediana = newMediana;
      }
    }

    // Salva mediana final do cenário
    const finalMediana = Math.round(currentMediana);
    switch (scenario) {
      case 1:
        finalValues.scenario1 = finalMediana;
        break;
      case 2:
        finalValues.scenario2 = finalMediana;
        medianaFinalCenario2 = finalMediana; // Passa para cenário 3
        break;
      case 3:
        finalValues.scenario3 = finalMediana;
        break;
    }
  }

  return { updatedTradeoffs, finalValues };
}

// ========== ATUALIZAÇÃO DO BANCO ==========

async function updateAllResults() {
  console.log('🔄 Iniciando recálculo de tradeoffs...\n');

  const results = await prisma.result.findMany({
    where: {
      answers: { not: Prisma.JsonNull },
    },
    select: {
      id: true,
      userId: true,
      answers: true,
    },
  });

  console.log(`📊 Total de registros encontrados: ${results.length}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const result of results) {
    try {
      const answers = result.answers as AnswersJson | null;

      if (!answers?.tradeoffs || answers.tradeoffs.length === 0) {
        skipped++;
        continue;
      }

      // Recalcula
      const { updatedTradeoffs, finalValues } = recalculateTradeoffs(
        answers.tradeoffs,
      );

      // Atualiza responses com os valores finais corretos
      const updatedResponses = answers.responses.map((r) => {
        switch (r.label) {
          case 'tradeoff_scenario_1_final_value':
            return { ...r, choice: finalValues.scenario1 };
          case 'tradeoff_scenario_2_final_value':
            return { ...r, choice: finalValues.scenario2 };
          case 'tradeoff_scenario_3_final_value':
            return { ...r, choice: finalValues.scenario3 };
          default:
            return r;
        }
      });

      // Atualiza no banco
      await prisma.result.update({
        where: { id: result.id },
        data: {
          answers: {
            ...answers,
            responses: updatedResponses,
            tradeoffs: updatedTradeoffs,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      console.log(`✅ [${result.id}] Atualizado`);
      console.log(`   Cenário 1: ${finalValues.scenario1}`);
      console.log(`   Cenário 2: ${finalValues.scenario2}`);
      console.log(`   Cenário 3: ${finalValues.scenario3}`);

      updated++;
    } catch (error) {
      console.error(`❌ [${result.id}] Erro:`, error);
      errors++;
    }
  }

  console.log('\n========== RESUMO ==========');
  console.log(`✅ Atualizados: ${updated}`);
  console.log(`⏭️  Ignorados:   ${skipped}`);
  console.log(`❌ Erros:       ${errors}`);
}

// ========== CORRIGIR STOP RULE (4ª QUESTÃO FALTANDO) ==========

function inferMissingChoice(entries: TradeoffEntry[]): 'left' | 'right' | null {
  // Ordena por questão e pega as últimas 3 escolhas
  const sorted = [...entries].sort(
    (a, b) => parseInt(a.question) - parseInt(b.question),
  );

  // Filtra apenas questões > 0 (escolhas reais)
  const choices = sorted
    .filter((e) => parseInt(e.question) > 0)
    .map((e) => e.side);

  if (choices.length < 3) return null;

  // Pega as últimas 3 escolhas
  const lastThree = choices.slice(-3).join('');

  // Mapeia left/right para A/B
  const pattern = lastThree.replace(/left/g, 'A').replace(/right/g, 'B');

  // Se termina em ABA, próximo é A (left) para formar ABAA
  if (pattern.endsWith('ABA')) return 'left';
  // Se termina em BAB, próximo é B (right) para formar BABB
  if (pattern.endsWith('BAB')) return 'right';

  return null;
}

function addMissingFourthQuestion(tradeoffs: TradeoffEntry[]): {
  updatedTradeoffs: TradeoffEntry[];
  scenariosFixed: number[];
} {
  const updatedTradeoffs: TradeoffEntry[] = [...tradeoffs];
  const scenariosFixed: number[] = [];

  // Agrupa por cenário
  const byScenario = new Map<number, TradeoffEntry[]>();
  for (const t of tradeoffs) {
    const scenario = parseInt(t.scenario);
    if (!byScenario.has(scenario)) byScenario.set(scenario, []);
    byScenario.get(scenario)!.push({ ...t });
  }

  for (const scenario of [1, 2, 3]) {
    const entries = byScenario.get(scenario);
    if (!entries) continue;

    // Conta questões (excluindo questão 0)
    const realQuestions = entries.filter((e) => parseInt(e.question) > 0);
    const maxQuestion = Math.max(
      ...realQuestions.map((e) => parseInt(e.question)),
    );

    // Se tem exatamente 3 questões (1, 2, 3) e falta a 4
    if (realQuestions.length === 3 && maxQuestion === 3) {
      const inferredChoice = inferMissingChoice(entries);

      if (inferredChoice) {
        // Encontra a última mediana para calcular a nova
        const lastEntry = entries.reduce((max, e) =>
          parseInt(e.question) > parseInt(max.question) ? e : max,
        );

        // Adiciona a 4ª questão
        updatedTradeoffs.push({
          side: inferredChoice,
          question: '4',
          scenario: scenario.toString(),
          mediana: lastEntry.mediana, // Será recalculado depois
        });

        scenariosFixed.push(scenario);
        console.log(
          `   📝 Cenário ${scenario}: Inferido choice="${inferredChoice}" para questão 4`,
        );
      }
    }
  }

  return { updatedTradeoffs, scenariosFixed };
}

async function fixMissingFourthQuestion() {
  console.log(
    '🔧 Corrigindo registros com 4ª questão faltando (stop rule bug)...\n',
  );

  const results = await prisma.result.findMany({
    where: {
      answers: { not: Prisma.JsonNull },
    },
    select: {
      id: true,
      userId: true,
      answers: true,
    },
  });

  console.log(`📊 Total de registros encontrados: ${results.length}\n`);

  let fixed = 0;
  let skipped = 0;
  let alreadyComplete = 0;
  let errors = 0;

  for (const result of results) {
    try {
      const answers = result.answers as AnswersJson | null;

      if (!answers?.tradeoffs || answers.tradeoffs.length === 0) {
        skipped++;
        continue;
      }

      // Verifica se algum cenário precisa de correção
      const { updatedTradeoffs, scenariosFixed } = addMissingFourthQuestion(
        answers.tradeoffs,
      );

      if (scenariosFixed.length === 0) {
        alreadyComplete++;
        continue;
      }

      console.log(
        `🔍 [${result.id}] Corrigindo cenários: ${scenariosFixed.join(', ')}`,
      );

      // Recalcula com os tradeoffs corrigidos
      const { updatedTradeoffs: recalculatedTradeoffs, finalValues } =
        recalculateTradeoffs(updatedTradeoffs);

      // Atualiza responses com os valores finais corretos
      const updatedResponses = answers.responses.map((r) => {
        switch (r.label) {
          case 'tradeoff_scenario_1_final_value':
            return { ...r, choice: finalValues.scenario1 };
          case 'tradeoff_scenario_2_final_value':
            return { ...r, choice: finalValues.scenario2 };
          case 'tradeoff_scenario_3_final_value':
            return { ...r, choice: finalValues.scenario3 };
          default:
            return r;
        }
      });

      // Atualiza no banco
      await prisma.result.update({
        where: { id: result.id },
        data: {
          answers: {
            ...answers,
            responses: updatedResponses,
            tradeoffs: recalculatedTradeoffs,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      console.log(`✅ [${result.id}] Corrigido e recalculado`);
      console.log(`   Cenário 1: ${finalValues.scenario1}`);
      console.log(`   Cenário 2: ${finalValues.scenario2}`);
      console.log(`   Cenário 3: ${finalValues.scenario3}`);

      fixed++;
    } catch (error) {
      console.error(`❌ [${result.id}] Erro:`, error);
      errors++;
    }
  }

  console.log('\n========== RESUMO ==========');
  console.log(`✅ Corrigidos:          ${fixed}`);
  console.log(`✓  Já completos:        ${alreadyComplete}`);
  console.log(`⏭️  Ignorados (sem dados): ${skipped}`);
  console.log(`❌ Erros:               ${errors}`);
}

// ========== DIAGNÓSTICO (PREVIEW) ==========

async function diagnoseStopRuleBug() {
  console.log('🔍 Analisando registros com possível bug do stop rule...\n');

  const results = await prisma.result.findMany({
    where: {
      answers: { not: Prisma.JsonNull },
    },
    select: {
      id: true,
      userId: true,
      answers: true,
    },
  });

  console.log(`📊 Total de registros encontrados: ${results.length}\n`);

  interface AffectedRecord {
    id: string;
    scenariosAffected: number[];
    details: { scenario: number; questions: number[]; pattern: string }[];
  }

  const affected: AffectedRecord[] = [];
  let skipped = 0;
  let complete = 0;

  for (const result of results) {
    const answers = result.answers as AnswersJson | null;

    if (!answers?.tradeoffs || answers.tradeoffs.length === 0) {
      skipped++;
      continue;
    }

    // Agrupa por cenário
    const byScenario = new Map<number, TradeoffEntry[]>();
    for (const t of answers.tradeoffs) {
      const scenario = parseInt(t.scenario);
      if (!byScenario.has(scenario)) byScenario.set(scenario, []);
      byScenario.get(scenario)!.push(t);
    }

    const recordAffected: AffectedRecord = {
      id: result.id,
      scenariosAffected: [],
      details: [],
    };

    for (const scenario of [1, 2, 3]) {
      const entries = byScenario.get(scenario);
      if (!entries) continue;

      // Questões reais (excluindo 0)
      const realQuestions = entries.filter((e) => parseInt(e.question) > 0);
      const questionNumbers = realQuestions
        .map((e) => parseInt(e.question))
        .sort((a, b) => a - b);
      const maxQuestion = Math.max(...questionNumbers, 0);

      // Verifica se falta a 4ª questão
      if (realQuestions.length === 3 && maxQuestion === 3) {
        // Verifica o padrão
        const choices = realQuestions
          .sort((a, b) => parseInt(a.question) - parseInt(b.question))
          .map((e) => (e.side === 'left' ? 'A' : 'B'))
          .join('');

        recordAffected.scenariosAffected.push(scenario);
        recordAffected.details.push({
          scenario,
          questions: questionNumbers,
          pattern: choices,
        });
      }
    }

    if (recordAffected.scenariosAffected.length > 0) {
      affected.push(recordAffected);
    } else {
      complete++;
    }
  }

  // Exibe resultados
  console.log('========== REGISTROS AFETADOS ==========\n');

  if (affected.length === 0) {
    console.log('✅ Nenhum registro afetado pelo bug do stop rule!\n');
  } else {
    for (const record of affected) {
      console.log(`📋 [${record.id}]`);
      for (const detail of record.details) {
        const inferredChoice = detail.pattern.endsWith('ABA')
          ? 'A (left)'
          : detail.pattern.endsWith('BAB')
            ? 'B (right)'
            : '???';
        console.log(`   Cenário ${detail.scenario}:`);
        console.log(`     Questões gravadas: ${detail.questions.join(', ')}`);
        console.log(`     Padrão atual: ${detail.pattern}`);
        console.log(`     4ª escolha inferida: ${inferredChoice}`);
      }
      console.log('');
    }
  }

  // Estatísticas por cenário
  const scenarioStats = { 1: 0, 2: 0, 3: 0 };
  for (const record of affected) {
    for (const s of record.scenariosAffected) {
      scenarioStats[s as 1 | 2 | 3]++;
    }
  }

  console.log('========== RESUMO ==========');
  console.log(`📊 Total de registros analisados: ${results.length}`);
  console.log(`⚠️  Registros afetados:           ${affected.length}`);
  console.log(`✓  Registros completos:          ${complete}`);
  console.log(`⏭️  Ignorados (sem dados):        ${skipped}`);
  console.log('');
  console.log('📈 Afetados por cenário:');
  console.log(`   Cenário 1: ${scenarioStats[1]} registros`);
  console.log(`   Cenário 2: ${scenarioStats[2]} registros`);
  console.log(`   Cenário 3: ${scenarioStats[3]} registros`);
  console.log('');
  console.log(
    affected.length > 0
      ? '💡 Execute "npx ts-node scripts/fix-tradeoffs.ts fix-stoprule" para corrigir.'
      : '✅ Nada a corrigir!',
  );
}

// ========== LISTAR CASOS INCOMPLETOS ==========

async function listIncompleteCases() {
  console.log('🔍 Listando casos incompletos (padrão ??? - não são stop rule)...\n');

  const results = await prisma.result.findMany({
    where: {
      answers: { not: Prisma.JsonNull },
    },
    select: {
      id: true,
      userId: true,
      answers: true,
    },
  });

  interface IncompleteRecord {
    id: string;
    userId: string;
    details: { scenario: number; questions: number[]; pattern: string }[];
  }

  const incomplete: IncompleteRecord[] = [];

  for (const result of results) {
    const answers = result.answers as AnswersJson | null;

    if (!answers?.tradeoffs || answers.tradeoffs.length === 0) {
      continue;
    }

    // Agrupa por cenário
    const byScenario = new Map<number, TradeoffEntry[]>();
    for (const t of answers.tradeoffs) {
      const scenario = parseInt(t.scenario);
      if (!byScenario.has(scenario)) byScenario.set(scenario, []);
      byScenario.get(scenario)!.push(t);
    }

    const recordIncomplete: IncompleteRecord = {
      id: result.id,
      userId: result.userId,
      details: [],
    };

    for (const scenario of [1, 2, 3]) {
      const entries = byScenario.get(scenario);
      if (!entries) continue;

      // Questões reais (excluindo 0)
      const realQuestions = entries.filter((e) => parseInt(e.question) > 0);
      const questionNumbers = realQuestions
        .map((e) => parseInt(e.question))
        .sort((a, b) => a - b);
      const maxQuestion = Math.max(...questionNumbers, 0);

      // Verifica se tem exatamente 3 questões
      if (realQuestions.length === 3 && maxQuestion === 3) {
        const choices = realQuestions
          .sort((a, b) => parseInt(a.question) - parseInt(b.question))
          .map((e) => (e.side === 'left' ? 'A' : 'B'))
          .join('');

        // Só inclui se NÃO for stop rule (não é ABA nem BAB)
        if (!choices.endsWith('ABA') && !choices.endsWith('BAB')) {
          recordIncomplete.details.push({
            scenario,
            questions: questionNumbers,
            pattern: choices,
          });
        }
      }
    }

    if (recordIncomplete.details.length > 0) {
      incomplete.push(recordIncomplete);
    }
  }

  // Exibe resultados
  console.log('========== CASOS INCOMPLETOS (NÃO SÃO STOP RULE) ==========\n');

  if (incomplete.length === 0) {
    console.log('✅ Nenhum caso incompleto encontrado!\n');
  } else {
    // Agrupa por padrão para análise
    const patternStats: Record<string, number> = {};

    for (const record of incomplete) {
      console.log(`📋 [${record.id}]`);
      console.log(`   User: ${record.userId}`);
      for (const detail of record.details) {
        console.log(`   Cenário ${detail.scenario}:`);
        console.log(`     Questões gravadas: ${detail.questions.join(', ')}`);
        console.log(`     Padrão: ${detail.pattern}`);
        
        // Conta padrões
        patternStats[detail.pattern] = (patternStats[detail.pattern] || 0) + 1;
      }
      console.log('');
    }

    // Estatísticas por cenário
    const scenarioStats = { 1: 0, 2: 0, 3: 0 };
    for (const record of incomplete) {
      for (const detail of record.details) {
        scenarioStats[detail.scenario as 1 | 2 | 3]++;
      }
    }

    console.log('========== RESUMO ==========');
    console.log(`📊 Total de registros incompletos: ${incomplete.length}`);
    console.log('');
    console.log('📈 Por cenário:');
    console.log(`   Cenário 1: ${scenarioStats[1]} casos`);
    console.log(`   Cenário 2: ${scenarioStats[2]} casos`);
    console.log(`   Cenário 3: ${scenarioStats[3]} casos`);
    console.log('');
    console.log('📊 Por padrão:');
    for (const [pattern, count] of Object.entries(patternStats).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${pattern}: ${count} casos`);
    }
    console.log('');
    console.log('⚠️  Esses casos NÃO podem ser corrigidos automaticamente.');
    console.log('   Possíveis causas: usuário abandonou, erro de conexão, etc.');
  }
}

// ========== EXECUÇÃO ==========

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'recalculate':
        console.log('📐 Executando recálculo de tradeoffs...\n');
        await updateAllResults();
        break;

      case 'fix-stoprule':
        console.log('🔧 Executando correção do bug do stop rule...\n');
        await fixMissingFourthQuestion();
        break;

      case 'diagnose':
        await diagnoseStopRuleBug();
        break;

      case 'incomplete':
        await listIncompleteCases();
        break;

      default:
        console.log('📋 Uso: npx ts-node scripts/fix-tradeoffs.ts <comando>\n');
        console.log('Comandos disponíveis:');
        console.log(
          '  diagnose      - Mostra quantos registros têm o bug do stop rule (não altera dados)',
        );
        console.log(
          '  incomplete    - Lista casos incompletos que NÃO são stop rule (não podem ser corrigidos)',
        );
        console.log(
          '  fix-stoprule  - Corrige registros com 4ª questão faltando (bug do stop rule)',
        );
        console.log(
          '  recalculate   - Recalcula as medianas dos tradeoffs existentes',
        );
        console.log('\nExemplo:');
        console.log('  npx ts-node scripts/fix-tradeoffs.ts diagnose');
        break;
    }
  } catch (error) {
    console.error('Erro fatal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
