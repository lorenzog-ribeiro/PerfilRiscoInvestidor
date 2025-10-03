import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { TradeOffService } from "../../../services/TradeOffService";
import { LabelProps } from "recharts";

interface SelectedInterface {
  optionSelected: string;
  valueSelected: number;
}

interface ApiResponse {
  forecast: {
    mediana: number;
    valor_fixo: number;
  };
}

const dataB = [
  { name: "Ganho", value: 50, color: "#228b22" },
  { name: "Perda", value: 50, color: "gray" },
];

interface TradeOffFormProps {
  scenario: number;
  title?: string;
  onAnswered: () => void;
  onValueSelected?: (value: number) => void; // NOVA
  initialFixedValue?: number | null; // NOVA
}

export default function TradeOffForm({
  scenario,
  title,
  onAnswered,
  onValueSelected,
  initialFixedValue,
}: TradeOffFormProps) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<number>();
  const [fixedValue, setFixedValue] = useState<number>();
  const [selected, setSelected] = useState<SelectedInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalQuestions] = useState(7);
  const [selectionHistory, setSelectionHistory] = useState<string[]>([]);
  const tradeOffService = useMemo(() => new TradeOffService(), []);

  useEffect(() => {
    if (index !== 0) return;

    const fetchData = async () => {
      setLoading(true);
      setSelected(null);
      try {
        if (index === 0 && scenario === 3) {
          const response = await tradeOffService.tradeOff({
            scenario: scenario,
            optionSelected: "left",
            valueVar: 0,
            valueFixed: initialFixedValue ?? 0,
            question: 0,
          });

          if (response?.data?.forecast) {
            const { mediana, valor_fixo } = response.data.forecast;
            setValue(mediana);
            setFixedValue(valor_fixo);
          }
        } else {
          const response: { data: ApiResponse } =
            await tradeOffService.getTradeOffValues(scenario);
          const { mediana, valor_fixo } = response.data.forecast;

          setValue(mediana);
          setFixedValue(valor_fixo);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tradeOffService, onAnswered, scenario, initialFixedValue]);

  const handleSelection = async (data: SelectedInterface) => {
    if (loading) return;

    setSelected(data);
    setLoading(true);

    // Registers the choice for the 'pattern' logic.
    const updatedHistory = [...selectionHistory, data.optionSelected].slice(-4);
    setSelectionHistory(updatedHistory);

    // Checks if the sequence of choices ends the test.
    const lastFour = updatedHistory.join("");
    if (lastFour === "ABAA" || lastFour === "BABB") {
      if (onValueSelected) {
        onValueSelected(data.valueSelected);
      }
      onAnswered();
      return;
    }

    try {
      const valueToSend = data.valueSelected;
      const response = await tradeOffService.tradeOff({
        scenario: scenario,
        optionSelected: data.optionSelected,
        valueVar: valueToSend,
        valueFixed: fixedValue ?? 0,
        question: index,
      });

      if (response?.data?.forecast) {
        const { mediana, valor_fixo } = response.data.forecast;

        setValue(mediana);
        setFixedValue(valor_fixo);

        // Verifica condição de parada
        // if (Math.abs(mediana - valor_fixo) < 10 || mediana < 10) {
        //   onAnswered();
        //   return;
        // }

        if (onValueSelected) {
          onValueSelected(data.valueSelected);
        }
      }
      const nextIndex =
        index === 0 ? 2 : Math.min(index + 1, totalQuestions - 1);

      if (nextIndex >= totalQuestions - 1) {
        onAnswered();
        return;
      }

      setIndex(nextIndex);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao enviar a escolha:", error);
      setLoading(false); // Ensures the loading state is disabled on failure.
    }
  };

  const progress = ((index + 1) / totalQuestions) * 100;

  return (
    <div>
      <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mb-4 mx-auto">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div
        className={`grid grid-cols-2 md:grid-cols-2 gap-2 m-2 ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Card
          onClick={() =>
            handleSelection({
              optionSelected: "A",
              valueSelected: value ?? 0,
            })
          }
          className={`cursor-pointer border-2 transition-all duration-300 ${
            selected?.optionSelected === "A"
              ? "border-green-500"
              : "border-blue-300"
          } ${loading ? "animate-pulse" : ""}`}
        >
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center justify-center">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Investimento A
              </span>
            </div>
            <div className="text-xs text-center text-gray-600 p-6">
              <div>
                <b>50%</b> chance de ganhar
              </div>
              <div>
                <b>50%</b> chance de não ter ganho
              </div>
            </div>
            <div className="flex justify-center items-center pt-2">
              <PieChart width={180} height={180}>
                <Pie
                  stroke="white"
                  strokeWidth={3}
                  data={dataB}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                >
                  {dataB.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                  <Label
                    content={(props: LabelProps) => {
                      const { cx, cy } = props || {};
                      const centerX = typeof cx === "number" ? cx : 90;
                      const centerY = typeof cy === "number" ? cy : 90;

                      // Só renderiza se tiver valores
                      if (!fixedValue || !value) return null;

                      // Cenário 2: valor variável em cima, fixo embaixo
                      if (scenario === 2) {
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
                              R${value.toLocaleString("pt-BR")}
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
                      }

                      // Cenário 1: padrão (valor fixo em cima, "Sem Ganho" embaixo)
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
                            Sem Ganho
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            handleSelection({ optionSelected: "B", valueSelected: value ?? 0 })
          }
          className={`cursor-pointer border-2 transition-all duration-300 ${
            selected?.optionSelected === "B"
              ? "border-green-500"
              : "border-blue-300"
          } ${loading ? "animate-pulse" : ""}`}
        >
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center justify-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Investimento B
              </span>
            </div>
            <div className="text-xs text-center text-gray-600 p-6">
              <div>
                <b>100%</b> certeza de ganho
              </div>
            </div>
            <div className="flex justify-center items-center pt-9.5">
              <PieChart width={180} height={180}>
                <Pie
                  data={[{ name: "Ganho", value: 100, color: "#228b22" }]}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                  strokeWidth={0}
                >
                  <Label
                    content={(props: LabelProps) => {
                      const { cx, cy } = props || {};
                      const centerX = typeof cx === "number" ? cx : 90;
                      const centerY = typeof cy === "number" ? cy : 90;

                      // Só renderiza se tiver valor
                      if (!value && scenario !== 2) return null;

                      // Cenário 2: texto fixo
                      if (scenario === 2) {
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
                            Ganho Certo
                          </text>
                        );
                      }

                      // Cenário 1: padrão (mostra o valor)
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
                          R${(value ?? 0).toLocaleString("pt-BR")}
                        </text>
                      );
                    }}
                  />
                  <Cell key={`cell-1`} fill="#228b22" />
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Carregando próxima pergunta...
        </div>
      )}
    </div>
  );
}
