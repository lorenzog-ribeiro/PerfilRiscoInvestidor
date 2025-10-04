import { JSX } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { LabelProps } from "recharts";

interface CardConfig {
  badgeColor: string;
  badgeText: string;
  badgeTextColor: string;
  chartType: "split" | "full";
  ChartSubTittle: string;
  chartColors: {
    gain: string;
    loss?: string;
  };
  renderLabel: (
    fixedValue: number | undefined,
    value: number | undefined,
    centerX: number,
    centerY: number
  ) => JSX.Element | null;
}

interface TradeOffCardProps {
  config: CardConfig;
  optionId: "A" | "B";
  value: number | undefined;
  fixedValue: number | undefined;
  isSelected: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function TradeOffCard({
  config,
  value,
  fixedValue,
  isSelected,
  isLoading,
  onClick,
}: TradeOffCardProps) {
  // Gera dados do gráfico baseado no tipo
  const chartData =
    config.chartType === "split"
      ? [
          { name: "Ganho", value: 50, color: config.chartColors.gain },
          {
            name: "Perda",
            value: 50,
            color: config.chartColors.loss || "#9ca3af",
          },
        ]
      : [{ name: "Ganho", value: 100, color: config.chartColors.gain }];

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer border-2 transition-all duration-300 ${
        isSelected ? "border-green-500" : "border-blue-300"
      } ${isLoading ? "animate-pulse" : ""}`}
    >
      <CardContent className="p-2 space-y-2">
        {/* Badge */}
        <div className="flex items-center justify-center">
          <span
            className={`${config.badgeColor} ${config.badgeTextColor} px-3 py-1 rounded-full text-sm font-medium`}
          >
            {config.badgeText}
          </span>
        </div>

        {/* Descrição */}
        <div className="text-xs text-center text-gray-600 p-6">
          {config.chartType === "split" ? (
            <>
              <div>{config.ChartSubTittle}</div>
            </>
          ) : (
            <div>{config.ChartSubTittle}</div>
          )}
        </div>

        {/* Gráfico */}
        <div
          className={`flex justify-center items-center ${
            config.chartType === "full" ? "pt-9.5" : "pt-2"
          }`}
        >
          <PieChart width={180} height={180}>
            <Pie
              stroke={config.chartType === "split" ? "white" : "none"}
              strokeWidth={config.chartType === "split" ? 3 : 0}
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
              <Label
                content={(props: LabelProps) => {
                  const { cx, cy } = props || {};
                  const centerX = typeof cx === "number" ? cx : 90;
                  const centerY = typeof cy === "number" ? cy : 90;

                  return config.renderLabel(
                    fixedValue,
                    value,
                    centerX,
                    centerY
                  );
                }}
              />
            </Pie>
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
