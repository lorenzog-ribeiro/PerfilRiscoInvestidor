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
      { choice: 'a', label: 'Manteria os os investimentos de renda fixa,.' },
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
    { id: 1, text: 'Investir 10% de sua renda anual em um novo negócio de risco moderado.' },
    { id: 2, text: 'Ir a uma festa onde você não conhece ninguém.' },
    { id: 3, text: 'Falar em público para uma grande audiência.' },
    { id: 4, text: 'Experimentar um esporte radical como bungee jumping.' },
    { id: 5, text: 'Mudar de carreira para uma área completamente nova.' },
];


export const dospertScale = { labels: [null, 'Extremamente improvável', 'Moderadamente improvável', 'Um pouco improvável', 'Nem improvável nem provável', 'Um pouco provável', 'Moderadamente provável', 'Extremamente provável']};
