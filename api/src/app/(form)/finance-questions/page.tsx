"use client"; 

import { Suspense } from "react";
import ScenarioController from "@/components/trade-off-scenarios/page";

export default function FinanceQuestions() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md space-y-6">
                <div className="w-full max-w-5xl space-y-6 flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-semibold text-center text-gray-900 p-6">
                        Escolha o seu cenário: perda certo ou perda incerto?
                        <br />
                        <span className="text-lg text-gray-600">O que você prefere?</span>
                    </h1>
                    {/* Envolvendo o ScenarioController com Suspense */}
                    <Suspense fallback={<div>Carregando o cenário...</div>}>
                        <ScenarioController />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
