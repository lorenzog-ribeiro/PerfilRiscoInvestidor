import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { ScenariosService } from "../../../services/scenariosService";
import { useSearchParams } from "next/navigation";

interface SelectedInterface {
    optionSelected: string;
    valueSelected: number;
}

const dataB = [
    { name: "Sem Ganho", value: 50, color: "red", label: "+R$1.000" },
    { name: "Sem Perda", value: 50, color: "gray" },
];

export default function SecondScenario({ onAnswered }: { onAnswered: () => void }) {
    const [index, setIndex] = useState(0);
    const [value, setValue] = useState<number>(); // Mediana
    const [fixedValue, setFixedValue] = useState<number>(); // Valor Fixo
    const [selected, setSelected] = useState<SelectedInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [totalQuestions] = useState(10);
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

        scenariosService
            .getOnlyLossScenario(questionIndex, userId)
            .then((response: { data: any }) => {
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
    }, [fetchQuestionData,userId]);

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

        // Enviar a resposta atual
        scenariosService
            .totalLossScenario({
                scenario: currentIndex,
                optionSelected: currentSelected.optionSelected,
                valueSelected: valueToSend,
                userId: userId,
            })
            .then(() => {
                // Atualizar o índice após enviar a resposta atual
                setIndex(nextIndex);
                if (nextIndex === totalQuestions - 1) {
                    onAnswered(); // Chama a função de callback quando chegar na última pergunta
                }
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
    const adjustedIndex = index === 0 ? 0 : index - 1;
    const progressQuestions = totalQuestions - 1;
    const progress = ((adjustedIndex + 1) / progressQuestions) * 100;

    return (
        <div>
            {/* Barra de progresso */}
            <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mb-4 ml-5">
                <div
                    className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500 `}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div
                className={`grid grid-cols-2 md:grid-cols-2 gap-2 ml-3 mr-3 ${
                    loading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <Card
                    onClick={() => sideSelected({ optionSelected: "A", valueSelected: fixedValue ?? 0 })}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                        selected?.optionSelected === "A" ? "border-blue-500" : "border-transparent"
                    } ${loading ? "animate-pulse" : ""}`}
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
                                    data={[{ name: "Sem Ganho ou Perda", value: 100, color: "gray" }]}
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
                                                        <tspan className="fill-white text-sm font-bold">
                                                            {fixedValue}
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                    <Cell key={`cell-1`} fill="red" />
                                </Pie>
                            </PieChart>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    onClick={() => sideSelected({ optionSelected: "B", valueSelected: value ?? 0 })}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                        selected?.optionSelected === "B" ? "border-yellow-500" : "border-transparent"
                    } ${loading ? "animate-pulse" : ""}`}
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
                                                            <tspan className="fill-white text-sm font-bold">
                                                                Sem Perda
                                                            </tspan>
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
            {loading && <div className="text-center mt-4 text-sm text-gray-600">Carregando próxima pergunta...</div>}
        </div>
    );
}
