import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { ScenariosService } from "../../../services/scenariosService";
import { useSearchParams } from "next/navigation";

interface selectedInterface {
    optionSelected: string;
    valueSelected: number;
}

interface ApiResponse {
    forecast: any;
}

const dataB = [
    { name: "Ganho", value: 50, color: "#228b22", label: "+R$1.000" },
    { name: "Perda", value: 50, color: "gray", label: "R$0" },
];

export default function FirstScenario({ onAnswered }: { onAnswered: () => void }) {
    const [index, setIndex] = useState(0);
    const [value, setValue] = useState<number>(); // Mediana
    const [fixedValue, setFixedValue] = useState<number>(); // Valor Fixo
    const [selected, setSelected] = useState<selectedInterface | null>(null); // Inicialmente nenhuma opção selecionada
    const [loading, setLoading] = useState(false); // Estado para controlar a animação de carregamento
    const [totalQuestions] = useState(8); // Total de perguntas
    const scenariosService = useMemo(() => new ScenariosService(), []);

    const storedUserId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userId="))
    ?.split("=")[1];

    // Usando useRef para manter a seleção atual
    const selectedRef = useRef<selectedInterface | null>(null);

    // Função para obter e atualizar os valores após a chamada da API
    const fetchData = () => {
        setLoading(true);
        scenariosService
            .getwin(index, storedUserId)
            .then((response: { data: any }) => {
                setValue(response.data.forecast.mediana); // Atualizando o valor da mediana
                setFixedValue(response.data.forecast.valor_fixo); // Atualizando o valor fixo
                setLoading(false);
            })
            .catch((error: { message: string }) => {
                console.log("API Error:", error.message);
                setLoading(false);
            });
    };


    useEffect(() => {
        setSelected(null);
        selectedRef.current = null;
    }, [value, fixedValue]);

    const getBarColor = () => {
        if (index === totalQuestions! - 1) {
            return "from-green-500 to-green-400";
        }
        return "from-red-500 to-orange-400";
    };

    const sideSelected = (data: selectedInterface) => {
        // Não processar cliques enquanto estiver carregando
        if (loading) return;

        selectedRef.current = data;
        setSelected(data);

        // Avançar automaticamente para a próxima pergunta (substituindo o comportamento do botão)
        setTimeout(() => handleNext(data), 500);
    };

    const handleNext = (currentSelected: selectedInterface) => {
        if (!currentSelected) return;

        setLoading(true);

        // Regra específica para o índice 0
        let newIndex = index;
        if (index === 0) {
            newIndex = 1;
            setIndex(1);
        }

        const valueToSend = currentSelected.optionSelected === "A" ? value : fixedValue;

        if (currentSelected.optionSelected === "A" || currentSelected.optionSelected === "B") {
            scenariosService
                .win({
                    scenario: newIndex, // Usando newIndex em vez de index
                    optionSelected: currentSelected.optionSelected,
                    valueSelected: valueToSend,
                    userId: storedUserId,
                })
                .then(() => {
                    // Simulando um tempo de carregamento para dar sensação de mudança
                    setTimeout(() => {
                        // Calcula o próximo índice após resposta
                        const nextIndex = index === 0 ? 2 : Math.min(index + 1, totalQuestions - 1);
                        if (nextIndex === totalQuestions - 1) {
                            onAnswered(); // Chama a função de callback quando chegar na última pergunta
                        }
                        // Depois busca os dados para o novo índice
                        scenariosService
                            .getwin(nextIndex, storedUserId)
                            .then((nextResponse: { data: ApiResponse }) => {
                                setValue(nextResponse.data.forecast.mediana); // Atualizando o valor da mediana
                                setFixedValue(nextResponse.data.forecast.valor_fixo); // Atualizando o valor fixo
                                setIndex(nextIndex);
                                setLoading(false);
                            })
                            .catch((error: { message: string }) => {
                                console.log("API Error fetching next question:", error.message);
                                setLoading(false);
                            });
                    }, 800);
                })
                .catch((error: { message: string }) => {
                    console.log(error.message);
                    setLoading(false);
                });
        }
    };

    // Calcular o progresso baseado na pergunta atual, excluindo a pergunta 0
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
                className={`grid grid-cols-2 md:grid-cols-2 gap-2 m-2 ${
                    loading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <Card
                    onClick={() => sideSelected({ optionSelected: "A", valueSelected: value ?? 0 })}
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
                        <h2 className="text-lg font-semibold text-gray-800 text-center">Ganho com certeza</h2>
                        <div className="flex justify-center items-center pt-9.5">
                            <PieChart width={180} height={180}>
                                <Pie
                                    data={[{ name: "Ganho", value: 100, color: "#228b22", label: "teste" }]}
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
                                                            +{value}
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
                    onClick={() => sideSelected({ optionSelected: "B", valueSelected: fixedValue ?? 0 })}
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
                                <b>50% chance de ganhar</b>
                            </div>
                            <div>
                                <b>50% chance de não ter ganho</b>
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
                                                                +{fixedValue}
                                                            </tspan>
                                                        </text>
                                                        <text
                                                            x={cx}
                                                            y={(cy ?? 0) + 30}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan className="fill-white text-sm font-bold">
                                                                Sem Ganho
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
