/* eslint-disable @typescript-eslint/no-explicit-any */
export function atualizarMediana(scenario: any, escolha: "A" | "B") {
    const { limiteSup, limiteInf } = scenario;
    const novaMediana = (limiteSup + limiteInf) / 2;
  
    // Atualiza os limites com base na escolha
    let novoLimiteSup = limiteSup;
    let novoLimiteInf = limiteInf;
  
    if (escolha === "A") {
      // Usuário escolheu a certeza → risco era muito alto → reduz limite superior
      novoLimiteSup = novaMediana;
    } else if (escolha === "B") {
      // Usuário aceitou o risco → valor certo é baixo demais → aumenta limite inferior
      novoLimiteInf = novaMediana;
    }
  
    // Critério de parada (convergência)
    const convergiu = Math.abs(novoLimiteSup - novoLimiteInf) < 10;
  
    return {
      ...scenario,
      a: { valor: novaMediana },
      limiteSup: novoLimiteSup,
      limiteInf: novoLimiteInf,
      convergiu,
    };
  }
  