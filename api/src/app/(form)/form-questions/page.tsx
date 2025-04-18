"use client";
import { useEffect, useState } from "react";
// import questions from "../../../../perguntas_categorizadas.json";
import { Button } from "@/components/ui/button";
import DynamicQuestion from "../../../components/dynamic-form/page";
import { toast } from "sonner";
import { QuestionService } from "../../../../services/QuestionsService";

export interface Question {
    id: string;
    texto: string;
    tipo: string;
    ordem: string;
    respostas: string[];
}

export default function QuizPage() {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState<Question | null>(null);
    const [quantity, setQuantity] = useState<number>();
    const [respostas, setRespostas] = useState<{ [id: string]: string }>({});
    var current = 4;
    const questionService = new QuestionService();

    useEffect(() => {
        questionService.getCountQuestion()
            .then((response) => {
                setQuantity(response.data);
            }).catch((error) => {
                console.log(error.message);
            });
        questionService.getUnique(current)
            .then((response) => {
                setQuestion(response.data);
            }).catch((error) => {
                console.log(error.message);
            });
    }, [current]);

    const handleChange = (value: string) => {
        console.log(value);
        setRespostas((prev) => ({ ...prev, id: value }));
    };

    //button "Proximo"
    const handleNext = () => {
        if (!respostas.id) {
            toast.warning("Responda a pergunta antes de continuar");
            return;
        }

        if (question?.tipo === "data" && !isValidDate(respostas.id)) {
            toast.error("Digite uma data válida no formato dd/mm/aaaa.");
            return;
        }
        setIndex((prev) => Math.min(prev + 1, quantity! - 1));
    };

    //progress bar
    const progresso = ((index + 1) / current) * 100;

    const getBarColor = () => {
        if (index === quantity! - 1) {
            return "from-green-500 to-green-400"; // Cor verde no final
        }
        return "from-red-500 to-orange-400"; // Cores iniciais da barra
    };

    //validat date and mask
    function isValidDate(dateStr: string): boolean {
        const [day, month, year] = dateStr.split("/").map(Number);
        const currentYear = new Date().getFullYear();

        if (!day || !month || !year || day < 1 || month < 1 || month > 12 || year < 1900 || year > currentYear) {
            return false;
        }

        // Cria o objeto Date com mês - 1 (pois janeiro = 0)
        const date = new Date(year, month - 1, day);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            {question ? (

                <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6">
                    {/* Barra de Progresso */}
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500`}
                            style={{ width: `${progresso}%` }}
                        ></div>
                    </div>

                    {/* Pergunta */}
                    <DynamicQuestion question={question} value={question.id} onChange={handleChange} />

                    {/* Navegação */}
                    <div className="flex justify-between pt-4">

                        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
                            {index === quantity! - 1 ? "Finalizar" : "Continuar"}
                        </Button>
                    </div>
                </div>
            ) : (
                <p>carregando</p>
            )}
        </div>
    );
}