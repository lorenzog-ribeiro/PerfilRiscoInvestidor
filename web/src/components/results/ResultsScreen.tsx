"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Badge,
  CheckCircle2,
  XCircle,
  Share2,
  RefreshCw,
  Home,
  Download,
} from "lucide-react";
import {
  InvestorData,
  LiteracyData,
  DospertData,
  TradeOffData,
  EconomyData,
} from "@/services/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { literacyQuestions, literacyAnswers } from "@/src/lib/constants";
import { calculateISFB_Part1_Only, ISFBResult, ISFBData } from "@/src/lib/isfb";
import TradeOffBalanceCard from "./TradeOffBalanceCard";
import { calculateTradeOffProfile } from "@/src/lib/tradeOffUtils";
import { combinedRisk } from "@/src/lib/risk";

interface ResultsScreenProps {
  economyData?: EconomyData | null;
  investorData: InvestorData;
  literacyData: LiteracyData;
  isfbData?: ISFBData | null;
  dospertData?: DospertData;
  tradeOffData?: TradeOffData | null;
  onStartOver?: () => void;
  onRetakeQuiz?: () => void;
}

const profileDescriptions = {
  Conservador: {
    title: "Perfil Conservador",
    description:
      "Você prioriza a segurança do seu capital. Sua combinação de tolerância ao risco e competência financeira indica uma preferência por investimentos de baixa volatilidade, mesmo que isso signifique retornos mais modestos.",
  },
  Moderado: {
    title: "Perfil Moderado",
    description:
      "Você busca um equilíbrio entre segurança e crescimento. Sua matriz de risco mostra que você está disposto(a) a aceitar alguma volatilidade em troca de um potencial de retorno maior, tomando decisões de forma ponderada.",
  },
  Agressivo: {
    title: "Perfil Agressivo",
    description:
      "Você tem uma alta tolerância ao risco e busca maximizar o potencial de retorno dos seus investimentos. Sua competência financeira lhe dá confiança para navegar em mercados mais voláteis em busca de oportunidades de alto crescimento.",
  },
};

