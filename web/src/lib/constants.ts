import { DospertDomainInfo } from './types';

export const investorQuestions = [
  {
    id: 'risk_pref_q1',
    text: 'Em geral, como seu(sua) melhor amigo(a) descreveria você em relação a assumir riscos?',
    options: [
      { choice: 'a', label: 'Um(a) verdadeiro(a) apostador(a); age primeiro, avalia depois' },
      { choice: 'b', label: 'Disposto(a) a correr riscos após análise cuidadosa; avalia primeiro, age com cautela' },
      { choice: 'c', label: 'Cauteloso(a); avança somente com muita segurança' },
      { choice: 'd', label: 'Evita riscos a qualquer custo' }
    ]
  },
  {
    id: 'risk_pref_q2',
    text: 'Você está em um programa de prêmios na TV e pode escolher uma das opções. Qual escolheria?',
    options: [
      { choice: 'a', label: 'R$ 5.000 em dinheiro agora' },
      { choice: 'b', label: '50% de chance de ganhar R$ 25.000' },
      { choice: 'c', label: '25% de chance de ganhar R$ 50.000' },
      { choice: 'd', label: '5% de chance de ganhar R$ 500.000' }
    ]
  },
  {
    id: 'risk_pref_q3',
    text: 'Você economizou para as “férias dos seus sonhos”... mas perdeu o emprego. Você iria:',
    options: [
      { choice: 'a', label: 'Cancelar as férias' },
      { choice: 'b', label: 'Fazer uma viagem muito mais modesta' },
      { choice: 'c', label: 'Viajar como planejado' },
      { choice: 'd', label: 'Prolongar as férias' }
    ]
  },
  {
    id: 'risk_pref_q4',
    text: 'Se você inesperadamente recebesse R$ 100.000 para investir, o que faria?',
    options: [
      { choice: 'a', label: 'Aplicaria em poupança, CDB de liquidez diária ou fundo DI.' },
      { choice: 'b', label: 'Investiria em títulos de renda fixa seguros ou em um fundo de renda fixa.' },
      { choice: 'c', label: 'Investiria em ações ou em um fundo de investimento em ações.' }
    ]
  },
  {
    id: 'risk_pref_q5',
    text: 'Em termos de experiência, quão confortável você se sente para investir em ações ou fundo de investimento em ações?',
    options: [
      { choice: 'a', label: 'Nada confortável' },
      { choice: 'b', label: 'Um pouco confortável' },
      { choice: 'c', label: 'Muito confortável' }
    ]
  },
  {
    id: 'risk_pref_q6',
    text: 'Quando você pensa na palavra “risco”, qual é a primeira palavra que vem à sua mente?',
    options: [
      { choice: 'a', label: 'Perda' },
      { choice: 'b', label: 'Incerteza' },
      { choice: 'c', label: 'Oportunidade' },
      { choice: 'd', label: 'Emoção' }
    ]
  },
  {
    id: 'risk_pref_q7',
    text: 'A maior parte do seu patrimônio está em renda fixa, um investimento seguro. Alguns especialistas projetam queda dos juros nos próximos meses e apontam oportunidades de ganhos no mercado de ações, mas também risco real de perdas. O que você faria?',
    options: [
      { choice: 'a', label: 'Manteria os investimentos de renda fixa,.' },
      { choice: 'b', label: 'Venderia metade; aplicaria parte em renda fixa de curto prazo e parte em ações.' },
      { choice: 'c', label: 'Venderia todos os títulos e investiria em ações.' },
      { choice: 'd', label: 'Venderia todos os títulos de renda fixa, investiria em ações e ainda pegaria empréstimo para investir mais.' }
    ]
  },
  {
    id: 'risk_pref_q8',
    text: 'Considere quatro investimentos hipotéticos, cada um com um resultado possível de maior ganho e outro de maior perda. Qual deles você prefere?',
    options: [
      { choice: 'a', label: 'R$ 1.000 de ganho no melhor resultado; R$ 0 no pior resultado', best: 1000, worst: 0 },
      { choice: 'b', label: 'R$ 4.000 de ganho no melhor resultado; R$ 1.000 de perda no pior resultado', best: 4000, worst: -1000 },
      { choice: 'c', label: 'R$ 13.000 de ganho no melhor resultado; R$ 4.000 de perda no pior resultado', best: 13000, worst: -4000 },
      { choice: 'd', label: 'R$ 24.000 de ganho no melhor resultado; R$ 12.000 de perda no pior resultado', best: 24000, worst: -12000 }
    ]
  },
  {
    id: 'risk_pref_q9',
    text: 'Imagine que você acabou de ganhar R$ 5.000. Agora você deve escolher entre:',
    options: [
      { choice: 'a', label: 'Ganho certo de R$ 2.500' },
      { choice: 'b', label: '50% de chance de ganhar R$ 5.000 e 50% de não ganhar nada' }
    ]
  },
  {
    id: 'risk_pref_q10',
    text: 'Além do que você já possui, você recebeu R$ 10.000. Escolha entre:',
    options: [
      { choice: 'a', label: 'Perda certa de R$ 2.500' },
      { choice: 'b', label: '50% de chance de perder R$ 5.000 e 50% de não perder nada' }
    ]
  },
  {
    id: 'risk_pref_q11',
    text: 'Você recebe uma herança de R$ 500.000 e deve investir TUDO em UMA opção:',
    options: [
      { choice: 'a', label: 'Poupança/Fundo DI' },
      { choice: 'b', label: 'Fundo balanceado (ações + renda fixa)' },
      { choice: 'c', label: 'Carteira com 15 ações' },
      { choice: 'd', label: 'Commodities (ouro, prata, petróleo)' }
    ]
  },
  {
    id: 'risk_pref_q12',
    text: 'Se você tem R$ 100.000 para investir, qual das seguintes opções de investimento você acharia mais atrativa?',
    options: [
      { choice: 'a', label: '60% em investimentos de baixo risco; 30% em investimentos de risco médio e 10% em investimentos de alto risco', low: 60, medium: 30, high: 10 },
      { choice: 'b', label: '30% em investimentos de baixo risco; 40% em investimentos de risco médio e 30% em investimentos de alto risco', low: 30, medium: 40, high: 30 },
      { choice: 'c', label: '10% em investimentos de baixo risco; 40% em investimentos de risco médio e 50% em investimentos de alto risco', low: 10, medium: 40, high: 50 }
    ]
  },
  {
    id: 'risk_pref_q13',
    text: 'Seu vizinho e amigo de confiança, geólogo experiente, está formando um grupo para investir na exploração de uma mina de ouro. A chance de sucesso é estimada em 20%. Em caso de fracasso, todo o valor investido seria perdido. Se você tivesse o dinheiro, quanto investiria?',
    options: [
      { choice: 'a', label: 'Nada' },
      { choice: 'b', label: 'Um mês de salário' },
      { choice: 'c', label: 'Três meses de salário' },
      { choice: 'd', label: 'Seis meses de salário' }
    ]
  }
];


