"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TradeOffData, TradeOffScenarioData } from "@/services/types";
import { QuizCache } from "@/src/lib/quizCache";

const TradeOffForm = dynamic(() => import("./TradeOffForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  ),
});

interface ScenarioControllerProps {
  onTradeOffComplete?: (data: TradeOffData) => void;
}

export default function ScenarioController({ onTradeOffComplete }: ScenarioControllerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scenario2LastValue, setScenario2LastValue] = useState<number | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);
  const [tradeOffData, setTradeOffData] = useState<TradeOffData>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (currentIndex === 3) {
      sessionStorage.setItem('tradeOffData', JSON.stringify(tradeOffData));
      QuizCache.save({ 
        tradeOffData: tradeOffData,
        currentScreen: 0 // Reset to first quiz screen
      });
      
      if (onTradeOffComplete) {
        onTradeOffComplete(tradeOffData);
      } else {
        router.push("/result");
      }
    }
  }, [currentIndex, router, onTradeOffComplete, tradeOffData]);

  const scenariosConfig = [
    { scenario: 1, title: "Cenário 1" },
    { scenario: 2, title: "Cenário 2" },
    { scenario: 3, title: "Cenário 3" },
  ];

  const currentScenario = scenariosConfig[currentIndex];

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <TradeOffForm
        key={currentScenario.scenario}
        scenario={currentScenario.scenario}
        title={currentScenario.title}
        onAnswered={(scenarioData) => {
          // Store the scenario data
          setTradeOffData(prev => ({
            ...prev,
            [currentScenario.scenario]: scenarioData
          }));
          setCurrentIndex(currentIndex + 1);
        }}
        onValueSelected={(value) => {
          if (currentScenario.scenario === 2) {
            setScenario2LastValue(value);
          }
        }}
        initialFixedValue={
          currentScenario.scenario === 3 ? scenario2LastValue : null
        }
      />
    </div>
  );
}
