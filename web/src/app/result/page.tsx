"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { QuizCache } from "@/src/lib/quizCache";
import {
  InvestorData,
  LiteracyData,
  TradeOffData,
  EconomyData,
} from "@/services/types";
import { ISFBData } from "@/src/lib/isfb";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import ResultsScreen from "@/src/components/results/ResultsScreen";

export const dynamic = "force-dynamic";

export default function ResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  const [resultData, setResultData] = useState<{
    economyData?: EconomyData;
    investorData: InvestorData;
    literacyData: LiteracyData;
    isfbData?: ISFBData;
    tradeOffData?: TradeOffData;
  } | null>(null);

  useEffect(() => {
    const loadResultData = () => {
      const progress = QuizCache.load();
      
      if (!progress || !progress.investorData || !progress.literacyData) {
        setHasValidData(false);
        setIsLoading(false);
        return;
      }

      // Load tradeOff data from sessionStorage as backup
      let tradeOffData: TradeOffData | undefined = progress.tradeOffData;
      if (!tradeOffData) {
        try {
          const storedTradeOff = sessionStorage.getItem('tradeOffData');
          if (storedTradeOff) {
            tradeOffData = JSON.parse(storedTradeOff);
          }
        } catch (error) {
          console.error('Error loading tradeOff data:', error);
        }
      }

      setResultData({
        economyData: progress.economyData,
        investorData: progress.investorData!,
        literacyData: progress.literacyData!,
        isfbData: progress.isfbData,
        tradeOffData,
      });
      setHasValidData(true);
      setIsLoading(false);
    };

    loadResultData();
  }, []);

  const handleStartOver = () => {
    QuizCache.clear();
    router.push('/');
  };

  const handleRetakeQuiz = () => {
    QuizCache.clear();
    router.push('/quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Carregando seus resultados...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasValidData || !resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Resultados Não Encontrados
            </h2>
            <p className="text-gray-600 mb-6">
              Seus dados não foram encontrados. Por favor, complete os questionários primeiro.
            </p>
            <div className="space-y-3 w-full">
              <Button 
                onClick={handleRetakeQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Fazer Questionários
              </Button>
              <Button 
                onClick={handleStartOver}
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ResultsScreen
        economyData={resultData.economyData}
        investorData={resultData.investorData}
        literacyData={resultData.literacyData}
        isfbData={resultData.isfbData}
        tradeOffData={resultData.tradeOffData}
        onStartOver={handleStartOver}
        onRetakeQuiz={handleRetakeQuiz}
      />
    </div>
  );
}
