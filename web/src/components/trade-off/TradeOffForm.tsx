import { useEffect, useMemo, useState } from "react";
import { TradeOffService } from "../../../services/TradeOffService";
import { scenarioConfigs } from "./config";
import TradeOffCard from "./TradeOffCard";

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

interface TradeOffFormProps {
  scenario: number;
  title?: string;
  onAnswered: () => void;
  onValueSelected?: (value: number) => void;
  initialFixedValue?: number | null;
}

export default function TradeOffForm({
  scenario,
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

  // Obtém a configuração do cenário atual
  const config = scenarioConfigs[scenario] || scenarioConfigs[1];

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
  }, [tradeOffService, onAnswered, scenario, initialFixedValue, index]);

  const handleSelection = async (data: SelectedInterface) => {
    if (loading) return;

    setSelected(data);
    setLoading(true);

    const updatedHistory = [...selectionHistory, data.optionSelected].slice(-4);
    setSelectionHistory(updatedHistory);

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
      setLoading(false);
    }
  };

  const progress = ((index + 1) / totalQuestions) * 100;

  return (
    <div>
      {/* Barra de Progresso */}
      <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mb-4 mx-auto">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Grid de Cards */}
      <div
        className={`grid grid-cols-2 md:grid-cols-2 gap-2 m-2 ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Card Esquerdo (A) */}
        <TradeOffCard
          config={config.leftCard}
          optionId="A"
          value={value}
          fixedValue={fixedValue}
          isSelected={selected?.optionSelected === "A"}
          isLoading={loading}
          onClick={() =>
            handleSelection({
              optionSelected: "A",
              valueSelected: value ?? 0,
            })
          }
        />

        {/* Card Direito (B) */}
        <TradeOffCard
          config={config.rightCard}
          optionId="B"
          value={value}
          fixedValue={fixedValue}
          isSelected={selected?.optionSelected === "B"}
          isLoading={loading}
          onClick={() =>
            handleSelection({
              optionSelected: "B",
              valueSelected: value ?? 0,
            })
          }
        />
      </div>

      {/* Indicador de Loading */}
      {loading && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Carregando próxima pergunta...
        </div>
      )}
    </div>
  );
}