export const scoreMap: Record<string, Record<string, number>> = { risk_pref_q1: { a: 4, b: 3, c: 2, d: 1 }, risk_pref_q2: { a: 1, b: 2, c: 3, d: 4 }, risk_pref_q3: { a: 1, b: 2, c: 3, d: 4 }, risk_pref_q4: { a: 1, b: 2, c: 3 }, risk_pref_q5: { a: 1, b: 2, c: 3 }, risk_pref_q6: { a: 1, b: 2, c: 3, d: 4 }, risk_pref_q7: { a: 1, b: 2, c: 3, d: 4 }, risk_pref_q8: { a: 1, b: 2, c: 3, d: 4 }, risk_pref_q9: { a: 1, b: 3 }, risk_pref_q10: { a: 1, b: 3 }, risk_pref_q11: { a: 1, b: 2, c: 3, d: 4 }, risk_pref_q12: { a: 1, b: 2, c: 3 }, risk_pref_q13: { a: 1, b: 2, c: 3, d: 4 }};

export const literacyQuestions = [
    { id: 'q1', text: 'Suponha que você tenha R$ 100,00 na poupança e a taxa de juros seja de 10% ao ano. Depois de 5 anos, quanto você acha que teria na conta se deixasse o dinheiro render?', options: ['Mais de R$ 150,00', 'Exatamente R$ 150,00', 'Menos de R$ 150,00', 'Não sabe'] },
    { id: 'q2', text: 'Sua conta poupança rende juros de 10% ao ano, mas a inflação é de 12% ao ano. Depois de 1 ano, o quanto você conseguiria comprar com o dinheiro dessa conta?', options: ['Mais do que hoje', 'Exatamente o mesmo que hoje', 'Menos do que hoje', 'Não sabe'] },
    { id: 'q3', text: 'Por favor, diga se esta afirmação é verdadeira ou falsa. “Comprar ações de uma única empresa geralmente proporciona um retorno mais seguro do que investir em um fundo de ações diversificado.”', options: ['Verdadeiro', 'Falso', 'Não sabe'] },
    { id: 'q4', text: 'Em uma escala de 1 a 5, em que 1 representa nenhum conhecimento e 5 representa conhecimento avançado, como você avaliaria seu nível de compreensão sobre conceitos e práticas de finanças pessoais e gestão do dinheiro?', options: ['1', '2', '3', '4', '5'], type: 'likert-5' },
];

