import { JSX } from "react";

interface CardConfig {
  badgeColor: string;
  badgeText: string;
  badgeTextColor: string;
  chartType: "split" | "full";
  chartColors: {
    gain: string;
    loss?: string;
  };
  ChartSubTittle: string;
  renderLabel: (
    fixedValue: number | undefined,
    value: number | undefined,
    centerX: number,
    centerY: number
  ) => JSX.Element | null;
}

interface ScenarioConfig {
  leftCard: CardConfig;
  rightCard: CardConfig;
}

export const scenarioConfigs: Record<number, ScenarioConfig> = {
  // Cenário 1: Padrão - Risco à esquerda, Certeza à direita
  1: {
    leftCard: {
      badgeColor: "bg-yellow-100",
      badgeText: "Investimento A",
      badgeTextColor: "text-yellow-800",
      chartType: "split",
      ChartSubTittle: "50% chance de ganhar 50% chance de não ter ganho",
      chartColors: {
        gain: "#228b22", // Verde
        loss: "#9ca3af", // Cinza
      },
      renderLabel: (fixedValue, value, centerX, centerY) => {
        if (!fixedValue || !value) return null;
        return (
          <g>
            <text
              x={centerX}
              y={centerY - 30}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              R${fixedValue.toLocaleString("pt-BR")}
            </text>
            <text
              x={centerX}
              y={centerY + 30}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              Sem Ganho
            </text>
          </g>
        );
      },
    },
    rightCard: {
      badgeColor: "bg-blue-100",
      badgeText: "Investimento B",
      badgeTextColor: "text-blue-800",
      chartType: "full",
      ChartSubTittle: "100% certeza de ganho",
      chartColors: {
        gain: "#228b22", // Verde
      },
      renderLabel: (fixedValue, value, centerX, centerY) => {
        if (!value) return null;
        return (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
          >
            {value !== undefined ? `R$${value.toLocaleString("pt-BR")}` : ""}
          </text>
        );
      },
    },
  },

  // Cenário 2: Valores invertidos no card A
  2: {
    rightCard: {
      badgeColor: "bg-blue-100",
      badgeText: "Investimento B",
      badgeTextColor: "text-blue-800",
      chartType: "split",
      ChartSubTittle: "50% chance de perda 50% chance de ganho",
      chartColors: {
        gain: "#228b22", // Verde
        loss: "red", // Cinza
      },
      renderLabel: (fixedValue, value, centerX, centerY) => {
        if (!fixedValue || !value) return null;
        return (
          <g>
            <text
              x={centerX}
              y={centerY - 30}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              R${fixedValue.toLocaleString("pt-BR")}
            </text>
            <text
              x={centerX}
              y={centerY + 30}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              {value !== undefined ? `R$${value.toLocaleString("pt-BR")}` : ""}
            </text>
          </g>
        );
      },
    },
    leftCard: {
      badgeColor: "bg-yellow-100",
      badgeText: "Investimento A",
      badgeTextColor: "text-yellow-800",
      ChartSubTittle: "Sem ganho ou perda com certeza",
      chartType: "full",
      chartColors: {
        gain: "#9ca3af", // Verde
      },
      renderLabel: (fixedValue, value, centerX, centerY) => {
        return (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
          >
            <tspan
              x={centerX}
              dy="-0.6em"
              className="fill-white text-sm font-bold"
            >
              Sem Ganho
            </tspan>
            <tspan
              x={centerX}
              dy="1.2em"
              className="fill-white text-sm font-bold"
            >
              ou Perda
            </tspan>
          </text>
        );
      },
    },
  },

  // Cenário 3: Invertido - Certeza à esquerda, Risco à direita
  3: {
    leftCard: {
      badgeColor: "bg-yellow-100",
      badgeText: "Investimento A",
      badgeTextColor: "text-yellow-800",
      chartType: "split",
      ChartSubTittle: "50% chance de não perder 50% chance de perda",
      chartColors: {
        gain: "#9ca3af", // Verde
        loss: "red", // Cinza
      },
      renderLabel: (fixedValue, value, centerX, centerY) => {
        if (!fixedValue || !value) return null;
        return (
          <g>
            <text
              x={centerX}
              y={centerY - 30}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              Sem perda
            </text>
            <text
              x={centerX}
              y={centerY + 30}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              R${fixedValue.toLocaleString("pt-BR")}
            </text>
          </g>
        );
      },
    },
    rightCard: {
      badgeColor: "bg-blue-100",
      badgeText: "Investimento B",
      badgeTextColor: "text-blue-800",
      ChartSubTittle: "100% certeza de perda",
      chartType: "full",
      chartColors: {
        gain: "red", // Verde
      },
      renderLabel: (fixedValue, value, centerX, centerY) => {
        return (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
          >
            {value !== undefined ? `R$${value.toLocaleString("pt-BR")}` : ""}
          </text>
        );
      },
    },
  },
};
