"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

const dataB = [
  { name: "Ganho", value: 50, color: "#228b22", label: "+R$1.000" },
  { name: "Perda", value: 50, color: "#d22e2e", label: "-R$500" },
];

export default function TradeoffVisual() {
  const [selected, setSelected] = useState<"A" | "B" | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center md:px-">
      <div className="w-full max-w-5xl space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Escolha o seu cenário: ganho certo ou ganho incerto?
          <br />
          <span className="text-lg text-gray-600">O que você prefere?</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
          <Card
            onClick={() => setSelected("A")}
            className={`cursor-pointer border-2 ${selected === "A" ? "border-blue-500" : "border-transparent"
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
                <PieChart width={180} height={180} >
                  <Pie
                    data={[{ name: "Ganho", value: 100, color: "#228b22", label: "teste" }]}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                    strokeWidth={0}>
                    <Cell key={`cell-1`} fill="#228b22" />
                  </Pie>
                </PieChart>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => setSelected("B")}
            className={`cursor-pointer border-2 ${selected === "B" ? "border-yellow-500" : "border-transparent"
              }`}
          >
            <CardContent className="p-4 space-y-4">
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
                    cx="50%" cy="50%">
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
