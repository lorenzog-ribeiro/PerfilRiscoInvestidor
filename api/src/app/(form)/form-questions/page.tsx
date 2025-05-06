"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AnswerService } from "../../../../services/AnswerService";
import DynamicQuestion from "../../../components/dynamic-form/page";
import isValidDate from "@/lib/dataValidator";
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

const getCookieValue = (cookieName: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  return cookie ? cookie.split("=")[1] : undefined;
};

const getProgress = (index: number, quantity: number | undefined) => {
  return quantity ? ((index + 1) / quantity) * 100 : 0;
};

const QuizPage = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [respostas, setRespostas] = useState<{ [id: string]: string }>({});

  const initialIndex =
    typeof window !== "undefined"
      ? Number(getCookieValue("lastQuestionIndex")) || 1
      : 1;

  const [index, setIndex] = useState<number>(initialIndex);

  const questionService = useMemo(() => new QuestionService(), []);
  const answerService = useMemo(() => new AnswerService(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionCount = await questionService.getCountQuestion();
        setQuantity(questionCount.data);

        const questionData = await questionService.getUnique(index);
        setQuestion(questionData.data);
      } catch (error: any) {
        console.error("Erro ao buscar pergunta:", error.message);
      }
    };

    fetchData();
  }, [index, questionService]);

  const handleChange = (questionId: string, value: string) => {
    setRespostas((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (!respostas[question!.id]) {
      toast.warning("Responda a pergunta antes de continuar");
      return;
    }

    if (question?.tipo === "data" && !isValidDate(respostas[question.id])) {
      toast.error("Digite uma data válida no formato dd/mm/aaaa.");
      return;
    }

    const storedUserId = getCookieValue("userId");

    const respostaPayload = {
      resposta: respostas[question!.id],
      pergunta_id: question!.id,
      usuario_id: storedUserId,
    };

    try {
      await answerService.save(respostaPayload);
    } catch (error: any) {
      console.error("Erro ao salvar resposta:", error.message);
    }

    if (index === 17) {
      router.push("/result");
      return;
    }

    if (index === 7) {
      document.cookie = `lastQuestionIndex=${index + 1}; path=/; max-age=3600;`;
      router.push("/finance-questions");
      return;
    }

    const newIndex = quantity ? Math.min(index + 1, quantity - 1) : index + 1;
    document.cookie = `lastQuestionIndex=${newIndex}; path=/; max-age=3600;`;
    setIndex(newIndex);
  };

  const progresso = getProgress(index, quantity);
  const getBarColor = () =>
    index === quantity
      ? "from-green-500 to-green-400"
      : "from-red-500 to-orange-400";

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

          <DynamicQuestion
            question={question}
            value={respostas[question.id]}
            onChange={(value) => handleChange(question.id, value)}
          />

          <div className="flex justify-between pt-4">
            <Button
              onClick={handleNext}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {index === quantity! - 1 ? "Finalizar" : "Continuar"}
            </Button>
          </div>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default QuizPage;