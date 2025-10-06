"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Loader2,
  Share2,
  CheckCircle2,
  Sparkles,
  Badge,
  RefreshCw,
  Home,
  Download,
} from "lucide-react";

//import { getPersonalizedAdvice } from "@/services/gemini/geminiService";
import {
  InvestorData,
  LiteracyData,
  DospertData,
  TradeOffData,
  DospertResult,
} from "@/services/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { dospertDomains, TPL_DOSPERT } from "@/src/lib/constants";
import { Button } from "@/src/components/ui/button";
import TradeOffBalanceCard from "./TradeOffBalanceCard";
import { calculateTradeOffProfile } from "@/src/lib/tradeOffUtils";

interface ResultsScreenProps {
  investorData: InvestorData;
  literacyData: LiteracyData;
  dospertData: DospertData;
  tradeOffData?: TradeOffData | null;
  onStartOver?: () => void;
  onRetakeQuiz?: () => void;
}

export default function ResultsScreen({
  investorData,
  literacyData,
  dospertData,
  tradeOffData,
  onStartOver,
  onRetakeQuiz,
}: ResultsScreenProps) {
  const [advice, setAdvice] = useState<string>("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const dospertResults: DospertResult[] = useMemo(() => {
    return Object.entries(dospertDomains).map(([domain, info]) => {
      const domainScores = info.items.map((itemId) => dospertData[itemId] || 0);
      const avg = domainScores.reduce((a, b) => a + b, 0) / domainScores.length;

      let classification: "Alta" | "Média" | "Baixa";
      if (avg > 5) classification = "Alta";
      else if (avg > 3) classification = "Média";
      else classification = "Baixa";

      return {
        domain,
        name: info.name,
        avg,
        classification,
        text: TPL_DOSPERT[domain][classification],
        color: info.color,
        textColor: info.textColor,
      };
    });
  }, [dospertData]);

  const tradeOffProfile = useMemo(() => {
    if (!tradeOffData) return null;
    const scenarios = Object.values(tradeOffData);
    const stageArr = scenarios;

    const getStageBounds = (stageNum: number) => {
      const items = stageArr.filter((s) => Number(s.scenario) === stageNum);
      if (!items || items.length === 0) return { first: null, last: null };
      return { first: items[0], last: items[items.length - 1] };
    };

    const { first: firstThirdStage, last: lastThirdStage } = getStageBounds(3);
    const { first: firstFirstStage, last: lastFirstStage } = getStageBounds(1);

    const toNum = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : NaN;
    };

    const numFirstThird = toNum(firstThirdStage?.selectedValues[0]);
    const numLastThird = toNum(
      lastThirdStage?.selectedValues[lastThirdStage?.selectedValues.length - 1]
    );
    const numFirstFirst = toNum(firstFirstStage?.selectedValues[0]);
    const numLastFirst = toNum(
      lastFirstStage?.selectedValues[lastFirstStage.selectedValues.length - 1]
    );

    let result: number | null = null;
    if (
      !Number.isNaN(numFirstThird) &&
      !Number.isNaN(numLastThird) &&
      !Number.isNaN(numFirstFirst) &&
      !Number.isNaN(numLastFirst) &&
      numLastThird !== 0 &&
      numLastFirst !== 0
    ) {
      const ratioThird = numFirstThird / numLastThird;
      const ratioFirst = numFirstFirst / numLastFirst;
      result = ratioFirst !== 0 ? ratioThird / ratioFirst : null;
    }

    const profileInfo =
      result !== null ? calculateTradeOffProfile(result) : null;

    return {
      result,
      profileInfo,
      nums: {
        numFirstThird,
        numLastThird,
        numFirstFirst,
        numLastFirst,
      },
    };
  }, [tradeOffData]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      try {
        // const result = await getPersonalizedAdvice(investorData, dospertResults);
        // setAdvice(result);
      } catch (error) {
        setAdvice("Não foi possível gerar a análise personalizada no momento.");
      } finally {
        setIsLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [investorData, dospertResults]);

  // ✅ Função auxiliar para gerar o PDF e retornar o blob
  const getPDFBlob = useCallback(async (): Promise<Blob | null> => {
    if (!contentRef.current) {
      alert("Conteúdo não encontrado para gerar PDF.");
      return null;
    }

    try {
      const htmlContent = contentRef.current.outerHTML;
      const elementWidth = contentRef.current.offsetWidth;
      const elementHeight = contentRef.current.offsetHeight;

      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            console.warn("Could not read stylesheet rules:", e);
            return "";
          }
        })
        .join("");

      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>${styles}</style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent: fullHtml,
          width: elementWidth,
          height: elementHeight,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar o PDF");
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Erro ao gerar o PDF. Por favor, tente novamente.");
      return null;
    }
  }, []);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const blob = await getPDFBlob();
      if (!blob) {
        setIsGeneratingPDF(false);
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `perfil-risco-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar PDF. Por favor, tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // Gera o PDF e obtém o blob
      const blob = await getPDFBlob();
      if (!blob) {
        setIsSharing(false);
        return;
      }

      // Cria o arquivo para compartilhamento
      const file = new File([blob], "perfil-risco.pdf", {
        type: "application/pdf",
      });

      // Verifica se o navegador suporta compartilhamento nativo
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Meu Perfil de Risco Financeiro",
          text: "Confira minha análise de perfil de risco financeiro!",
        });
      } else {
        // Fallback: faz download do PDF
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `perfil-risco-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      alert("Erro ao compartilhar. Por favor, tente novamente.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Seus Resultados
        </h1>
      </header>

      <main
        ref={contentRef}
        className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-24"
      >
        {/* DOSPERT Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Propensão a Assumir Riscos
            </CardTitle>
            <CardDescription>Análise por domínio de risco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dospertResults.map((result) => (
                <div
                  key={result.domain}
                  className={`p-4 rounded-lg border-2 ${result.color}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold ${result.textColor}`}>
                      {result.name}
                    </h3>
                    <Badge
                      className={`${result.color.replace("100", "200")} ${
                        result.textColor
                      }`}
                    >
                      {result.classification}
                    </Badge>
                  </div>
                  <p className={`text-sm ${result.textColor} opacity-90`}>
                    {result.text}
                  </p>

                  {result.name === "Financeiro" && (
                    <div className="mt-4 pt-3 border-t border-green-200/60">
                      <h4 className="font-bold text-green-900 mb-2">
                        Perfil de Investidor
                      </h4>
                      <div className="bg-green-100/50 p-3 rounded-md border border-green-200/60">
                        <h5 className="font-semibold text-green-800">
                          {investorData.profile.title}
                        </h5>
                        <p className="text-sm text-green-700 mt-1">
                          {investorData.profile.description}
                        </p>
                        {/* Trade-Off Data */}
                        {tradeOffData &&
                          Object.keys(tradeOffData).length > 0 && (
                            <>
                              {tradeOffProfile &&
                              tradeOffProfile.result !== null &&
                              tradeOffProfile.profileInfo ? (
                                <div className="space-y-4 pt-4">
                                  <TradeOffBalanceCard
                                    tradeOffValue={tradeOffProfile.result}
                                    profile={
                                      tradeOffProfile.profileInfo.profile
                                    }
                                    description={
                                      tradeOffProfile.profileInfo.description
                                    }
                                  />
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700">
                                  Não foi possível calcular seu perfil de
                                  trade-off com os dados fornecidos.
                                </p>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF || isSharing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            disabled={isGeneratingPDF || isSharing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSharing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Compartilhando...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </>
            )}
          </Button>

          {onRetakeQuiz && (
            <Button onClick={onRetakeQuiz} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refazer Quiz
            </Button>
          )}

          {onStartOver && (
            <Button onClick={onStartOver} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          Nota: Estes resultados são uma ferramenta de autoconhecimento e não
          constituem uma recomendação de investimento ou diagnóstico.
        </div>
      </main>
    </div>
  );
}
