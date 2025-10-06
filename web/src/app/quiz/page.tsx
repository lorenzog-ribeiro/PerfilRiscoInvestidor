"use client";

import {
  InvestorData,
  LiteracyData,
  DospertData,
  TradeOffData,
  EconomyData,
} from "@/services/types";
import { ISFBData } from "@/src/lib/isfb";
import EconomyQuiz from "@/src/components/quiz/economyQuiz";
import InvestorQuiz from "@/src/components/quiz/investorQuiz";
import LiteracyQuiz from "@/src/components/quiz/literacyQuiz";
import ISFBQuiz from "@/src/components/quiz/isfbQuiz";
import { Card } from "@/src/components/ui/card";
import {
  investorQuestions,
  literacyQuestions,
  economiesQuestions,
} from "@/src/lib/constants";
import { isfbPart1Questions } from "@/src/lib/isfb";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizCache } from "@/src/lib/quizCache";
import { getOrCreateUserId } from "@/src/lib/userUtils";
import { QuizSubmissionService } from "@/services/QuizSubmissionService";

enum Screen {
  Economy,
  Investor,
  Literacy,
  ISFB,
}

export default function QuizPage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Economy);
  const [economyData, setEconomyData] = useState<EconomyData | null>(null);
  const [investorData, setInvestorData] = useState<InvestorData | null>(null);
  const [literacyData, setLiteracyData] = useState<LiteracyData | null>(null);
  const [isfbData, setISFBData] = useState<ISFBData | null>(null);
  const [dospertData, setDospertData] = useState<DospertData | null>(null);
  const [tradeOffData, setTradeOffData] = useState<TradeOffData | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const quizSubmissionService = new QuizSubmissionService();
  const totalQuestions =
    economiesQuestions.length +
    investorQuestions.length +
    literacyQuestions.length +
    isfbPart1Questions.length;

  useEffect(() => {
    const loadCachedData = () => {
      const cachedProgress = QuizCache.load();
      if (cachedProgress) {
        setCurrentScreen(cachedProgress.currentScreen);
        if (cachedProgress.economyData)
          setEconomyData(cachedProgress.economyData);
        if (cachedProgress.investorData)
          setInvestorData(cachedProgress.investorData);
        if (cachedProgress.literacyData)
          setLiteracyData(cachedProgress.literacyData);
        if (cachedProgress.isfbData)
          setISFBData(cachedProgress.isfbData);
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
    if (
      economyData ||
      investorData ||
      literacyData ||
      isfbData ||
      dospertData ||
      tradeOffData
    ) {
      QuizCache.save({
        currentScreen,
        economyData: economyData || undefined,
        investorData: investorData || undefined,
        literacyData: literacyData || undefined,
        isfbData: isfbData || undefined,
        dospertData: dospertData || undefined,
        tradeOffData: tradeOffData || undefined,
      });
    }
  }, [currentScreen, economyData, investorData, literacyData, isfbData, dospertData, tradeOffData]);

  const handleEconomyComplete = (data: EconomyData) => {
    setEconomyData(data);
    setCurrentScreen(Screen.Investor);

    // Save progress to cache
    QuizCache.save({
      currentScreen: Screen.Investor,
      economyData: data,
      tradeOffData: tradeOffData || undefined,
    });
  };

  const handleInvestorComplete = (data: InvestorData) => {
    setInvestorData(data);
    setCurrentScreen(Screen.Literacy);

    // Save progress to cache
    QuizCache.save({
      currentScreen: Screen.Literacy,
      economyData: economyData!,
      investorData: data,
      tradeOffData: tradeOffData || undefined,
    });
  };

  const handleLiteracyComplete = (data: LiteracyData) => {
    setLiteracyData(data);
    setCurrentScreen(Screen.ISFB);

    // Save progress to cache
    QuizCache.save({
      currentScreen: Screen.ISFB,
      economyData: economyData!,
      investorData: investorData!,
      literacyData: data,
      tradeOffData: tradeOffData || undefined,
    });
  };

  const handleISFBComplete = async (data: ISFBData) => {
    setISFBData(data);
    
    // Save ISFB data to cache before redirecting
    QuizCache.save({
      currentScreen: Screen.ISFB,
      economyData: economyData!,
      investorData: investorData!,
      literacyData: literacyData!,
      isfbData: data,
      tradeOffData: tradeOffData || undefined,
    });
    
    // Redirect to TradeOff page
    router.push("/tradeOff");
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto flex flex-col justify-center p-3">
      <Card className="w-full h-full">
        {currentScreen === Screen.Economy && (
          <EconomyQuiz
            onComplete={handleEconomyComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={0}
          />
        )}

        {currentScreen === Screen.Investor && (
          <InvestorQuiz
            onComplete={handleInvestorComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={economiesQuestions.length}
          />
        )}

        {currentScreen === Screen.Literacy && (
          <LiteracyQuiz
            onComplete={handleLiteracyComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={economiesQuestions.length + investorQuestions.length}
          />
        )}

        {currentScreen === Screen.ISFB && (
          <ISFBQuiz
            onComplete={handleISFBComplete}
            totalQuestions={totalQuestions}
            initialAnsweredCount={
              economiesQuestions.length + investorQuestions.length + literacyQuestions.length
            }
          />
        )}
      </Card>
    </main>
  );
}
