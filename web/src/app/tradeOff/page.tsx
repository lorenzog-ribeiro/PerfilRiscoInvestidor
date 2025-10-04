"use client";

import ScenarioController from "@/src/components/trade-off/ScenarioController";
import { Card } from "@/src/components/ui/card";
import { Suspense } from "react";

export default function FinanceQuestions() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-md space-y-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center text-gray-900 pt-6">
          Como você lida com ganhos
        </h2>
        <h3 className="text-1xl font-semibold text-center text-gray-900 p-3">
          Imagine que você realizou um investimento e está verificando como
          ele está se saindo;
          <br />
          com qual dos cenários a seguir você se sentiria
          mais confortável?
        </h3>
        {/* ScenarioController will handle navigation to quiz by default */}
        <Suspense fallback={<div>Carregando o cenário...</div>}>
          <ScenarioController />
        </Suspense>
      </Card>
    </div>
  );
}