export const literacyAnswers: Record<string, string> = {
    q1: 'Mais de R$ 150,00',
    q2: 'Menos do que hoje',
    q3: 'Falso',
};

export const literacyScale = {
    labels: {
        1: 'Nenhum conhecimento',
        2: 'Conhecimento básico',
        3: 'Conhecimento moderado',
        4: 'Conhecimento bom',
        5: 'Conhecimento avançado',
    },
};

export const dospertQuestions = [
  { id: 1,  domain: 'S',   text: 'Admitir que seus gostos são diferentes dos de um(a) amigo(a).' },
  { id: 2,  domain: 'R',   text: 'Acampar em um lugar de mata fechada ou isolado.' },
  { id: 3,  domain: 'F',   text: 'Apostar o equivalente a um dia de salário em corridas de cavalo.' },
  { id: 4,  domain: 'F',   text: 'Aplicar 10% do que você ganha por ano em um fundo de investimento que não é nem muito seguro, nem muito arriscado.' },
  { id: 5,  domain: 'H/S', text: 'Beber muito em uma confraternização.' },
  { id: 6,  domain: 'E',   text: 'Dar um "jeitinho" na declaração do Imposto de Renda para diminuir o valor a pagar.' },
  { id: 7,  domain: 'S',   text: 'Discordar abertamente da opinião de uma figura de autoridade (ex: chefe, pais, professor) sobre uma questão importante.' },
  { id: 8,  domain: 'F',   text: 'Apostar o valor de um dia de trabalho em uma partida de pôquer valendo muito dinheiro.' },
  { id: 9,  domain: 'E',   text: 'Ter um caso com uma pessoa casada.' },
  { id: 10, domain: 'E',   text: 'Receber crédito pelo trabalho de outra pessoa sem reconhecer o verdadeiro autor.' },
  { id: 11, domain: 'R',   text: 'Descer de bicicleta uma rua muito íngreme e em alta velocidade, além da sua habilidade.' },
  { id: 12, domain: 'F',   text: 'Investir 5% da sua renda anual em uma criptomoeda de alto risco que promete retornos rápidos.' },
  { id: 13, domain: 'R',   text: 'Descer corredeiras de bote em um período de cheia do rio, com correnteza forte.' },
  { id: 14, domain: 'F',   text: 'Apostar o equivalente a um dia de salário no resultado de uma partida de futebol.' },
  { id: 15, domain: 'H/S', text: 'Ter relações sexuais sem proteção com alguém que você acabou de conhecer.' },
  { id: 16, domain: 'E',   text: 'Contar um segredo de um(a) amigo(a) para outra pessoa.' },
  { id: 17, domain: 'H/S', text: 'Andar de carro sem usar cinto de segurança.' },
  { id: 18, domain: 'F',   text: 'Investir 10% do que você ganha por ano para começar um empreendimento/negócio.' },
  { id: 19, domain: 'R',   text: 'Fazer uma aula de paraquedismo.' },
  { id: 20, domain: 'H/S', text: 'Andar de motocicleta sem capacete.' },
  { id: 21, domain: 'S',   text: 'Escolher uma carreira que você realmente gosta em vez de uma que ofereça mais segurança ou prestígio.' },
  { id: 22, domain: 'S',   text: 'Falar abertamente o que pensa sobre um assunto polêmico ou impopular em uma reunião de trabalho.' },
  { id: 23, domain: 'H/S', text: 'Tomar sol sem usar protetor solar.' },
  { id: 24, domain: 'R',   text: 'Saltar de bungee-jumping de uma ponte.' },
  { id: 25, domain: 'R',   text: 'Pilotar um avião de pequeno porte.' },
  { id: 26, domain: 'H/S', text: 'Andar para casa sozinho(a) à noite em uma região perigosa da cidade.' },
  { id: 27, domain: 'S',   text: 'Ir morar em uma cidade ou estado longe de sua família.' },
  { id: 28, domain: 'S',   text: 'Iniciar uma nova carreira aos 35 anos.' },
  { id: 29, domain: 'E',   text: 'Deixar seus filhos pequenos sozinhos em casa enquanto sai para resolver algo rápido.' },
  { id: 30, domain: 'E',   text: 'Não devolver uma carteira que você encontrou com R$ 1.000 dentro.' }
];

export const dospertDomains: Record<string, DospertDomainInfo> = {
      'E': { name: 'Ético', items: [6, 9, 10, 16, 29, 30], color: 'bg-indigo-100', textColor: 'text-indigo-800' }, 
      'F': { name: 'Financeiro', items: [3, 4, 8, 12, 14, 18], color: 'bg-green-100', textColor: 'text-green-800' }, 
      'H/S': { name: 'Saúde/Segurança', items: [5, 15, 17, 20, 23, 26], color: 'bg-red-100', textColor: 'text-red-800' }, 
      'R': { name: 'Recreativo', items: [2, 11, 13, 19, 24, 25], color: 'bg-yellow-100', textColor: 'text-yellow-800' }, 
      'S': { name: 'Social', items: [1, 7, 21, 22, 27, 28], color: 'bg-blue-100', textColor: 'text-blue-800' }
};

