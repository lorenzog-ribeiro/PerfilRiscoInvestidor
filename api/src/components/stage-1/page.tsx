/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { atualizarMediana } from "@/lib/mediana";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Label } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

function renderCustomLabel(props: any, label: string) {
    const { viewBox } = props;
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
        const { cx, cy } = viewBox as { cx: number; cy: number };
        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                <tspan className="fill-white text-sm font-bold">{label}</tspan>
            </text>
        );
    }
    return null;
}

export default function Etapa1({ scenario, onConclude }: any) {
    const [estado, setEstado] = useState(scenario);
    const [selected, setSelected] = useState<"A" | "B" | null>(null);

    useEffect(() => {
        if (selected) {
            const atualizado = atualizarMediana(estado, selected);
            if (atualizado.convergiu) {
                toast.success("Etapa concluída!");
                onConclude(atualizado);
            } else {
                setEstado(atualizado);
                setSelected(null);
            }
        }
    }, [selected]);

    const dataA = [
        {
            name: "Ganho",
            value: 100,
            color: "#228b22",
            label: `+R$${estado.a.valor.toFixed(2)}`,
        },
    ];

    const dataB = [
        {
            name: "Ganho",
            value: 50,
            color: "#228b22",
            label: `+R$${estado.b.ganho}`,
        },
        {
            name: "Sem Ganho",
            value: 50,
            color: "#A9A9A9",
            label: "R$0",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center md:px-1">
            <div className="w-full max-w-5xl space-y-6 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-center text-gray-900">
                    Escolha o seu cenário: ganho certo ou ganho incerto?
                    <br />
                    <span className="text-lg text-gray-600">O que você prefere?</span>
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                    <Card
                        onClick={() => setSelected("A")}
                        className={`cursor-pointer border-2 ${
                            selected === "A" ? "border-blue-500" : "border-transparent"
                        }`}
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
                                    <Pie data={dataA} dataKey="value" nameKey="name" stroke="none" strokeWidth={0}>
                                        <Label content={(props) => renderCustomLabel(props, dataA[0].label)} />
                                        <Cell fill={dataA[0].color} />
                                    </Pie>
                                </PieChart>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => setSelected("B")}
                        className={`cursor-pointer border-2 ${
                            selected === "B" ? "border-yellow-500" : "border-transparent"
                        }`}
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
                                    <Pie data={dataB} dataKey="value" nameKey="name" stroke="none" strokeWidth={0}>
                                        {dataB.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                        <Label
                                            content={({ viewBox }) => {
                                                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

                                                const { cx, cy } = viewBox as { cx: number; cy: number };

                                                const topLabel = dataB[0].label;
                                                const bottomLabel = dataB[1].label;

                                                return (
                                                    <>
                                                        <text
                                                            x={cx}
                                                            y={cy - 30}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan className="fill-white text-sm font-bold">
                                                                {topLabel}
                                                            </tspan>
                                                        </text>
                                                        <text
                                                            x={cx}
                                                            y={cy + 30}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan className="fill-white text-sm font-bold">
                                                                {bottomLabel}
                                                            </tspan>
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

                <Button
                    className="mb-4 bg-orange-400 hover:bg-orange-300"
                    onClick={() => toast.warning("Escolha uma opção acima!")}
                >
                    Próximo
                </Button>
            </div>
        </div>
    );
}
