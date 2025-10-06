export type ChoiceId = string;

export type ISFBQuestion = {
  id: string;
  text: string;
  type: 'single' | 'likert5';
  options?: { choice: ChoiceId; label: string }[];
};

export type ISFBData = Record<string, ChoiceId>;

export type ISFBBand =
  | 'Ruim'
  | 'Muito Baixa'
  | 'Baixa'
  | 'Ok'
  | 'Boa'
  | 'Muito Boa'
  | 'Ótima';

export type ISFBResult = {
  part1Sum: number; // Soma bruta dos pontos da Parte 1
  index0to100: number; // Índice normalizado para a escala de 0 a 100
  band: ISFBBand; // Faixa de classificação
  profile: {
    title: ISFBBand;
    description: string;
    recommendation?: string; // Recomendação opcional para perfis mais baixos
  };
};

// -----------------------------
// 2. Questionário (Apenas Parte 1)
// -----------------------------
export const isfbPart1Questions: ISFBQuestion[] = [
  {
    id: 'p1_renda_vs_gastos',
    text: 'Nos últimos 12 meses, qual frase melhor descreve a comparação entre a renda total e os gastos na sua casa?',
    type: 'single',
    options: [
      { choice: 'a', label: 'Os gastos foram muito maiores que a renda' },
      { choice: 'b', label: 'Os gastos foram um pouco maiores que a renda' },
      { choice: 'c', label: 'Os gastos foram mais ou menos iguais à renda' },
      { choice: 'd', label: 'Os gastos foram um pouco menores que a renda' },
      { choice: 'e', label: 'Os gastos foram muito menores que a renda' },
    ],
  },
  // As opções para os itens 'likert5' são: 'Nada', 'Pouco', 'Mais ou menos', 'Muito', 'Totalmente'
  { id: 'p1_estresse_despesas', text: 'Preocupações com as despesas e compromissos financeiros são motivo de estresse na minha casa.', type: 'likert5' },
  { id: 'p1_padroes_reduzidos', text: 'Por causa dos compromissos financeiros assumidos, o padrão de vida da minha casa foi bastante reduzido.', type: 'likert5' },
  { id: 'p1_aperto_financeiro', text: 'Estou apertado(a) financeiramente.', type: 'likert5' },
  { id: 'p1_decisoes_complicadas', text: 'Eu sei tomar decisões financeiras complicadas.', type: 'likert5' },
  { id: 'p1_reconhecer_invest', text: 'Eu sou capaz de reconhecer um bom investimento.', type: 'likert5' },
  { id: 'p1_informar_decidir', text: 'Eu sei me informar para tomar decisões financeiras.', type: 'likert5' },
  { id: 'p1_autocontrole_gastos', text: 'Eu sei como me controlar para não gastar muito.', type: 'likert5' },
  { id: 'p1_obrigar_poupar', text: 'Eu sei como me obrigar a poupar.', type: 'likert5' },
  { id: 'p1_obrigar_metas', text: 'Eu sei como me obrigar a cumprir minhas metas financeiras.', type: 'likert5' },
  { id: 'p1_futuro_financeiro', text: 'Estou garantindo meu futuro financeiro.', type: 'likert5' },
  { id: 'p1_aproveitar_vida', text: 'O jeito que eu cuido do meu dinheiro me permite aproveitar a vida.', type: 'likert5' },
];

export const likert5Scale = [
    { value: 1, choice: 'a', label: 'Nada' },
    { value: 2, choice: 'b', label: 'Pouco' },
    { value: 3, choice: 'c', label: 'Mais ou menos' },
    { value: 4, choice: 'd', label: 'Muito' },
    { value: 5, choice: 'e', label: 'Totalmente' },
];

// -----------------------------
// 3. Gabarito e Textos de Feedback
// -----------------------------

const LIKERT5_MAP: Record<ChoiceId, number> = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
const NEGATIVE_ITEMS = new Set<string>(['p1_estresse_despesas', 'p1_padroes_reduzidos', 'p1_aperto_financeiro']);
const scoreMapPart1Single: Record<string, Record<ChoiceId, number>> = { p1_renda_vs_gastos: { a: 0, b: 1, c: 2, d: 3, e: 4 } };

