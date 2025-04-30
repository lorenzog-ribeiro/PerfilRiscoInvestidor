"use client";
import { toast } from "sonner";
import isValidDate from "@/lib/dataValidator";
import { Button } from "@/components/ui/button";
import { redirect, useSearchParams } from "next/navigation";
import { AnswerService } from "../../../../services/AnswerService";
import DynamicQuestion from "../../../components/dynamic-form/page";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { QuestionService } from "../../../../services/QuestionsService";

export interface Question {
    id: string;
    texto: string;
    tipo: string;
    ordem: string;
    respostas: {
        id: string;
        texto: string;
        indexOf: number;
    }[];
}

export default function QuizPage() {
    const [index, setIndex] = useState(1);
    const [question, setQuestion] = useState<Question | null>(null);
    const [quantity, setQuantity] = useState<number>();
    const [respostas, setRespostas] = useState<{ [id: string]: string }>({});
    const questionService = useMemo(() => new QuestionService(), []);
    const searchParams = useSearchParams();
    const answerService = useMemo(() => new AnswerService(), []);
    const userId = searchParams.get("userId");

    useEffect(() => {
        const lastIndex = document.cookie
            .split("; ")
            .find((row) => row.startsWith("lastQuestionIndex="))
            ?.split("=")[1];
        if (lastIndex) {
            setIndex(Number(lastIndex));
        }
        questionService
            .getCountQuestion()
            .then((response: { data: SetStateAction<number | undefined> }) => {
                setQuantity(response.data);
            })
            .catch((error: { message: string }) => {
                console.log(error.message);
            });
        questionService
            .getUnique(index)
            .then((response: { data: SetStateAction<Question | null> }) => {
                setQuestion(response.data);
            })
            .catch((error: { message: string }) => {
                console.log(error.message);
            });
    }, [index, questionService]);

    const handleChange = (questionId: string, value: string) => {
        setRespostas((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (!respostas[question!.id]) {
            toast.warning("Responda a pergunta antes de continuar");
            return;
        }

        if (question?.tipo === "data" && !isValidDate(respostas[question.id])) {
            toast.error("Digite uma data válida no formato dd/mm/aaaa.");
            return;
        }

        const respostasComUsuario = {
            resposta: respostas[question!.id],
            pergunta_id: question!.id,
            usuario_id: userId,
        };

        answerService
            .save(respostasComUsuario)
            .then(() => {})
            .catch((error: { message: string }) => {
                console.log(error.message);
            });

        setIndex((prev) => Math.min(prev + 1, quantity! - 1));
        if (index == 7) {
            document.cookie = `lastQuestionIndex=${index + 1}; path=/; max-age=3600;`;
            redirect("/finance-questions?userId=" + userId);
        }
    };

    const progresso = quantity ? ((index + 1) / quantity) * 100 : 0;

    const getBarColor = () => {
        if (index === quantity! - 1) {
            return "from-green-500 to-green-400";
        }
        return "from-red-500 to-orange-400";
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            {question ? (
                <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500`}
                            style={{ width: `${progresso}%` }}
                        ></div>
                    </div>

                    {/* Pergunta */}
                    <DynamicQuestion
                        question={question}
                        value={respostas[question.id]}
                        onChange={(value) => handleChange(question.id, value)}
                    />

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
