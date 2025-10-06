'use client';

import React, { useMemo } from 'react';
import { Badge, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

// Types (you'll need to import these from your types file)
interface InvestorData {
  score: number;
}

interface LiteracyData {
  [key: string]: string;
}

interface ISFBResult {
  index0to100: number;
  profile: {
    title: string;
    description: string;
    recommendation?: string;
  };
}

interface ResultsScreenProps {
  investorData: InvestorData;
  literacyData: LiteracyData;
  isfbResult: ISFBResult;
  onRestart: () => void;
}

// Constants (import from your constants file)
const literacyQuestions = [
  { id: 'q1', type: 'multiple-choice' },
  { id: 'q2', type: 'multiple-choice' },
  { id: 'q3', type: 'multiple-choice' },
];

const literacyAnswers = {
  q1: 'correct_answer_1',
  q2: 'correct_answer_2',
  q3: 'correct_answer_3',
};

// ===================================================================
// Risk Matrix Logic and Components
// ===================================================================

const profileDescriptions = {
  Conservador: { 
    title: "Perfil Conservador", 
    description: "Você prioriza a segurança do seu capital. Sua combinação de tolerância ao risco e competência financeira indica uma preferência por investimentos de baixa volatilidade, mesmo que isso signifique retornos mais modestos." 
  },
  Moderado: { 
    title: "Perfil Moderado", 
    description: "Você busca um equilíbrio entre segurança e crescimento. Sua matriz de risco mostra que você está disposto(a) a aceitar alguma volatilidade em troca de um potencial de retorno maior, tomando decisões de forma ponderada." 
  },
  Agressivo: { 
    title: "Perfil Agressivo", 
    description: "Você tem uma alta tolerância ao risco e busca maximizar o potencial de retorno dos seus investimentos. Sua competência financeira lhe dá confiança para navegar em mercados mais voláteis em busca de oportunidades de alto crescimento." 
  },
};

const profileColors = {
  Conservador: { 
    bg: 'bg-indigo-100', 
    border: 'border-indigo-300', 
    cardBg: 'bg-indigo-50', 
    cardBorder: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100'
  },
  Moderado: { 
    bg: 'bg-amber-100', 
    border: 'border-amber-300', 
    cardBg: 'bg-amber-50', 
    cardBorder: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 hover:bg-amber-100'
  },
  Agressivo: { 
    bg: 'bg-teal-100', 
    border: 'border-teal-300', 
    cardBg: 'bg-teal-50', 
    cardBorder: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-800 hover:bg-teal-100'
  },
};

type ProfileKey = keyof typeof profileDescriptions;

const getProfileForCell = (x: number, y: number): ProfileKey => {
  if ((y >= 9 && x >= 7) || (y >= 7 && x >= 9)) {
    return 'Agressivo';
  }
  if (y <= 3 || (y === 4 && x <= 6) || (y >= 5 && x <= 3)) {
    return 'Conservador';
  }
  return 'Moderado';
};

const RiskMatrix: React.FC<{ x: number; y: number; }> = ({ x, y }) => {
  const yTicks = Array.from({length: 10}, (_, i) => 10 - i);
  const xTicks = Array.from({length: 10}, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Matriz de Riscos</h3>
      <div className="flex w-full max-w-sm mx-auto">
        <div className="flex items-center justify-center -rotate-180" style={{ writingMode: 'vertical-rl' }}>
          <span className="text-sm font-semibold text-gray-600 tracking-wider">Tolerância ao Risco →</span>
        </div>
        
        <div className="flex-grow ml-2">
          <div className="grid grid-cols-10 grid-rows-10 gap-0.5 aspect-square">
            {yTicks.map(gridY => (
              xTicks.map(gridX => {
                const isUserPos = gridX === x && gridY === y;
                const profile = getProfileForCell(gridX, gridY);
                const color = profileColors[profile].bg;
                return (
                  <div
                    key={`${gridX}-${gridY}`}
                    className={`w-full h-full rounded-sm ${color} flex items-center justify-center ${isUserPos ? 'ring-2 ring-offset-2 ring-primary scale-110 z-10' : ''}`}
                    title={`Competência (X): ${gridX}, Tolerância (Y): ${gridY}, Perfil: ${profile}`}
                  >
                    {isUserPos && <span className="text-lg font-bold text-primary">★</span>}
                  </div>
                );
              })
            ))}
          </div>
          <div className="grid grid-cols-10 gap-0.5 mt-1">
            {xTicks.map((label, i) => (
              <div key={i} className="text-center text-[10px] text-muted-foreground">{label}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm font-semibold text-gray-600 tracking-wider">→ Competência Financeira</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-sm mr-2 ${profileColors.Conservador.bg}`}></div>
          <span className="text-muted-foreground">Conservador</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-sm mr-2 ${profileColors.Moderado.bg}`}></div>
          <span className="text-muted-foreground">Moderado</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-sm mr-2 ${profileColors.Agressivo.bg}`}></div>
          <span className="text-muted-foreground">Agressivo</span>
        </div>
      </div>
    </div>
  );
};

const Recommendation: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, linkText, url] = match;
          return (
            <a 
              href={url} 
              key={index} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-semibold"
            >
              {linkText}
            </a>
          );
        }
        return part;
      })}
    </>
  );
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  investorData, 
  literacyData, 
  isfbResult, 
  onRestart 
}) => {
  const matrixResult = useMemo(() => {
    const MIN_INVESTOR_SCORE = 13;
    const MAX_INVESTOR_SCORE = 47;
    const toleranceScore = investorData.score;
    const toleranceNorm = Math.max(0, Math.min(1, (toleranceScore - MIN_INVESTOR_SCORE) / (MAX_INVESTOR_SCORE - MIN_INVESTOR_SCORE)));

    const healthNorm = isfbResult.index0to100 / 100;
    
    const knowledgeQuestions = literacyQuestions.filter(q => q.type !== 'likert-5');
    const correctAnswers = knowledgeQuestions.reduce((count, q) => 
      (literacyData[q.id] === literacyAnswers[q.id] ? count + 1 : count), 0);
    const knowledgeNorm = knowledgeQuestions.length > 0 ? correctAnswers / knowledgeQuestions.length : 0;
    
    const competenceNorm = 0.7 * healthNorm + 0.3 * knowledgeNorm;

    const getBin10 = (v: number) => Math.min(10, Math.max(1, Math.ceil(v * 10)));

    const toleranceRaw = Math.round(toleranceNorm * 100);
    const toleranceClassBin = getBin10(toleranceNorm);
    const tolLabels10 = ['Muito Baixa','Muito Baixa','Baixa','Baixa','Média','Média','Alta','Alta','Muito Alta','Muito Alta'];
    const toleranceClassLabel = tolLabels10[toleranceClassBin - 1];

    const y_bin = getBin10(toleranceNorm);
    const x_bin = getBin10(competenceNorm);

    const finalProfileKey = getProfileForCell(x_bin, y_bin);
    const finalProfile = profileDescriptions[finalProfileKey];
    
    const knowledgeCheck = {
      juros: literacyData['q1'] === literacyAnswers['q1'],
      inflacao: literacyData['q2'] === literacyAnswers['q2'],
      diversificacao: literacyData['q3'] === literacyAnswers['q3'],
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
      knowledgeCheck
    };
  }, [investorData.score, literacyData, isfbResult.index0to100]);
  
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
    knowledgeCheck 
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
        <h1 className="text-3xl font-bold tracking-tight">Seu Perfil de Investidor</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full" aria-live="polite">
        {/* Profile Card */}
        <Card className={`${profileColors[finalProfileKey].cardBg} ${profileColors[finalProfileKey].cardBorder}`}>
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
                <CardTitle className="text-base">Tolerância ao Risco Financeiro</CardTitle>
                <CardDescription className="text-foreground/80">
                  <Badge className="mr-2">Índice: {toleranceRaw}/100</Badge>
                  <Badge>Classificação: {toleranceClassLabel}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sua tolerância ao risco foi classificada como {toleranceClassLabel.toLowerCase()}. Essa medida reflete o grau de conforto com volatilidade e perdas potenciais no curto prazo. Recomenda-se alinhar a alocação de ativos a esse nível para evitar decisões impulsivas em cenários de estresse.
                </p>
              </CardContent>
            </Card>
            
            {/* Financial Health */}
            {isfbResult && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">Saúde Financeira</CardTitle>
                  <CardDescription className="text-foreground/80">
                    <Badge className="mr-2">Índice: {isfbResult.index0to100}/100</Badge>
                    <Badge>{isfbResult.profile.title}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{isfbResult.profile.description}</p>
                  {isfbResult.profile.recommendation && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Sugestão:</h4>
                        <p className="text-sm text-muted-foreground">
                          <Recommendation text={isfbResult.profile.recommendation} />
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Financial Knowledge */}
            {Object.keys(literacyData).length > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-base">Conhecimento Financeiro</CardTitle>
                  <CardDescription className="text-foreground/80">
                    <Badge >Acertos: {correctAnswers} de {knowledgeQuestionsCount}</Badge>
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
                        <p className="font-semibold text-sm">Juros compostos</p>
                        <p className="text-xs text-muted-foreground italic">
                          "Capacidade de calcular crescimento de capital e diferenciar taxa nominal de efetiva."
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
                        <p className="font-semibold text-sm">Inflação</p>
                        <p className="text-xs text-muted-foreground italic">
                          "Entendimento do impacto no poder de compra e na taxa real de retorno."
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
                        <p className="font-semibold text-sm">Diversificação</p>
                        <p className="text-xs text-muted-foreground italic">
                          "Compreensão de correlação entre ativos e redução de risco não sistemático."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <p className="text-sm font-medium text-foreground/90">
                    Priorizar estudo dos tópicos marcados como incorretos antes de aumentar a exposição a risco.
                  </p>
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
              Nota: Estes resultados são uma ferramenta de autoconhecimento e não constituem uma recomendação de investimento.
            </p>
            <Button 
              onClick={onRestart} 
              className="w-full"
              size="lg"
              aria-label="Refazer Quiz"
            >
              Refazer Quiz
            </Button>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
};

export default ResultsScreen;