const recommendationText = 'Para fortalecer sua saúde financeira, considere buscar orientação. Existem excelentes programas gratuitos oferecidos por universidades, como a [Clínica Financeira da UFMG](https://www.instagram.com/cfu.ufmg) e o [Serviço de Orientação Financeira da USP](https://jornal.usp.br/universidade/servico-de-orientacao-financeira-na-usp-completa-10-anos-com-inscricoes-para-nova-jornada/). Eles podem oferecer um ótimo suporte neste momento.';

export const isfbBandDetails: Record<ISFBBand, { description: string; recommendation?: string }> = {
  'Ruim': {
    description: 'Este é um ponto de partida para uma grande virada. O primeiro passo é entender suas contas e criar um plano para retomar o controle. Com organização, é totalmente possível construir um futuro financeiro mais tranquilo.',
    recommendation: recommendationText
  },
  'Muito Baixa': {
    description: 'Sua vida financeira está sob pressão, e imprevistos podem preocupar. Que tal focar em criar um pequeno fôlego no orçamento? Organizar as contas e identificar onde é possível economizar pode fazer uma grande diferença.',
    recommendation: recommendationText
  },
  'Baixa': {
    description: 'Você está perto de alcançar o equilíbrio, mas a jornada pode ser estressante. O foco agora pode ser em consolidar o controle dos seus gastos. Criar uma pequena reserva de emergência será um grande passo para sua tranquilidade.',
    recommendation: recommendationText
  },
  'Ok': {
    description: 'Parabéns, você alcançou o equilíbrio! Suas contas estão em dia. O próximo passo é transformar esse equilíbrio em segurança, construindo uma reserva para imprevistos e começando a planejar seus objetivos maiores.'
  },
  'Boa': {
    description: 'Muito bem! Você já tem um ótimo controle financeiro e consegue fazer o dinheiro trabalhar para você. Continue fortalecendo seus investimentos e aproveite a segurança que você construiu para realizar seus sonhos.'
  },
  'Muito Boa': {
    description: 'Sua gestão financeira é excelente e serve de inspiração. Você tem segurança para lidar com imprevistos e liberdade para fazer escolhas. Agora, o foco é otimizar seus investimentos para alcançar objetivos ainda mais ambiciosos.'
  },
  'Ótima': {
    description: 'Fantástico! Você alcançou a maestria em suas finanças. Sua disciplina e planejamento te dão total segurança e liberdade para aproveitar a vida e realizar grandes projetos. Continue nesse caminho de prosperidade!'
  },
};

// -----------------------------
// 4. Funções de Cálculo e Classificação
// -----------------------------

function classifyISFB(index0to100: number): ISFBBand {
  if (index0to100 >= 83) return 'Ótima';
  if (index0to100 >= 69) return 'Muito Boa';
  if (index0to100 >= 61) return 'Boa';
  if (index0to100 >= 57) return 'Ok';
  if (index0to100 >= 50) return 'Baixa';
  if (index0to100 >= 37) return 'Muito Baixa';
  return 'Ruim';
}

function calculatePart1Sum(responses: ISFBData): number {
  return isfbPart1Questions.reduce((sum, q) => {
    const ans = responses[q.id];
    if (typeof ans !== 'string') return sum;

    let score = 0;
    if (q.type === 'likert5') {
      const baseScore = LIKERT5_MAP[ans] ?? 0;
      score = NEGATIVE_ITEMS.has(q.id) ? (4 - baseScore) : baseScore;
    } else if (q.id in scoreMapPart1Single) {
      score = scoreMapPart1Single[q.id][ans] ?? 0;
    }
    return sum + score;
  }, 0);
}

function normalizePart1Score(part1Sum: number): number {
    const MAX_PART1_SCORE = 48; // A soma máxima teórica da Parte 1 é 48
    const normalized = Math.round((part1Sum / MAX_PART1_SCORE) * 100);
    return Math.max(0, Math.min(normalized, 100)); // Garante que o resultado esteja entre 0 e 100
}

export function calculateISFB_Part1_Only(responses: ISFBData): ISFBResult {
  const part1Sum = calculatePart1Sum(responses);
  const index0to100 = normalizePart1Score(part1Sum);
  const band = classifyISFB(index0to100);
  const profileDetails = isfbBandDetails[band];
  
  const profile = {
    title: band,
    description: profileDetails.description,
    // Adiciona a recomendação condicionalmente
    ...(profileDetails.recommendation && { recommendation: profileDetails.recommendation })
  };

  return { part1Sum, index0to100, band, profile };
}