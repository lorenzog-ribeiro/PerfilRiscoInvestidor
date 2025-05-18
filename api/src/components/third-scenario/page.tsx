import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { ScenariosService } from "../../../services/scenariosService";

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
    { name: "Sem Ganho", value: 50, color: "red", label: "+R$1.000" },
    { name: "Sem Perda", value: 50, color: "gray" },
];

export default function ThirdScenario({ onAnswered }: { onAnswered: () => void }) {
    const [index, setIndex] = useState(0);
    const [value, setValue] = useState<number>(); // Mediana
    const [fixedValue, setFixedValue] = useState<number>(); // Valor Fixo
    const [selected, setSelected] = useState<SelectedInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [totalQuestions] = useState(7);
    const [userId, setUserId] = useState<string | undefined>(undefined); // State for user ID
    const [selectionHistory, setSelectionHistory] = useState<string[]>([]);

    const scenariosService = useMemo(() => new ScenariosService(), []);

    useEffect(() => {
        const userIdFromCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userId="))
            ?.split("=")[1];

        setUserId(userIdFromCookie);
    }, []);

    // Ref para controlar se já fizemos a primeira chamada
    const initialLoadDone = useRef(false);
    // Ref para monitorar o estado de carregamento
    const isLoadingRef = useRef(false);

    // Função para buscar dados para uma questão específica
    const fetchQuestionData = useCallback(
        (questionIndex: number) => {
            if (!userId) return;

            setLoading(true);
            isLoadingRef.current = true;

            scenariosService
                .getOnlyLossScenario(questionIndex, userId)
                .then((response: { data: ApiResponse }) => {
                    setValue(response.data.forecast.mediana); // Atualizando o valor da mediana
                    setFixedValue(response.data.forecast.valor_fixo); // Atualizando o valor fixo
                    setLoading(false);
                    isLoadingRef.current = false;
                    if (Math.abs(response.data.forecast.mediana - response.data.forecast.valor_fixo) < 10) {
                        onAnswered(); // pular próximas perguntas
                    }
                })
                .catch((error: { message: string }) => {
                    console.log("API Error:", error.message);
                    setLoading(false);
                    isLoadingRef.current = false;
                });
        },
        [scenariosService, userId]
    );

    // Carrega os dados da primeira questão apenas uma vez na inicialização
    useEffect(() => {
        if (userId && !initialLoadDone.current) {
            initialLoadDone.current = true;
            fetchQuestionData(index);
        }
    }, [fetchQuestionData, index, userId]);

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

        setSelectionHistory((prev) => {
            const updated = [...prev, data.optionSelected].slice(-4); // guarda até os últimos 4
            // Verifica os padrões
            const lastFour = updated.join("");
            if (lastFour === "ABAA" || lastFour === "BABB") {
                console.log(updated);
                onAnswered();
                return updated;
            }
            return updated;
        });
        // Avançar para a próxima pergunta após um breve delay
        setTimeout(() => handleNext(data), 500);
    };

    const handleNext = (currentSelected: SelectedInterface) => {
        if (!currentSelected || !userId || loading || isLoadingRef.current) return;

        setLoading(true);
        isLoadingRef.current = true;

        // Determinar qual valor enviar
        const valueToSend = value;

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

    return (
        <div>
            <div
                className={`grid grid-cols-2 md:grid-cols-2 gap-2 m-2 ${
                    loading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <Card
                    onClick={() => sideSelected({ optionSelected: "A", valueSelected: fixedValue ?? 0 })}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                        selected?.optionSelected === "A" ? "border-green-500" : "border-blue-300"
                    } ${loading ? "animate-pulse" : ""}`}
                >
                    <CardContent className="p-2 space-y-2">
                        <div className="flex items-center justify-center">
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                Investimento A
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 text-center">Resultado incerto</h2>
                        <div className="text-xs text-center text-gray-600 p-2.5">
                            <div>
                                <b>50% chance de não perder</b>
                            </div>
                            <div>
                                <b>50% chance de perda</b>
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
                                                            y={(cy ?? 0) + 30}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan className="fill-white text-sm font-bold">
                                                                Sem Perda
                                                            </tspan>
                                                        </text>
                                                        <text
                                                            x={cx}
                                                            y={(cy ?? 0) - 30}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan className="fill-white text-sm font-bold">
                                                                R${fixedValue}
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

                <Card
                    onClick={() => sideSelected({ optionSelected: "B", valueSelected: value ?? 0 })}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                        selected?.optionSelected === "B" ? "border-green-500" : "border-blue-300"
                    } ${loading ? "animate-pulse" : ""}`}
                >
                    <CardContent className="p-2 space-y-2">
                        <div className="flex items-center justify-center">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Investimento B
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 text-center">100% certeza de perda</h2>
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
                                                            R${value}
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
            </div>

            {/* Indicador de carregamento quando estiver mudando de pergunta */}
            {loading && <div className="text-center mt-4 text-sm text-gray-600">Carregando próxima pergunta...</div>}
        </div>
    );
}
