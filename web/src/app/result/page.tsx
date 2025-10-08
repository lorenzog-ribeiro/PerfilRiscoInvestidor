"use client";

import { useState, useEffect, useRef } from "react";
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
import { QuizSubmissionService } from "@/services/QuizSubmissionService";

export const dynamic = "force-dynamic";

export default function ResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const hasAttemptedSubmission = useRef(false); // Prevent double submission
  const [resultData, setResultData] = useState<{
    economyData?: EconomyData;
    investorData: InvestorData;
    literacyData: LiteracyData;
    isfbData?: ISFBData;
    tradeOffData?: TradeOffData;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 useEffect triggered - hasAttemptedSubmission:', hasAttemptedSubmission.current, 'hasSubmitted:', hasSubmitted);
      
      // Prevent double execution with useRef
      if (hasAttemptedSubmission.current) {
        console.log('🛑 Submission already attempted, skipping');
        return;
      }

      // Check if already submitted in this session
      if (hasSubmitted) {
        console.log('⏭️ Submission already done in this session, skipping');
        return;
      }

      console.log('🔍 Checking submission timestamp...');
      
      // Check for submission timestamp to prevent duplicates across page reloads
      const submissionTimestamp = localStorage.getItem('quizSubmissionTimestamp');
      const now = Date.now();
      
      if (submissionTimestamp) {
        console.log('📅 Found submission timestamp:', new Date(parseInt(submissionTimestamp, 10)).toISOString());
      }
      
      // If submitted less than 5 minutes ago, skip
      if (submissionTimestamp) {
        const timeSinceSubmission = now - parseInt(submissionTimestamp, 10);
        console.log('⏱️ Time since last submission:', Math.floor(timeSinceSubmission / 1000), 'seconds');
        
        if (timeSinceSubmission < 5 * 60 * 1000) { // 5 minutes
          console.log('⏭️ Quiz recently submitted (within 5 minutes), skipping');
          setHasSubmitted(true);
          hasAttemptedSubmission.current = true;
          setIsLoading(false);
          // Load data for display but don't submit
          const progress = QuizCache.load();
          if (progress && progress.investorData && progress.literacyData) {
            const tradeOffDataString = sessionStorage.getItem('tradeOffData');
            let loadedTradeOffData: TradeOffData | undefined;
            if (tradeOffDataString) {
              try {
                loadedTradeOffData = JSON.parse(tradeOffDataString);
              } catch (error) {
                console.error('❌ Error parsing TradeOff data:', error);
              }
            }
            setResultData({
              economyData: progress.economyData,
              investorData: progress.investorData,
              literacyData: progress.literacyData,
              isfbData: progress.isfbData,
              tradeOffData: loadedTradeOffData
            });
            setHasValidData(true);
          }
          return;
        }
      }

      console.log('✅ No recent submission found, proceeding...');
      
      // Mark that we're attempting submission
      hasAttemptedSubmission.current = true;

      const progress = QuizCache.load();

      // Check if progress is null or missing required data
      if (!progress || !progress.investorData || !progress.literacyData) {
        console.warn('Missing required quiz data');
        setHasValidData(false);
        setIsLoading(false);
        return;
      }

      // Try to load TradeOff data from sessionStorage as fallback
      const tradeOffDataString = sessionStorage.getItem('tradeOffData');
      let loadedTradeOffData: TradeOffData | undefined;

      if (tradeOffDataString) {
        try {
          loadedTradeOffData = JSON.parse(tradeOffDataString);
          console.log('✅ TradeOff data loaded from sessionStorage:', loadedTradeOffData);
        } catch (error) {
          console.error('❌ Error parsing TradeOff data from sessionStorage:', error);
        }
      }

      const data = {
        economyData: progress.economyData,
        investorData: progress.investorData,
        literacyData: progress.literacyData,
        isfbData: progress.isfbData,
        tradeOffData: loadedTradeOffData
      };

      setResultData(data);
      setHasValidData(true);
      setIsLoading(false);

      // Only submit if not already submitted
      if (!hasSubmitted) {
        console.log('📤 Starting quiz submission...');
        setIsSubmitting(true);
        setSubmitError(null);

        try {
          const submissionService = new QuizSubmissionService();

          // Get userId from localStorage (you may need to adjust this based on your auth system)
          const userId = localStorage.getItem('userId') || 'anonymous';

          console.log('📦 Submitting complete quiz data:', {
            economyData: data.economyData,
            investorData: data.investorData,
            literacyData: data.literacyData,
            isfbData: data.isfbData,
            tradeOffData: data.tradeOffData
          });

          const result = await submissionService.submitCompleteQuiz({
            ...data,
            userId
          });

          console.log('✅ Quiz submission successful:', result);

          // Mark as submitted with timestamp
          const timestamp = Date.now().toString();
          localStorage.setItem('quizSubmissionTimestamp', timestamp);
          sessionStorage.setItem('quizSubmitted', 'true');
          setHasSubmitted(true);
        } catch (error) {
          console.error('❌ Error submitting quiz:', error);
          setSubmitError(error instanceof Error ? error.message : 'Erro ao salvar dados');
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    loadData();
  }, [hasSubmitted]); // Add hasSubmitted as dependency

  const handleStartOver = () => {
    QuizCache.clear();
    sessionStorage.removeItem('quizSubmitted');
    sessionStorage.removeItem('tradeOffData');
    localStorage.removeItem('quizSubmissionTimestamp'); // Clear timestamp
    router.push('/');
  };

  const handleRetakeQuiz = () => {
    QuizCache.clear();
    sessionStorage.removeItem('quizSubmitted');
    sessionStorage.removeItem('tradeOffData');
    localStorage.removeItem('quizSubmissionTimestamp'); // Clear timestamp
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
