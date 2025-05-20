import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";
import { ScenariosService } from "../../../services/scenariosService";

interface selectedInterface {
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
    { name: "Ganho", value: 50, color: "green", label: "+R$1.000" },
    { name: "Perda", value: 50, color: "red", label: "R$1000" },
];

export default function SecondScenario({ onAnswered }: { onAnswered: () => void }) {
    const [index, setIndex] = useState(0);
    const [value, setValue] = useState<number>();
    const [fixedValue, setFixedValue] = useState<number>();
    const [selected, setSelected] = useState<selectedInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [totalQuestions] = useState(9);
    const [storedUserId, setStoredUserId] = useState<string | undefined>(undefined);
    const [storedUserAttempt, setStoredUserAttempt] = useState<string | undefined>(undefined);
    const [selectionHistory, setSelectionHistory] = useState<string[]>([]);

    const scenariosService = useMemo(() => new ScenariosService(), []);
    const selectedRef = useRef<selectedInterface | null>(null);

    useEffect(() => {
        const userId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userId="))
            ?.split("=")[1];
        const userAttempt = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userAttempt="))
            ?.split("=")[1];
        setStoredUserId(userId);
        setStoredUserAttempt(userAttempt);
    }, []);
    const fetchData = (scenarioIndex = index) => {
        if (storedUserId === undefined) return;

        setLoading(true);
        scenariosService
            .getloss(scenarioIndex, storedUserId, storedUserAttempt)
            .then((response: { data: ApiResponse }) => {
                const { mediana, valor_fixo } = response.data.forecast;
                setValue(mediana);
                setFixedValue(valor_fixo);
                setLoading(false);

                // if (Math.abs(mediana - valor_fixo) < 10 || mediana < 10) {
                //     onAnswered();
                // }
            })
            .catch((error: { message: string }) => {
                console.log("API Error:", error.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        setSelected(null);
        selectedRef.current = null;
    }, [index, storedUserId, storedUserAttempt, scenariosService]);

    useEffect(() => {
        setSelected(null);
    }, [value, fixedValue]);

    const sideSelected = (data: selectedInterface) => {
        if (loading) return;

        selectedRef.current = data;
        setSelected(data);

        setSelectionHistory((prev) => {
            const updated = [...prev, data.optionSelected].slice(-4);
            const lastFour = updated.join("");
            if (lastFour === "ABAA" || lastFour === "BABB") {
                console.log(updated);
                onAnswered();
                return updated;
            }
            return updated;
        });

        setTimeout(() => handleNext(data), 500);
    };

    const handleNext = (currentSelected: selectedInterface) => {
        if (!currentSelected) return;
        setLoading(true);

        const currentIndex = index === 0 ? 1 : index;
        const valueToSend = value ?? 0;

        scenariosService
            .loss({
                scenario: currentIndex,
                optionSelected: currentSelected.optionSelected,
                valueSelected: valueToSend,
                userId: storedUserId,
                attempt: storedUserAttempt,
            })
            .then(() => {
                setTimeout(() => {
                    const nextIndex = Math.min(currentIndex + 1, totalQuestions - 1);
                    if (nextIndex === totalQuestions - 1) {
                        onAnswered();
                    }
                    setIndex(nextIndex);
                }, 800);
            })
            .catch((error) => {
                console.log(error.message);
                setLoading(false);
            });
    };

    return (
        <div>
            {/* Cards */}
            <div
                className={`grid grid-cols-2 md:grid-cols-2 gap-2 m-2 ${loading ? "opacity-50 pointer-events-none" : ""}`}
            >
                {/* Card A */}
                <Card
                    onClick={() => sideSelected({ optionSelected: "A", valueSelected: value ?? 0 })}
                    className={`cursor-pointer border-2 transition-all duration-300 ${selected?.optionSelected === "A" ? "border-green-500" : "border-blue-300"
                        } ${loading ? "animate-pulse" : ""}`}
                >
                    <CardContent className="p-2 space-y-2">
                        <div className="flex items-center justify-center">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Investimento A
                            </span>
                        </div>
                        <div className="text-xs text-center text-gray-600 p-5.5">
                            <div>Sem ganho ou perda com certeza</div>
                        </div>
                        <div className="flex justify-center items-center">
                            <PieChart width={180} height={180}>
                                <Pie data={[{ name: "Sem Ganho ou Perda", value: 100, color: "gray" }]} dataKey="value" strokeWidth={0}>
                                    <Label
                                        content={({ viewBox }) => {
                                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" >
                                                    <tspan x={viewBox.cx} dy="-0.6em" className="fill-white text-sm font-bold">
                                                        Sem Ganho
                                                    </tspan>
                                                    <tspan x={viewBox.cx} dy="1.2em" className="fill-white text-sm font-bold">
                                                        ou Perda
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </div>
                    </CardContent>
                </Card>

                {/* Card B */}
                <Card
                    onClick={() => sideSelected({ optionSelected: "B", valueSelected: value ?? 0 })}
                    className={`cursor-pointer border-2 transition-all duration-300 ${selected?.optionSelected === "B" ? "border-green-500" : "border-blue-300"
                        } ${loading ? "animate-pulse" : ""}`}
                >
                    <CardContent className="p-2 space-y-2">
                        <div className="flex items-center justify-center">
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                Investimento B
                            </span>
                        </div>
                        <div className="text-xs text-center text-gray-600 p-5.5">
                            <div>
                                <b>50%</b> chance de perda
                            </div>
                            <div>
                                <b>50%</b> chance de ganho
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <PieChart width={180} height={180}>
                                <Pie stroke="white" strokeWidth={3} data={dataB} dataKey="value">
                                    {dataB.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={entry.color} />
                                    ))}
                                    <Label
                                        content={({ viewBox }) => {
                                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                                            const { cx, cy } = viewBox;
                                            return (
                                                <>
                                                    <text x={cx} y={(cy ?? 0) - 30} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan className="fill-white text-sm font-bold">R$ + 1000</tspan>
                                                    </text>
                                                    <text x={cx} y={(cy ?? 0) + 30} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan className="fill-white text-sm font-bold">R$ {value}</tspan>
                                                    </text>
                                                </>
                                            );
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {loading && <div className="text-center mt-4 text-sm text-gray-600">Carregando próxima pergunta...</div>}
        </div>
    );
}