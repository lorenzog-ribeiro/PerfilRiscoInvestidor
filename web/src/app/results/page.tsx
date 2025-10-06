'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { QuizCache } from '@/src/lib/quizCache';
import { InvestorData, LiteracyData, DospertData, TradeOffData, EconomyData } from '@/services/types';
import { ISFBData } from '@/src/lib/isfb';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import ResultsScreen from '../../components/results/ResultsScreen';

export default function ResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  const [resultData, setResultData] = useState<{
    economyData?: EconomyData;
    investorData: InvestorData;
    literacyData: LiteracyData;
    isfbData?: ISFBData;
    dospertData?: DospertData;
    tradeOffData?: TradeOffData;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const loadResultData = () => {
      const progress = QuizCache.load();
      
      if (!progress || !QuizCache.hasCompleteData()) {
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
        dospertData: progress.dospertData,
        tradeOffData,
      });
      setHasValidData(true);
      setIsLoading(false);
      setTimeRemaining(QuizCache.getTimeRemaining());

      // Extend cache expiration when viewing results
      QuizCache.extendExpiration();
    };

    loadResultData();

    // Update time remaining every minute
    const interval = setInterval(() => {
      const remaining = QuizCache.getTimeRemaining();
      setTimeRemaining(remaining);
      
      // If cache expired, clear data
      if (remaining === 0) {
        setHasValidData(false);
        setResultData(null);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleStartOver = () => {
    QuizCache.clear();
    router.push('/');
  };

  const handleRetakeQuiz = () => {
    QuizCache.clear();
    router.push('/tradeOff');
  };

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} minutos`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
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
              Seus dados expiraram ou não foram encontrados. Isso pode acontecer se:
            </p>
            <ul className="text-sm text-gray-500 mb-6 text-left space-y-1">
              <li>• Você não completou todos os questionários</li>
              <li>• Os dados expiraram (após 1 hora)</li>
              <li>• O cache do navegador foi limpo</li>
            </ul>
            <div className="space-y-3 w-full">
              <Button 
                onClick={handleRetakeQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Refazer Questionário
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
      {/* Time remaining indicator */}
      {timeRemaining > 0 && (
        <div className="bg-blue-600 text-white text-center py-2 text-sm">
          Seus resultados expiram em: {formatTimeRemaining(timeRemaining)}
        </div>
      )}
      
      <ResultsScreen
        economyData={resultData.economyData}
        investorData={resultData.investorData}
        literacyData={resultData.literacyData}
        isfbData={resultData.isfbData}
        dospertData={resultData.dospertData}
        tradeOffData={resultData.tradeOffData}
        onStartOver={handleStartOver}
        onRetakeQuiz={handleRetakeQuiz}
      />
    </div>
  );
}