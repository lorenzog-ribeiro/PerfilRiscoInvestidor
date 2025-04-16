"use client";
import { useState } from "react";
import questions from "../../../../perguntas_categorizadas.json";
import { Button } from "@/components/ui/button";
import DynamicQuestion from "../../../components/dynamic-form/page";

export default function QuizPage() {
    const [index, setIndex] = useState(0);
    const [respostas, setRespostas] = useState<{ [id: string]: string }>({});
    const current = questions[index];

    const handleChange = (value: string) => {
        setRespostas((prev) => ({ ...prev, [current.id]: value }));
    };

    const handleNext = () => {
        if (!respostas[current.id]) {
            alert("Responda a pergunta antes de continuar");
            return;
        }
        setIndex((prev) => Math.min(prev + 1, questions.length - 1));
    };

    const handleBack = () => {
        setIndex((prev) => Math.max(prev - 1, 0));
    };

    const progresso = ((index + 1) / questions.length) * 100;

    const getBarColor = () => {
        if (index === questions.length - 1) {
            return "from-green-500 to-green-400"; // Cor verde no final
        }
        return "from-red-500 to-orange-400"; // Cores iniciais da barra
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6">
                {/* Barra de Progresso */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500`}
                        style={{ width: `${progresso}%` }}
                    ></div>
                </div>

                {/* Pergunta */}
                <DynamicQuestion question={current} value={respostas[current.id] || ""} onChange={handleChange} />

                {/* Navegação */}
                <div className="flex justify-between pt-4">
                    <Button
                        onClick={handleBack}
                        className="bg-gray-200 text-gray-600 hover:bg-gray-300"
                        disabled={index === 0}
                    >
                        Voltar
                    </Button>
                    <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
                        {index === questions.length - 1 ? "Finalizar" : "Continuar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