export const dospertScale = { labels: [null, 'Extremamente improvável', 'Moderadamente improvável', 'Um pouco improvável', 'Nem improvável nem provável', 'Um pouco provável', 'Moderadamente provável', 'Extremamente provável']};

export const TPL_DOSPERT: Record<string, Record<string, string>> = { 
    E: { 
        Alta: 'No domínio ético, você parece tolerar comportamentos que envolvem quebra de normas sociais ou morais. Há tendência a aceitar riscos reputacionais, priorizando ganhos pessoais mesmo em situações eticamente questionáveis, como omitir informações ou apropriar-se de crédito alheio.', 
        Média: 'No domínio ético, você parece respeitar regras e convenções, mas com certa flexibilidade em contextos específicos. Há tendência a relativizar condutas morais diante de dilemas práticos, o que indica disposição para equilibrar princípios e benefícios imediatos.', 
        Baixa: 'No domínio ético, você parece valorizar rigidamente normas sociais e morais. Evita transgressões como enganar, trapacear ou explorar situações em benefício próprio, demonstrando tendência a preservar integridade e reputação pessoal. Essa postura sugere forte preocupação com imagem pública e confiança nas relações.' 
    }, 
    F: { 
        Alta: 'No domínio financeiro, você parece inclinado a assumir riscos significativos. Há tendência a investir em ativos especulativos, participar de apostas ou aplicar recursos em empreendimentos incertos, aceitando alta variabilidade nos resultados em busca de maiores ganhos.', 
        Média: 'No domínio financeiro, você parece moderadamente aberto a riscos. Demonstra tendência a aceitar investimentos diversificados ou novos negócios de forma controlada, avaliando cuidadosamente custos e benefícios antes de se expor a perdas potenciais.', 
        Baixa: 'No domínio financeiro, você parece conservador. Evita apostas ou investimentos de alto risco, como ações especulativas ou criptomoedas voláteis, e tende a privilegiar segurança e estabilidade em decisões econômicas. Existe tendência a proteger o patrimônio em vez de buscar retornos elevados.' 
    }, 
    'H/S': { 
        Alta: 'No domínio saúde/segurança, você parece tolerar riscos físicos elevados. Demonstra tendência a se envolver em comportamentos perigosos sem medidas de proteção adequadas, aceitando potenciais consequências negativas para saúde e segurança pessoal.', 
        Média: 'No domínio saúde/segurança, você parece alternar entre cuidados consistentes e comportamentos de risco moderado. Demonstra tendência a se expor em algumas situações, como consumo excessivo de álcool ou trânsito em locais inseguros, mas mantendo certo equilíbrio no cotidiano.', 
        Baixa: 'No domínio saúde/segurança, você parece adotar postura preventiva. Evita práticas como dirigir sem cinto, praticar sexo sem proteção ou frequentar áreas perigosas, demonstrando tendência a priorizar integridade física e longevidade.' 
    }, 
    R: { 
        Alta: 'No domínio recreativo, você parece inclinado a experiências intensas e radicais. Demonstra forte tendência a participar de atividades como paraquedismo, bungee-jumping ou rafting, valorizando emoção, adrenalina e novidade como elementos centrais do lazer.', 
        Média: 'No domínio recreativo, você parece buscar novidade em níveis moderados. Demonstra tendência a participar de atividades que envolvem desafio controlado, como trilhas, esportes supervisionados ou viagens a locais menos comuns.', 
        Baixa: 'No domínio recreativo, você parece preferir lazer seguro e previsível. Demonstra tendência a escolher atividades de baixo risco, como caminhadas, leitura ou práticas culturais, evitando esportes radicais ou experiências imprevisíveis.' 
    }, 
    S: { 
        Alta: 'No domínio social, você parece inclinado a se expor e afirmar posições com firmeza. Demonstra tendência a confrontar autoridades, mudar de carreira ou ambiente social com facilidade e valorizar autenticidade e independência, mesmo diante de críticas ou oposição.', 
        Média: 'No domínio social, você parece equilibrado. Demonstra tendência a se posicionar quando necessário, expressando opiniões de forma assertiva, mas sem exageros confrontativos, ajustando seu comportamento ao contexto.', 
        Baixa: 'No domínio social, você parece adotar postura cautelosa. Demonstra tendência a evitar conflitos e preservar a harmonia em interações, mesmo que precise silenciar opiniões pessoais ou evitar confrontos com autoridades.' 
    }
};