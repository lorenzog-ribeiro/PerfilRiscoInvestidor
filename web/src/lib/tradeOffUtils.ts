/**
 * Utility functions for calculating and interpreting trade-off profiles
 *
 * Cada cenário do jogo é uma bissecção que termina num equivalente certo (CE):
 *   Cenário 1 (ganho): 50% de ganhar R$1.000 vs ganho certo  -> CE1, neutro = 500 (o EV)
 *   Cenário 2 (misto): 50% ganhar 1.000 / 50% perder L vs nada -> CE2 = -L no ponto de indiferença
 *   Cenário 3 (perda): 50% de perder |CE2| vs perda certa      -> CE3, neutro = 0,5 * CE2 (o EV)
 *
 * Cada CE só tem sentido comparado ao seu próprio ponto de neutralidade ao risco.
 * Daí as razões r1 e r3, ambas centradas em 1 = neutro, que é a escala que os
 * cortes de perfil abaixo (0,67 / 1,33) assumem.
 */

import type { TradeOffData } from '@/services/types';

/** Valor esperado do prospecto de ganho do cenário 1 (50% de R$1.000). */
const GAIN_SCENARIO_EV = 500;

export interface TradeOffProfile {
  value: number;
  profile: string;
  description: string;
  category: 'conservador' | 'moderado' | 'arrojado';
}

export interface TradeOffIndices {
  /**
   * Tolerância ao risco em ganhos: CE1 / 500 (o EV).
   * Avesso aceita um ganho certo MENOR que o EV -> <1. Propenso -> >1.
   */
  gain: number;
  /**
   * Tolerância ao risco em perdas: espelho de CE3 / (0,5 * CE2).
   * Em perdas o sinal se inverte: o avesso aceita como equivalente uma perda
   * certa PIOR que o EV, ou seja |CE3| > |CE2|/2, o que dá razão >1. O espelho
   * (2 - razão) põe as duas dimensões na mesma direção — sem isso, somar gain e
   * loss cancela o sinal (na amostra de 260, a correlação com o questionário cai
   * de 0,25 para 0,06).
   */
  loss: number;
  /** Aversão à perda do cenário misto: 1000 / |CE2|. ~2 na literatura. */
  lossAversion: number;
  /** Índice composto usado para classificar o perfil: média de gain e loss. */
  value: number;
}

/**
 * Calculate trade-off profile based on the calculated value
 *
 * @param value - Índice composto, centrado em 1 (neutro ao risco)
 * @returns TradeOffProfile object with value, profile name, and description
 */
export function calculateTradeOffProfile(value: number): TradeOffProfile {
  if (value < 0.67) {
    return {
      value,
      profile: 'Conservador',
      description:
        'Você apresenta uma preferência por segurança e estabilidade, evitando riscos elevados. Tende a priorizar a preservação do capital, mesmo que isso signifique menores retornos potenciais.',
      category: 'conservador',
    };
  } else if (value < 1.33) {
    return {
      value,
      profile: 'Moderado',
      description:
        'Você busca um equilíbrio entre segurança e crescimento, disposto a assumir riscos calculados. Aceita alguma volatilidade em busca de retornos mais significativos, mas mantém cautela.',
      category: 'moderado',
    };
  } else {
    return {
      value,
      profile: 'Arrojado',
      description:
        'Você demonstra maior tolerância ao risco, priorizando potencial de retornos elevados. Está confortável com volatilidade e flutuações, focando em oportunidades de crescimento a longo prazo.',
      category: 'arrojado',
    };
  }
}

/**
 * Calculate the trade-off indices from the three scenarios' certainty equivalents.
 *
 * @param tradeOffData - The trade-off data from all scenarios
 * @returns The indices, or null when any scenario is missing/degenerate
 */
export function calculateTradeOffIndices(
  tradeOffData: TradeOffData | null | undefined
): TradeOffIndices | null {
  if (!tradeOffData) return null;

  const ce1 = tradeOffData[1]?.finalValue;
  const ce2 = tradeOffData[2]?.finalValue;
  const ce3 = tradeOffData[3]?.finalValue;

  if (![ce1, ce2, ce3].every((v) => typeof v === 'number' && Number.isFinite(v))) {
    return null;
  }
  // CE2 = 0 significa que o participante recusou qualquer perda: sem ponto de
  // neutralidade para o cenário 3, o índice de perdas não é definido.
  if (ce2 === 0) return null;

  const gain = ce1 / GAIN_SCENARIO_EV;
  const loss = 2 - ce3 / (0.5 * ce2);
  const lossAversion = 1000 / Math.abs(ce2);

  return { gain, loss, lossAversion, value: (gain + loss) / 2 };
}

/**
 * Calculate the composite trade-off value used to classify the profile.
 *
 * @returns The composite value, or null when it cannot be computed
 */
export function calculateTradeOffValue(
  tradeOffData: TradeOffData | null | undefined
): number | null {
  return calculateTradeOffIndices(tradeOffData)?.value ?? null;
}
