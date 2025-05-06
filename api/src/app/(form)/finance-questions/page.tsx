"use client";

import { Suspense } from "react";
import ScenarioController from "@/components/trade-off-scenarios/page";

export default function FinanceQuestions() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md space-y-6">
                <div className="w-full max-w-5xl space-y-6 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-center text-gray-900 p-3">Como você lida com ganhos</h2>
                    <h3 className="text-1xl font-semibold text-center text-gray-900 p-3">
                        Imagine que você realizou um investimento e está verificando como ele está se saindo; com qual
                        dos cenários a seguir você se sentiria mais confortável?
                        <br />
                        <br />
                        <span className="text-lg text-gray-600">Você investiu: R$ 10.000</span>
                    </h3>
                    {/* Envolvendo o ScenarioController com Suspense */}
                    <Suspense fallback={<div>Carregando o cenário...</div>}>
                        <ScenarioController />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
