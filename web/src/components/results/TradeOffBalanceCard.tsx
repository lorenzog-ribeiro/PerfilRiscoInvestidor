import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";

interface TradeOffBalanceCardProps {
  tradeOffValue: number; // Valor entre 0 e 2
  profile: string;
  description: string;
}

const TradeOffBalanceCard: React.FC<TradeOffBalanceCardProps> = ({
  tradeOffValue,
  profile,
  description,
}) => {
  const [posicao, setPosicao] = useState<{ cx: number; cy: number }>({
    cx: 200,
    cy: 125,
  });
  const [linhaFinal, setLinhaFinal] = useState<{ x: number; y: number }>({
    x: 220,
    y: 160,
  });

  useEffect(() => {
    // Função para calcular a posição da bolinha (roldana) ao longo da linha azul
    const calcularPosicaoBolinha = (valor: number) => {
      const P0 = { x: 50, y: 200 }; // Ponto inicial da linha azul (ESTAÇÃO A)
      const P1 = { x: 350, y: 50 }; // Ponto final da linha azul (ESTAÇÃO B)

      // Calculando a posição t (de 0 a 1) baseado no valor, que define onde a bolinha vai estar
      let t = Math.max(0, Math.min(1, valor / 2)); // Normaliza o valor para estar entre 0 e 1

      // Interpolação linear para calcular a posição da bolinha
      const cx = P0.x + t * (P1.x - P0.x);
      const cy = P0.y + t * (P1.y - P0.y);

      return { cx, cy };
    };

    // Atualizando a posição da bolinha com base no valor
    const novaPosicao = calcularPosicaoBolinha(tradeOffValue);
    setPosicao(novaPosicao);

    // Calculando o final da linha cinza (usando o mesmo ângulo das linhas vermelha e verde)
    // Delta x = 20, Delta y = 35 para manter o mesmo ângulo
    setLinhaFinal({
      x: novaPosicao.cx + 20,
      y: novaPosicao.cy + 35,
    });
  }, [tradeOffValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Escala Retorno × Risco
        </CardTitle>
        <CardDescription>
          Visualização do seu perfil de trade-off
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          {/* SVG da Balança/Escala */}
          <svg
            viewBox="0 0 400 250"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md"
          >
            <rect x="0" y="0" width="400" height="250" fill="#f8fafc" rx="8" />

            {/* Linha azul fixa (linha de base) */}
            <line
              x1="50"
              y1="200"
              x2="350"
              y2="50"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="6,4"
            />

            {/* Bolinha vermelha (ESTAÇÃO A - Baixo Risco) */}
            <circle cx="120" cy="165" r="5" fill="#ef4444" />
            <line
              x1="120"
              y1="165"
              x2="140"
              y2="200"
              stroke="#ef4444"
              strokeWidth="2"
            />

            {/* Linha cinza (Com mesmo ângulo das linhas verde e vermelha) */}
            <line
              x1={posicao.cx}
              y1={posicao.cy}
              x2={linhaFinal.x}
              y2={linhaFinal.y}
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* Bolinha cinza (Posição do usuário) */}
            <circle cx={posicao.cx} cy={posicao.cy} r="6" fill="#64748b" />
            <circle cx={posicao.cx} cy={posicao.cy} r="4" fill="#94a3b8" />

            {/* Bolinha verde (ESTAÇÃO B - Alto Risco) */}
            <circle cx="280" cy="85" r="5" fill="#22c55e" />
            <line
              x1="280"
              y1="85"
              x2="305"
              y2="130"
              stroke="#22c55e"
              strokeWidth="2"
            />

            {/* Rótulos */}
            <text x="10" y="30" fontSize="10" fill="#64748b" fontWeight="bold">
              RETORNO
            </text>
            <text
              x="340"
              y="240"
              fontSize="10"
              fill="#64748b"
              fontWeight="bold"
            >
              RISCO
            </text>

            {/* Indicadores das estações */}
            <text x="95" y="220" fontSize="9" fill="#ef4444" fontWeight="bold">
              Conservador
            </text>
            <text x="255" y="70" fontSize="9" fill="#22c55e" fontWeight="bold">
              Arrojado
            </text>
          </svg>
        </div>

        {/* Perfil e Descrição */}
        <div className="space-y-4 pt-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Perfil Identificado
            </h4>
            <p className="text-base font-bold text-blue-800">{profile}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Descrição
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>    
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeOffBalanceCard;