const profileColors = {
  Conservador: {
    bg: "bg-indigo-100",
    border: "border-indigo-300",
    cardBg: "bg-indigo-50",
    cardBorder: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  },
  Moderado: {
    bg: "bg-amber-100",
    border: "border-amber-300",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-200",
    badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  Agressivo: {
    bg: "bg-teal-100",
    border: "border-teal-300",
    cardBg: "bg-teal-50",
    cardBorder: "border-teal-200",
    badge: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  },
};

type ProfileKey = keyof typeof profileDescriptions;

const getProfileForCell = (x: number, y: number): ProfileKey => {
  if ((y >= 9 && x >= 7) || (y >= 7 && x >= 9)) {
    return "Agressivo";
  }
  if (y <= 3 || (y === 4 && x <= 6) || (y >= 5 && x <= 3)) {
    return "Conservador";
  }
  return "Moderado";
};

const RiskMatrix: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const yTicks = Array.from({ length: 10 }, (_, i) => 10 - i);
  const xTicks = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Matriz de Riscos</h3>
      <div className="flex w-full max-w-sm mx-auto">
        <div
          className="flex items-center justify-center -rotate-180"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-sm font-semibold text-gray-600 tracking-wider">
            Tolerância ao Risco →
          </span>
        </div>

        <div className="flex-grow ml-2">
          <div className="grid grid-cols-10 grid-rows-10 gap-0.5 aspect-square">
            {yTicks.map((gridY) =>
              xTicks.map((gridX) => {
                const isUserPos = gridX === x && gridY === y;
                const profile = getProfileForCell(gridX, gridY);
                const color = profileColors[profile].bg;
                return (
                  <div
                    key={`${gridX}-${gridY}`}
                    className={`w-full h-full rounded-sm ${color} flex items-center justify-center ${
                      isUserPos
                        ? "ring-2 ring-offset-2 ring-blue-600 scale-110 z-10"
                        : ""
                    }`}
                    title={`Competência (X): ${gridX}, Tolerância (Y): ${gridY}, Perfil: ${profile}`}
                  >
                    {isUserPos && (
                      <span className="text-lg font-bold text-blue-700">★</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="grid grid-cols-10 gap-0.5 mt-1">
            {xTicks.map((label, i) => (
              <div key={i} className="text-center text-[10px] text-gray-500">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm font-semibold text-gray-600 tracking-wider">
          → Competência Financeira
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs text-gray-700">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-sm mr-2 ${profileColors.Conservador.bg}`}
          ></div>
          <span>Conservador</span>
        </div>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-sm mr-2 ${profileColors.Moderado.bg}`}
          ></div>
          <span>Moderado</span>
        </div>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-sm mr-2 ${profileColors.Agressivo.bg}`}
          ></div>
          <span>Agressivo</span>
        </div>
      </div>
    </div>
  );
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  economyData,
  investorData,
  literacyData,
  isfbData,
  dospertData,
  tradeOffData,
  onStartOver,
  onRetakeQuiz,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

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

  // Calculate ISFB from isfbData (preferred) or economyData (fallback)
  const isfbResult: ISFBResult = useMemo(() => {
    // First try to use isfbData directly
    if (isfbData && Object.keys(isfbData).length > 0) {
      return calculateISFB_Part1_Only(isfbData);
    }

    // Fallback to economyData if available
    if (economyData && Object.keys(economyData).length > 0) {
      // Convert EconomyData (numbers) to ISFBData (strings)
      const convertedIsfbData: Record<string, string> = {};
      Object.entries(economyData).forEach(([key, value]) => {
        // Convert number back to choice letter
        convertedIsfbData[key] = String.fromCharCode("a".charCodeAt(0) + value);
      });
      return calculateISFB_Part1_Only(convertedIsfbData);
    }

    // Default ISFB if no data
    return {
      part1Sum: 24,
      index0to100: 50,
      band: "Ok",
      profile: {
        title: "Ok",
        description: "Sua situação financeira está em um nível intermediário.",
      },
    };
  }, [isfbData, economyData]);

  const matrixResult = useMemo(() => {
    const MIN_INVESTOR_SCORE = 13;
    const MAX_INVESTOR_SCORE = 47;
    const toleranceScore = investorData.score;
    const toleranceNorm = Math.max(
      0,
      Math.min(
        1,
        (toleranceScore - MIN_INVESTOR_SCORE) /
          (MAX_INVESTOR_SCORE - MIN_INVESTOR_SCORE)
      )
    );

    const healthNorm = isfbResult.index0to100 / 100;

    const knowledgeQuestions = literacyQuestions.filter(
      (q) => q.type !== "likert-5"
    );
    const correctAnswers = knowledgeQuestions.reduce(
      (count, q) =>
        literacyData[q.id] === literacyAnswers[q.id] ? count + 1 : count,
      0
    );
    const knowledgeNorm =
      knowledgeQuestions.length > 0
        ? correctAnswers / knowledgeQuestions.length
        : 0;

    const competenceNorm = 0.7 * healthNorm + 0.3 * knowledgeNorm;

    const getBin10 = (v: number) =>
      Math.min(10, Math.max(1, Math.ceil(v * 10)));

    // Calculate LA coefficient from TradeOff data
    let LAcoefficient = 1.0; // Default value (neutral)
    if (tradeOffData && Object.keys(tradeOffData).length > 0) {
      const scenarios = Object.values(tradeOffData);
      const getStageBounds = (stageNum: number) => {
        const items = scenarios.filter((s) => Number(s.scenario) === stageNum);
        if (!items || items.length === 0) return { first: null, last: null };
        return { first: items[0], last: items[items.length - 1] };
      };

      const { first: firstThirdStage, last: lastThirdStage } =
        getStageBounds(3);
      const { first: firstFirstStage, last: lastFirstStage } =
        getStageBounds(1);

      const toNum = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
      };

      const numFirstThird = toNum(firstThirdStage?.selectedValues[0]);
      const numLastThird = toNum(
        lastThirdStage?.selectedValues[
          lastThirdStage?.selectedValues.length - 1
        ]
      );
      const numFirstFirst = toNum(firstFirstStage?.selectedValues[0]);
      const numLastFirst = toNum(
        lastFirstStage?.selectedValues[lastFirstStage.selectedValues.length - 1]
      );

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
        if (ratioFirst !== 0) {
          LAcoefficient = ratioThird / ratioFirst;
        }
      }
    }

    // Use combinedRisk to calculate the Y coordinate (tolerance with LA adjustment)
    let y_bin = getBin10(toleranceNorm); // Default if combinedRisk fails
    let riskResult = null;

    try {
      riskResult = combinedRisk(LAcoefficient, toleranceScore, 1, 1, true);
      y_bin = riskResult.S_int; // Use the calculated risk score as Y coordinate
    } catch (error) {
      console.warn("Error calculating combined risk, using default Y:", error);
    }

    const toleranceRaw = Math.round(toleranceNorm * 100);
    const toleranceClassBin = getBin10(toleranceNorm);
    const tolLabels10 = [
      "Muito Baixa",
      "Muito Baixa",
      "Baixa",
      "Baixa",
      "Média",
      "Média",
      "Alta",
      "Alta",
      "Muito Alta",
      "Muito Alta",
    ];
    const toleranceClassLabel = tolLabels10[toleranceClassBin - 1];

    const x_bin = getBin10(competenceNorm);

    const finalProfileKey = getProfileForCell(x_bin, y_bin);
    const finalProfile = profileDescriptions[finalProfileKey];

    const knowledgeCheck = {
      juros: literacyData["q1"] === literacyAnswers["q1"],
      inflacao: literacyData["q2"] === literacyAnswers["q2"],
      diversificacao: literacyData["q3"] === literacyAnswers["q3"],
    };

    return {
      x_bin,
      y_bin,
      finalProfile,
      finalProfileKey,
      correctAnswers,
      knowledgeQuestionsCount: knowledgeQuestions.length,
      toleranceRaw,
      toleranceClassBin,
      toleranceClassLabel,
      knowledgeCheck,
      LAcoefficient,
      riskResult,
    };
  }, [investorData.score, literacyData, isfbResult.index0to100, tradeOffData]);

  const {
    x_bin,
    y_bin,
    finalProfile,
    finalProfileKey,
    correctAnswers,
    knowledgeQuestionsCount,
    toleranceRaw,
    toleranceClassBin,
    toleranceClassLabel,
    knowledgeCheck,
  } = matrixResult;

  return (
    <div
      className="flex flex-col min-h-screen bg-background"
      data-x={x_bin}
      data-y={y_bin}
      data-perfil={finalProfileKey}
      data-tolerancia-classe={toleranceClassBin}
    >
      <header className="p-6 text-center border-b">
        <h1 className="text-3xl font-bold tracking-tight">
          Seu Perfil de Investidor
        </h1>
      </header>

      <main
        ref={contentRef}
        className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full"
        aria-live="polite"
      >
        {/* Profile Card */}
        <Card
          className={`${profileColors[finalProfileKey].cardBg} ${profileColors[finalProfileKey].cardBorder}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{finalProfile.title}</CardTitle>
              <Badge className={profileColors[finalProfileKey].badge}>
                {finalProfileKey}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{finalProfile.description}</p>
          </CardContent>
        </Card>

        {/* Risk Matrix Visualization */}
        <Card>
          <CardContent className="pt-6">
            <RiskMatrix x={x_bin} y={y_bin} />
          </CardContent>
        </Card>

        {/* Profile Components Details */}
        <Card>
          <CardHeader>
            <CardTitle>Componentes do seu Perfil</CardTitle>
            <CardDescription>
              Análise detalhada dos fatores que compõem seu perfil de investidor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Risk Tolerance */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-base">
                  Tolerância ao Risco Financeiro
                </CardTitle>
                <CardDescription className="text-foreground/80">
                  Índice: {toleranceRaw}/100 • Classificação:{" "}
                  {toleranceClassLabel}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sua tolerância ao risco foi classificada como muito alta. Essa
                  medida reflete o grau de conforto com volatilidade e perdas
                  potenciais no curto prazo. Recomenda-se alinhar a alocação de
                  ativos a esse nível para evitar decisões impulsivas em
                  cenários de estresse.
                </p>

                {/* Investor Profile and TradeOff embedded here */}
                {/* <div className="mt-4 pt-3 border-t border-green-200">
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

                    {tradeOffData && Object.keys(tradeOffData).length > 0 && (() => {
                      const scenarios = Object.values(tradeOffData);
                      const getStageBounds = (stageNum: number) => {
                        const items = scenarios.filter((s) => Number(s.scenario) === stageNum);
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

                      const profileInfo = result !== null ? calculateTradeOffProfile(result) : null;

                      return (
                        <>
                          {result !== null && profileInfo ? (
                            <div className="mt-4">
                              <TradeOffBalanceCard
                                tradeOffValue={result}
                                profile={profileInfo.profile}
                                description={profileInfo.description}
                              />
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 mt-4">
                              Não foi possível calcular seu perfil de trade-off com os dados fornecidos.
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Financial Health */}
            {isfbResult && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">Saúde Financeira</CardTitle>
                  <CardDescription className="text-foreground/80">
                    Índice: {isfbResult.index0to100}/100 • Classificação:{" "}
                    {isfbResult.profile.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Parabéns, você alcançou o equilíbrio! Suas contas estão em
                    dia. O próximo passo é transformar esse equilíbrio em
                    segurança, construindo uma reserva para imprevistos e
                    começando a planejar seus objetivos maiores.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Financial Knowledge */}
            {Object.keys(literacyData).length > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-base">
                    Conhecimento Financeiro
                  </CardTitle>
                  <CardDescription className="text-foreground/80">
                    Acertos: {correctAnswers} de {knowledgeQuestionsCount}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      {knowledgeCheck.juros ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          Juros compostos:{" "}
                          {knowledgeCheck.juros ? "Correto" : "Incorreto"}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          &quot;Capacidade de calcular crescimento de capital e
                          diferenciar taxa nominal de efetiva.&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {knowledgeCheck.inflacao ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          Inflação:{" "}
                          {knowledgeCheck.inflacao ? "Correto" : "Incorreto"}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          &quot;Entendimento do impacto no poder de compra e na
                          taxa real de retorno.&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {knowledgeCheck.diversificacao ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          Diversificação:{" "}
                          {knowledgeCheck.diversificacao
                            ? "Correto"
                            : "Incorreto"}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          &quot;Compreensão de correlação entre ativos e redução
                          de risco não sistemático.&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-muted-foreground">
                      Priorizar estudo dos tópicos marcados como incorretos
                      antes de aumentar a exposição a risco.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="p-6 border-t bg-muted/30">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground text-center mb-4">
              Nota: Estes resultados são uma ferramenta de autoconhecimento e
              não constituem uma recomendação de investimento.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || isSharing}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGeneratingPDF ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
                size="lg"
              >
                {isSharing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
                <Button
                  onClick={onRetakeQuiz}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refazer Quiz
                </Button>
              )}
              {onStartOver && (
                <Button
                  onClick={onStartOver}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  aria-label="Voltar ao início"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
};

export default ResultsScreen;
