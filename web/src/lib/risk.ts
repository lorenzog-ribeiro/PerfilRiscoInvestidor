export type RiskClass =
  | "alta"
  | "acima_da_media"
  | "moderada"
  | "abaixo_da_media"
  | "baixa";

/**
 * Limita um número entre 0 e 1.
 * @param v O número a ser limitado.
 * @returns O número limitado.
 */
function clamp01(v: number) { 
  return Math.max(0, Math.min(1, v)); 
}

/** Componente de aversão à perda r_LA ∈ [0,1] a partir do LAcoefficient. */
function rLA_fromLAcoef(LA: number): number {
  if (!Number.isFinite(LA)) throw new Error("LA inválido");
  LA = Math.max(0.5, Math.min(5.0, LA)); // Blinda o domínio esperado
  const eps = 1e-3; // Epsilon para comparação de ponto flutuante
  if (LA < 1.0 - eps) return 0.80;
  if (Math.abs(LA - 1.0) <= eps) return 0.50;
  if (LA <= 1.50 + eps) return 0.30;
  return 0.10; // LA > 1.50
}

/** Componente do score de risco r_RT ∈ [0,1] a partir do score. */
function rRT_fromScore(score: number): number {
  if (!Number.isFinite(score)) throw new Error("score inválido");
  score = Math.max(0, Math.min(40, score)); // Blinda o domínio esperado
  if (score >= 33) return 0.90;
  if (score >= 29) return 0.70;
  if (score >= 23) return 0.50;
  if (score >= 19) return 0.30;
  return 0.10; // score <= 18
}

/** Combinação ponderada e reescala para S ∈ [1,10]. */
export function combinedRisk(
  LA: number,
  score: number,
  wLA = 1,
  wRT = 1,
  renorm = true // Parâmetro para normalizar e usar a escala completa
) {
  if (wLA <= 0 || wRT <= 0) throw new Error("pesos devem ser > 0");
  const rLA = rLA_fromLAcoef(LA);
  const rRT = rRT_fromScore(score);

  // Média ponderada bruta
  const u_raw = (wLA * rLA + wRT * rRT) / (wLA + wRT);

  // Limites teóricos com base nas âncoras e pesos
  const RLA_MIN = 0.10, RLA_MAX = 0.80;
  const RRT_MIN = 0.10, RRT_MAX = 0.90;
  const u_min = (wLA * RLA_MIN + wRT * RRT_MIN) / (wLA + wRT);
  const u_max = (wLA * RLA_MAX + wRT * RRT_MAX) / (wLA + wRT);

  // Normalização opcional para usar a faixa completa de 1 a 10
  const u_norm = renorm && (u_max - u_min > 0)
    ? clamp01((u_raw - u_min) / (u_max - u_min))
    : clamp01(u_raw);

  const S = 1 + 9 * u_norm; // Garante que S esteja em [1,10]
  const S_int = Math.round(S);

  let klass: RiskClass;
  if (S >= 8.5) klass = "alta";
  else if (S >= 7.0) klass = "acima_da_media";
  else if (S >= 5.0) klass = "moderada";
  else if (S >= 3.5) klass = "abaixo_da_media";
  else klass = "baixa";

  // Retorna u_raw e u_norm para fins de auditoria
  return { S, S_int, u_raw, u_norm, rLA, rRT, klass };
}
