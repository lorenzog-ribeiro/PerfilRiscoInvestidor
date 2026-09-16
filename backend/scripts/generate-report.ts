
import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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

async function generateReport() {
  console.log('📊 Gerando relatório de resultados...\n');

  const results = await prisma.result.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(`🔎 Encontrados ${results.length} registros no total.\n`);

  const reportData = results.map((result) => {
    const answers = result.answers as unknown as AnswersJson | null;
    const details = result.details as any | null;
    
    // Filtro: Remover casos incompletos (aqueles que não têm 4 questões gravadas por cenário)
    const hasIncompleteTradeoffs = [1, 2, 3].some(scenarioNum => {
      const scenarioTradeoffs = answers?.tradeoffs?.filter(t => parseInt(t.scenario) === scenarioNum) || [];
      if (scenarioTradeoffs.length === 0) return false; 
      
      const hasQ4 = scenarioTradeoffs.some(t => parseInt(t.question) === 4);
      return !hasQ4;
    });

    if (hasIncompleteTradeoffs) return null;

    // Função auxiliar para pegar resposta do formulário
    const getResponse = (label: string) => {
      const resp = answers?.responses?.find(r => r.label === label);
      return resp ? resp.choice : '';
    };

    // Função auxiliar para pegar histórico do tradeoff (ex: "A,B,A")
    const getTradeoffHistory = (scenarioNum: number) => {
      const history = answers?.tradeoffs
        ?.filter(t => parseInt(t.scenario) === scenarioNum && parseInt(t.question) > 0)
        .sort((a, b) => parseInt(a.question) - parseInt(b.question))
        .map(t => t.side === 'left' ? 'A' : (t.side === 'right' ? 'B' : t.side))
        .join(',');
      return history || '';
    };

    // Função auxiliar para pegar detalhes de cada questão do tradeoff
    const getT = (scenario: number, question: number, field: 'side' | 'valueVar' | 'valueFixed') => {
      const allEntries = answers?.tradeoffs?.filter(t => parseInt(t.scenario) === scenario) || [];
      const entry = allEntries.find(t => parseInt(t.question) === question);
      
      if (!entry) return '';

      if (field === 'side') {
        if (entry.side === 'left') return 'A';
        if (entry.side === 'right') return 'B';
        return entry.side;
      }

      if (field === 'valueVar') {
        return entry.valueVar ?? entry.mediana ?? '';
      }

      if (field === 'valueFixed') {
        if (entry.valueFixed !== undefined && entry.valueFixed !== null) return entry.valueFixed;
        const q0 = allEntries.find(t => parseInt(t.question) === 0);
        return q0?.valueFixed ?? '';
      }

      return '';
    };

    return {
      'name': result.user.name,
      'email': result.user.email,
      'birthDate': result.user.birthDate.toISOString().split('T')[0],
      'created_at': result.createdAt.toISOString(),
      'investor_risk_pref_q1': getResponse('investor_risk_pref_q1'),
      'investor_risk_pref_q2': getResponse('investor_risk_pref_q2'),
      'investor_risk_pref_q3': getResponse('investor_risk_pref_q3'),
      'investor_risk_pref_q4': getResponse('investor_risk_pref_q4'),
      'investor_risk_pref_q5': getResponse('investor_risk_pref_q5'),
      'investor_risk_pref_q6': getResponse('investor_risk_pref_q6'),
      'investor_risk_pref_q7': getResponse('investor_risk_pref_q7'),
      'investor_risk_pref_q8': getResponse('investor_risk_pref_q8'),
      'investor_risk_pref_q9': getResponse('investor_risk_pref_q9'),
      'investor_risk_pref_q10': getResponse('investor_risk_pref_q10'),
      'investor_risk_pref_q11': getResponse('investor_risk_pref_q11'),
      'investor_risk_pref_q12': getResponse('investor_risk_pref_q12'),
      'investor_risk_pref_q13': getResponse('investor_risk_pref_q13'),
      // As colunas score/profileName do banco nunca são preenchidas; o dado vem
      // do payload do quiz (QuizSubmissionService envia esses três labels).
      'investor_score':
        getResponse('investor_score') !== '' // score 0 é válido, não usar ||
          ? getResponse('investor_score')
          : result.score ?? '',
      'investor_profile_title':
        getResponse('investor_profile_title') || result.profileName || '',
      'investor_profile_description':
        getResponse('investor_profile_description') ||
        details?.profileDescription ||
        '',
      'literacy_q1': getResponse('literacy_q1'),
      'literacy_q2': getResponse('literacy_q2'),
      'literacy_q3': getResponse('literacy_q3'),
      'literacy_q4': getResponse('literacy_q4'),
      'dospert_1': getResponse('dospert_1'),
      'dospert_2': getResponse('dospert_2'),
      'dospert_3': getResponse('dospert_3'),
      'dospert_4': getResponse('dospert_4'),
      'dospert_5': getResponse('dospert_5'),
      'dospert_6': getResponse('dospert_6'),
      'dospert_7': getResponse('dospert_7'),
      'dospert_8': getResponse('dospert_8'),
      'dospert_9': getResponse('dospert_9'),
      'dospert_10': getResponse('dospert_10'),
      'dospert_11': getResponse('dospert_11'),
      'dospert_12': getResponse('dospert_12'),
      'dospert_13': getResponse('dospert_13'),
      'dospert_14': getResponse('dospert_14'),
      'dospert_15': getResponse('dospert_15'),
      'dospert_16': getResponse('dospert_16'),
      'dospert_17': getResponse('dospert_17'),
      'dospert_18': getResponse('dospert_18'),
      'dospert_19': getResponse('dospert_19'),
      'dospert_20': getResponse('dospert_20'),
      'dospert_21': getResponse('dospert_21'),
      'dospert_22': getResponse('dospert_22'),
      'dospert_23': getResponse('dospert_23'),
      'dospert_24': getResponse('dospert_24'),
      'dospert_25': getResponse('dospert_25'),
      'dospert_26': getResponse('dospert_26'),
      'dospert_27': getResponse('dospert_27'),
      'dospert_28': getResponse('dospert_28'),
      'dospert_29': getResponse('dospert_29'),
      'dospert_30': getResponse('dospert_30'),
      'tradeoff_scenario_1_final_value': getResponse('tradeoff_scenario_1_final_value'),
      'tradeoff_scenario_1_history': getTradeoffHistory(1),
      'tradeoff_scenario_2_final_value': getResponse('tradeoff_scenario_2_final_value'),
      'tradeoff_scenario_2_history': getTradeoffHistory(2),
      'tradeoff_scenario_3_final_value': getResponse('tradeoff_scenario_3_final_value'),
      'tradeoff_scenario_3_history': getTradeoffHistory(3),
      
      // Detalhes cenário 1
      't_s1_q0_side': getT(1, 0, 'side'), 't_s1_q0_valueVar': getT(1, 0, 'valueVar'), 't_s1_q0_valueFixed': getT(1, 0, 'valueFixed'),
      't_s1_q1_side': getT(1, 1, 'side'), 't_s1_q1_valueVar': getT(1, 1, 'valueVar'), 't_s1_q1_valueFixed': getT(1, 1, 'valueFixed'),
      't_s1_q2_side': getT(1, 2, 'side'), 't_s1_q2_valueVar': getT(1, 2, 'valueVar'), 't_s1_q2_valueFixed': getT(1, 2, 'valueFixed'),
      't_s1_q3_side': getT(1, 3, 'side'), 't_s1_q3_valueVar': getT(1, 3, 'valueVar'), 't_s1_q3_valueFixed': getT(1, 3, 'valueFixed'),
      't_s1_q4_side': getT(1, 4, 'side'), 't_s1_q4_valueVar': getT(1, 4, 'valueVar'), 't_s1_q4_valueFixed': getT(1, 4, 'valueFixed'),

      // Detalhes cenário 2
      't_s2_q0_side': getT(2, 0, 'side'), 't_s2_q0_valueVar': getT(2, 0, 'valueVar'), 't_s2_q0_valueFixed': getT(2, 0, 'valueFixed'),
      't_s2_q1_side': getT(2, 1, 'side'), 't_s2_q1_valueVar': getT(2, 1, 'valueVar'), 't_s2_q1_valueFixed': getT(2, 1, 'valueFixed'),
      't_s2_q2_side': getT(2, 2, 'side'), 't_s2_q2_valueVar': getT(2, 2, 'valueVar'), 't_s2_q2_valueFixed': getT(2, 2, 'valueFixed'),
      't_s2_q3_side': getT(2, 3, 'side'), 't_s2_q3_valueVar': getT(2, 3, 'valueVar'), 't_s2_q3_valueFixed': getT(2, 3, 'valueFixed'),
      't_s2_q4_side': getT(2, 4, 'side'), 't_s2_q4_valueVar': getT(2, 4, 'valueVar'), 't_s2_q4_valueFixed': getT(2, 4, 'valueFixed'),

      // Detalhes cenário 3
      't_s3_q0_side': getT(3, 0, 'side'), 't_s3_q0_valueVar': getT(3, 0, 'valueVar'), 't_s3_q0_valueFixed': getT(3, 0, 'valueFixed'),
      't_s3_q1_side': getT(3, 1, 'side'), 't_s3_q1_valueVar': getT(3, 1, 'valueVar'), 't_s3_q1_valueFixed': getT(3, 1, 'valueFixed'),
      't_s3_q2_side': getT(3, 2, 'side'), 't_s3_q2_valueVar': getT(3, 2, 'valueVar'), 't_s3_q2_valueFixed': getT(3, 2, 'valueFixed'),
      't_s3_q3_side': getT(3, 3, 'side'), 't_s3_q3_valueVar': getT(3, 3, 'valueVar'), 't_s3_q3_valueFixed': getT(3, 3, 'valueFixed'),
      't_s3_q4_side': getT(3, 4, 'side'), 't_s3_q4_valueVar': getT(3, 4, 'valueVar'), 't_s3_q4_valueFixed': getT(3, 4, 'valueFixed'),
    };
  }).filter(row => row !== null) as any[];

  if (reportData.length === 0) {
    console.log('⚠️ Nenhum registro válido após os filtros.');
    return;
  }

  // Gerar CSV
  const headers = Object.keys(reportData[0]);
  const csvContent = [
    headers.join(','),
    ...reportData.map(row => 
      headers.map(header => {
        const val = row[header as keyof typeof row];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    )
  ].join('\n');

  const outputPath = path.join(__dirname, '../relatorio_resultados.csv');
  fs.writeFileSync(outputPath, '\ufeff' + csvContent); // BOM for Excel

  console.log(`✅ Relatório filtrado com sucesso (${reportData.length} registros).`);
}

async function main() {
  try {
    await generateReport();
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
