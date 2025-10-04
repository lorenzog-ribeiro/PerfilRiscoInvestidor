'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Share2, CheckCircle2, Sparkles, Badge } from 'lucide-react';
import { getPersonalizedAdvice } from '@/services/gemini/geminiService';
import { InvestorData, LiteracyData, DospertData, TradeOffData, DospertResult } from '@/services/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/src/components/ui/card';
import { dospertDomains, TPL_DOSPERT } from '@/src/lib/constants';
import { Button } from '@/src/components/ui/button';

interface ResultsScreenProps {
  investorData: InvestorData;
  literacyData: LiteracyData;
  dospertData: DospertData;
  tradeOffData?: TradeOffData | null;
}

export default function ResultsScreen({ 
  investorData, 
  literacyData, 
  dospertData, 
  tradeOffData
}: ResultsScreenProps) {
  const [advice, setAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const dospertResults: DospertResult[] = useMemo(() => {
    return Object.entries(dospertDomains).map(([domain, info]) => {
      const domainScores = info.items.map(itemId => dospertData[itemId] || 0);
      const avg = domainScores.reduce((a, b) => a + b, 0) / domainScores.length;
      
      let classification: 'Alta' | 'Média' | 'Baixa';
      if (avg > 5) classification = 'Alta';
      else if (avg > 3) classification = 'Média';
      else classification = 'Baixa';

      return {
        domain,
        name: info.name,
        avg,
        classification,
        text: TPL_DOSPERT[domain][classification],
        color: info.color,
        textColor: info.textColor
      };
    });
  }, [dospertData]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      try {
        const result = await getPersonalizedAdvice(investorData, dospertResults);
        setAdvice(result);
      } catch (error) {
        setAdvice('Não foi possível gerar a análise personalizada no momento.');
      } finally {
        setIsLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [investorData, dospertResults]);

  const handleShare = async () => {
    const shareText = `Meu Perfil de Risco Financeiro:\n\n` +
      `👤 Perfil de Investidor: ${investorData.profile.title}\n\n` +
      `📊 Propensão a Riscos:\n` +
      dospertResults.map(r => `• ${r.name}: ${r.classification}`).join('\n') +
      `\n\nDescubra o seu perfil também!`;

    const shareData = {
      title: 'Meu Perfil de Risco Financeiro',
      text: shareText,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Seus Resultados</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-24">
        {/* AI Analysis Section */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Análise Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAdvice ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Gerando sua análise...</span>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {advice}
              </p>
            )}
          </CardContent>
        </Card>

        {/* DOSPERT Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Propensão a Assumir Riscos</CardTitle>
            <CardDescription>Análise por domínio de risco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dospertResults.map(result => (
                <div key={result.domain} className={`p-4 rounded-lg border-2 ${result.color}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold ${result.textColor}`}>{result.name}</h3>
                    <Badge
                      className={`${result.color.replace('100', '200')} ${result.textColor}`}
                    >
                      {result.classification}
                    </Badge>
                  </div>
                  <p className={`text-sm ${result.textColor} opacity-90`}>{result.text}</p>

                  {/* Financial Domain - Show Investor Profile */}
                  {result.name === 'Financeiro' && (
                    <div className="mt-4 pt-3 border-t border-green-200/60">
                      <h4 className="font-bold text-green-900 mb-2">Perfil de Investidor</h4>
                      <div className="bg-green-100/50 p-3 rounded-md border border-green-200/60">
                        <h5 className="font-semibold text-green-800">{investorData.profile.title}</h5>
                        <p className="text-sm text-green-700 mt-1">{investorData.profile.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trade-Off Data (if available) */}
        {tradeOffData && Object.keys(tradeOffData).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Análise de Trade-Offs</CardTitle>
              <CardDescription>Suas escolhas entre ganhos e perdas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(tradeOffData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{key}</span>
                    <span className="text-sm text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}