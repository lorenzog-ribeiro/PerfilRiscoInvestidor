"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label } from "recharts";

const dataB = [
    { name: "Ganho", value: 50, color: "#16a34a", label: "+R$1.000" },
    { name: "Perda", value: 50, color: "#808080", label: "-R$500" },
];

export default function TradeoffVisual() {
    const [selected, setSelected] = useState<"A" | "B" | null>(null);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl space-y-6">
                <h1 className="text-2xl font-semibold text-center text-gray-900">
                    Qual dessas opções te deixa mais confortável?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        onClick={() => setSelected("A")}
                        className={`cursor-pointer border-2 ${
                            selected === "A" ? "border-blue-500" : "border-transparent"
                        }`}
                    >
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Alternativa A
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 text-center">Ganho com certeza</h2>
                            <div className="flex justify-center items-center">
                                <PieChart width={180} height={180}>
                                    <Pie
                                        data={[{ name: "Ganho", value: 100, color: "#16a34a" }]}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        <Cell fill="#16a34a" />
                                        <Label
                                            value="+R$500"
                                            position="center"
                                            className="text-xs font-bold text-gray-800"
                                        />
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
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-center">
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Alternativa B
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 text-center">Resultado incerto</h2>
                            <div className="text-xs text-center text-gray-600">
                                <div>
                                    <b>50% chance de +R$1.000</b>
                                </div>
                                <div>
                                    <b>50% chance de -R$500</b>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <PieChart width={180} height={180}>
                                    <Pie data={dataB} dataKey="value" nameKey="name" cx="50%" cy="50%">
                                        {dataB.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
