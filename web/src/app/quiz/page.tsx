"use client";

import {
  InvestorData,
  LiteracyData,
  DospertData,
  TradeOffData,
} from "@/services/types";
import InvestorQuiz from "@/src/components/quiz/investorQuiz";
import LiteracyQuiz from "@/src/components/quiz/literacyQuiz";
import RiskTakingQuiz from "@/src/components/quiz/riskTakingQuiz";
import { Card } from "@/src/components/ui/card";
import {
  investorQuestions,
  literacyQuestions,
  dospertQuestions,
} from "@/src/lib/constants";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizCache } from "@/src/lib/quizCache";
import { getOrCreateUserId } from "@/src/lib/userUtils";
import { QuizSubmissionService } from "@/services/QuizSubmissionService";

enum Screen {
  Investor,
  Literacy,
  RiskTaking,
  Results,
  Instructions,
}

export default function QuizPage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Investor);
  const [investorData, setInvestorData] = useState<InvestorData | null>(null);
  const [literacyData, setLiteracyData] = useState<LiteracyData | null>(null);
  const [dospertData, setDospertData] = useState<DospertData | null>(null);
  const [tradeOffData, setTradeOffData] = useState<TradeOffData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quizSubmissionService = new QuizSubmissionService();
  const totalQuestions =
    investorQuestions.length +
    literacyQuestions.length +
    dospertQuestions.length;

  useEffect(() => {
    const loadCachedData = () => {
      const cachedProgress = QuizCache.load();
      if (cachedProgress) {
        setCurrentScreen(cachedProgress.currentScreen);
        if (cachedProgress.investorData)
          setInvestorData(cachedProgress.investorData);
        if (cachedProgress.literacyData)
          setLiteracyData(cachedProgress.literacyData);
        if (cachedProgress.dospertData)
          setDospertData(cachedProgress.dospertData);
        if (cachedProgress.tradeOffData) {
          setTradeOffData(cachedProgress.tradeOffData);
          return; // already have tradeOff data from cache
        }
      }

      try {
        const storedTradeOffData = sessionStorage.getItem("tradeOffData");
        if (storedTradeOffData) {
          const parsedData = JSON.parse(storedTradeOffData) as TradeOffData;
          setTradeOffData(parsedData);
          // Update cache with tradeOff data
          QuizCache.save({ tradeOffData: parsedData });
        }
      } catch (error) {
        console.error(
          "Error parsing tradeOff data from sessionStorage:",
          error
        );
      }
    };

    loadCachedData();
  }, []);

  // Save progress whenever data changes
  useEffect(() => {
    if (investorData || literacyData || dospertData || tradeOffData) {
      QuizCache.save({
        currentScreen,
        investorData: investorData || undefined,
        literacyData: literacyData || undefined,
        dospertData: dospertData || undefined,
        tradeOffData: tradeOffData || undefined,
      });
    }
  }, [currentScreen, investorData, literacyData, dospertData, tradeOffData]);

  const handleInvestorComplete = (data: InvestorData) => {
    setInvestorData(data);
    setCurrentScreen(Screen.Literacy);

    // Save progress to cache
    QuizCache.save({
      currentScreen: Screen.Literacy,
      investorData: data,
      tradeOffData: tradeOffData || undefined,
    });
  };

  const handleLiteracyComplete = (data: LiteracyData) => {
    setLiteracyData(data);
    setCurrentScreen(Screen.RiskTaking);

    // Save progress to cache
    QuizCache.save({
      currentScreen: Screen.RiskTaking,
      investorData: investorData!,
      literacyData: data,
      tradeOffData: tradeOffData || undefined,
    });
  };

  const handleRiskTakingComplete = async (data: DospertData) => {
    setDospertData(data);
    setIsSubmitting(true);

    try {
      // Get or create user ID from cookie
      const userId = getOrCreateUserId();

      // Prepare complete quiz data
      const completeQuizData = {
        investorData: investorData!,
        literacyData: literacyData!,
        dospertData: data,
        tradeOffData: tradeOffData || undefined,
        userId,
      };

      // Submit to backend
      const response = await quizSubmissionService.submitCompleteQuiz(
        completeQuizData
      );

      // Save all data to cache before navigating to results
      QuizCache.save({
        currentScreen: Screen.Results,
        investorData: investorData!,
        literacyData: literacyData!,
        dospertData: data,
        tradeOffData: tradeOffData || undefined,
      });

      // Navigate to isolated results page
      router.push("/results");
    } catch (error) {
      console.error("Error submitting quiz:", error);

      // Still save to cache and navigate, but show error
      QuizCache.save({
        currentScreen: Screen.Results,
        investorData: investorData!,
        literacyData: literacyData!,
        dospertData: data,
        tradeOffData: tradeOffData || undefined,
      });

      // You might want to show an error toast here
      alert(
        "Houve um erro ao salvar seus dados, mas você ainda pode ver seus resultados. Erro: " +
          (error as Error).message
      );
      router.push("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto flex flex-col justify-center p-3">
      <Card className="w-full h-full">
        {currentScreen === Screen.Investor && (
          <InvestorQuiz
            onComplete={handleInvestorComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={0}
          />
        )}

        {currentScreen === Screen.Literacy && (
          <LiteracyQuiz
            onComplete={handleLiteracyComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={investorQuestions.length}
          />
        )}

        {currentScreen === Screen.RiskTaking && (
          <RiskTakingQuiz
            onComplete={handleRiskTakingComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={
              investorQuestions.length + literacyQuestions.length
            }
            isSubmitting={isSubmitting}
          />
        )}
      </Card>
    </main>
  );
}
