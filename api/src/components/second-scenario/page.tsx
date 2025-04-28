import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { Progress } from "@/components/ui/progress";
import { ScenariosService } from "../../../services/scenariosService";
import { useSearchParams } from "next/navigation";

interface SelectedInterface {
  optionSelected: string,
  valueSelected: number
}

const dataB = [
  { name: "Ganho", value: 50, color: "red", label: "+R$1.000" },
  { name: "Perda", value: 50, color: "#228b22", label: "R$1000" },
];

export default function FirstScenario() {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<number>(); // Mediana
  const [fixedValue, setFixedValue] = useState<number>(); // Valor Fixo
  const [selected, setSelected] = useState<SelectedInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalQuestions] = useState(8);
  const scenariosService = useMemo(() => new ScenariosService(), []);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // Ref para controlar se já fizemos a primeira chamada
  const initialLoadDone = useRef(false);
  // Ref para monitorar o estado de carregamento
  const isLoadingRef = useRef(false);

  // Função para buscar dados para uma questão específica
  const fetchQuestionData = (questionIndex: number) => {
    if (!userId) return;
    
    setLoading(true);
    isLoadingRef.current = true;
    
    console.log(`Fetching data for question index: ${questionIndex}`);
    
    scenariosService
      .getloss(questionIndex, userId)
      .then((response: { data: any }) => {
        console.log("API Response:", response.data);
        setValue(response.data.forecast.mediana);
        setFixedValue(response.data.forecast.valor_fixo);
        setLoading(false);
        isLoadingRef.current = false;
      })
      .catch((error: { message: string }) => {
        console.log("API Error:", error.message);
        setLoading(false);
        isLoadingRef.current = false;
      });
  };

  // Carrega os dados da primeira questão apenas uma vez na inicialização
  useEffect(() => {
    if (userId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchQuestionData(index);
    }
  }, [userId]);

  // Reseta a seleção quando os valores são atualizados
  useEffect(() => {
    setSelected(null);
  }, [value, fixedValue]);

  const getBarColor = () => {
    if (index === totalQuestions - 1) {
      return "from-green-500 to-green-400";
    }
    return "from-red-500 to-orange-400";
  };

  const sideSelected = (data: SelectedInterface) => {
    // Não processar cliques se estiver carregando
    if (loading || isLoadingRef.current) return;
    
    setSelected(data);
    
    // Avançar para a próxima pergunta após um breve delay
    setTimeout(() => handleNext(data), 500);
  };

  const handleNext = (currentSelected: SelectedInterface) => {
    if (!currentSelected || !userId || loading || isLoadingRef.current) return;

    setLoading(true);
    isLoadingRef.current = true;

    // Determinar qual valor enviar
    const valueToSend = currentSelected.optionSelected === "A" ? fixedValue : value;
    
    // Determinar o próximo índice considerando a regra especial para índice 0
    let currentIndex = index;
    let nextIndex: number;
    
    if (index === 0) {
      // Regra específica para o índice 0
      currentIndex = 1;
      nextIndex = 2;
    } else {
      // Regra normal para os outros índices
      nextIndex = Math.min(index + 1, totalQuestions);
    }
    
    console.log(`Submitting answer for question ${currentIndex} with option: ${currentSelected.optionSelected}, value: ${valueToSend}`);
    
    // Enviar a resposta atual
    scenariosService
      .loss({
        scenario: currentIndex,
        optionSelected: currentSelected.optionSelected,
        valueSelected: valueToSend,
        userId: userId,
      })
      .then((response: { data: any }) => {
        console.log("Submit response:", response.data);
        
        // Atualizar o índice após enviar a resposta atual
        setIndex(nextIndex);
        
        // Buscar dados para a próxima pergunta após um curto delay
        setTimeout(() => {
          fetchQuestionData(nextIndex);
        }, 800);
      })
      .catch((error: { message: string }) => {
        console.log("Submit error:", error.message);
        setLoading(false);
        isLoadingRef.current = false;
      });
  };

  // Calcular o progresso baseado na pergunta atual
  const adjustedIndex = index === 0 ? 1 : index;
  const progressQuestions = totalQuestions;
  const progress = Math.min((adjustedIndex / progressQuestions) * 100, 100);

  return (
    <div>
      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Pergunta {index === 0 ? 1 : index} de {progressQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500`} />
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-2 gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <Card
          onClick={() => sideSelected({ optionSelected: "A", valueSelected: fixedValue ?? 0 })}
          className={`cursor-pointer border-2 transition-all duration-300 ${selected?.optionSelected === "A" ? "border-blue-500" : "border-transparent"} ${loading ? 'animate-pulse' : ''}`}
        >
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center justify-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Alternativa A
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center">Perda com certeza</h2>
            <div className="flex justify-center items-center pt-9.5">
              <PieChart width={180} height={180}>
                <Pie
                  data={[{ name: "Ganho", value: 100, color: "#808080", label: "teste" }]}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                  strokeWidth={0}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan className="fill-white text-sm font-bold text-white">
                              Sem Ganho ou Perda
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  <Cell key={`cell-1`} fill="#228b22" />
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => sideSelected({ optionSelected: "B", valueSelected: value ?? 0 })}
          className={`cursor-pointer border-2 transition-all duration-300 ${selected?.optionSelected === "B" ? "border-yellow-500" : "border-transparent"} ${loading ? 'animate-pulse' : ''}`}
        >
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center justify-center">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Alternativa B
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center">Resultado incerto</h2>
            <div className="text-xs text-center text-gray-600">
              <div>
                <b>50% chance de perder</b>
              </div>
              <div>
                <b>50% chance de não perder</b>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <PieChart width={180} height={180}>
                <Pie
                  stroke="none"
                  strokeWidth={0}
                  data={dataB}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                >
                  {dataB.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const { cx, cy } = viewBox;
                        return (
                          <>
                            <text
                              x={cx}
                              y={(cy ?? 0) - 30}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan className="fill-white text-sm font-bold">
                                {value}
                              </tspan>
                            </text>
                            <text
                              x={cx}
                              y={(cy ?? 0) + 30}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan className="fill-white text-sm font-bold">+1000</tspan>
                            </text>
                          </>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de carregamento quando estiver mudando de pergunta */}
      {loading && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Carregando próxima pergunta...
        </div>
      )}
    </div>
  );
}