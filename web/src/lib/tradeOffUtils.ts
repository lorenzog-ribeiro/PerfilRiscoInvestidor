/**
 * Utility functions for calculating and interpreting trade-off profiles
 */

export interface TradeOffProfile {
  value: number;
  profile: string;
  description: string;
  category: 'conservador' | 'moderado' | 'arrojado';
}

/**
 * Calculate trade-off profile based on the calculated value
 * 
 * @param value - The calculated trade-off value (typically between 0 and 2)
 * @returns TradeOffProfile object with value, profile name, and description
 */
export function calculateTradeOffProfile(value: number): TradeOffProfile {
  // Normalize value to 0-2 range
  const normalizedValue = Math.max(0, Math.min(2, value));

  if (normalizedValue < 0.67) {
    return {
      value: normalizedValue,
      profile: 'Conservador',
      description:
        'Você apresenta uma preferência por segurança e estabilidade, evitando riscos elevados. Tende a priorizar a preservação do capital, mesmo que isso signifique menores retornos potenciais.',
      category: 'conservador',
    };
  } else if (normalizedValue < 1.33) {
    return {
      value: normalizedValue,
      profile: 'Moderado',
      description:
        'Você busca um equilíbrio entre segurança e crescimento, disposto a assumir riscos calculados. Aceita alguma volatilidade em busca de retornos mais significativos, mas mantém cautela.',
      category: 'moderado',
    };
  } else {
    return {
      value: normalizedValue,
      profile: 'Arrojado',
      description:
        'Você demonstra maior tolerância ao risco, priorizando potencial de retornos elevados. Está confortável com volatilidade e flutuações, focando em oportunidades de crescimento a longo prazo.',
      category: 'arrojado',
    };
  }
}

/**
 * Calculate average value from trade-off data
 * This is a simplified version - you might want to implement a more sophisticated algorithm
 * 
 * @param tradeOffData - The trade-off data from all scenarios
 * @returns The calculated average value
 */
export function calculateTradeOffValue(tradeOffData: any): number {
  if (!tradeOffData || Object.keys(tradeOffData).length === 0) {
    return 1; // Default to middle value if no data
  }

  // Extract final values from all scenarios
  const values: number[] = [];
  
  Object.values(tradeOffData).forEach((scenario: any) => {
    if (scenario.finalValue !== undefined) {
      values.push(scenario.finalValue);
    }
  });

  if (values.length === 0) {
    return 1; // Default to middle value
  }

  // Calculate average and normalize to 0-2 scale
  // This is a simplified approach - adjust based on your actual value ranges
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Assuming values are in a range that needs normalization
  // Adjust these constants based on your actual data range
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  if (range === 0) {
    return 1; // If all values are the same, return middle
  }
  
  // Normalize to 0-2 range
  const normalized = ((average - min) / range) * 2;
  
  return normalized;
}
