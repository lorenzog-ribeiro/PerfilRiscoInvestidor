'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { InvestorData } from '@/services/types';
import { investorQuestions, scoreMap } from '@/src/lib/constants';
import { Button } from '../ui/button';

interface InvestorQuizProps {
    onComplete: (data: InvestorData) => void;
    totalQuestions: number;
    initialAnsweredCount: number;
}

interface RichQuestionOption {
    choice: string;
    label: string;
    best?: number;
    worst?: number;
    low?: number;
    medium?: number;
    high?: number;
}

const calculateScore = (responses: Record<string, string>) =>
    Object.entries(responses).reduce((total, [qid, choice]) =>
        total + ((scoreMap[qid]?.[choice]) || 0), 0);

const getRiskProfile = (score: number) => {
    if (score >= 33) return { title: "Alta tolerância ao risco", description: "Você demonstra uma disposição significativa para assumir riscos em busca de retornos mais elevados." };
    if (score >= 29) return { title: "Tolerância ao risco acima da média", description: "Você está disposto(a) a aceitar um nível de risco superior à média para alcançar seus objetivos financeiros." };
    if (score >= 23) return { title: "Tolerância ao risco média/moderada", description: "Seu perfil busca um equilíbrio entre segurança e crescimento." };
    if (score >= 19) return { title: "Tolerância ao risco abaixo da média", description: "Você prioriza a preservação do seu capital." };
    return { title: "Baixa tolerância ao risco", description: "Sua principal prioridade é a segurança e a preservação do capital." };
};

const ChartQ8 = ({ best, worst, maxVal }: { best: number; worst: number; maxVal: number }) => {
    const viewBoxHeight = 200;
    const midY = 100;

    if (worst === 0 && best > 0) {
        return (
            <svg viewBox={`0 0 100 ${viewBoxHeight}`} className="w-full h-full" aria-hidden="true">
                <line x1="10" y1={midY} x2="90" y2={midY} stroke="#9ca3af" strokeWidth="1.5" />
                <line x1="35" y1={midY} x2="65" y2={midY} stroke="#4CAF50" strokeWidth="6" />
                <text x="50" y={midY - 15} textAnchor="middle" fontSize="16" fill="#166534" fontWeight="bold">
                    {`R$ ${best.toLocaleString('pt-BR')}`}
                </text>
            </svg>
        );
    }

    const chartHeight = 70;
    const scale = maxVal > 0 ? chartHeight / maxVal : 0;
    const bestHeight = best * scale;
    const worstHeight = Math.abs(worst) * scale;

    return (
        <svg viewBox={`0 0 100 ${viewBoxHeight}`} className="w-full h-full" aria-hidden="true">
            <line x1="10" y1={midY} x2="90" y2={midY} stroke="#9ca3af" strokeWidth="1.5" />
            {best > 0 && <rect x="30" y={midY - bestHeight} width="40" height={bestHeight} fill="#4CAF50" />}
            {worst < 0 && <rect x="30" y={midY} width="40" height={worstHeight} fill="#F44336" />}
            {best > 0 && (
                <text x="50" y={midY - bestHeight - 8} textAnchor="middle" fontSize="16" fill="#166534" fontWeight="bold">
                    {`R$ ${best.toLocaleString('pt-BR')}`}
                </text>
            )}
            {worst < 0 && (
                <text x="50" y={midY + worstHeight + 20} textAnchor="middle" fontSize="16" fill="#c62828" fontWeight="bold">
                    {`R$ ${Math.abs(worst).toLocaleString('pt-BR')}`}
                </text>
            )}
        </svg>
    );
};

const ChartQ12 = ({ low, medium, high }: { low: number; medium: number; high: number }) => (
    <div className="w-full mt-4 flex flex-col">
        <div className="w-full h-5 flex overflow-hidden rounded">
            {low > 0 && (
                <div style={{ width: `${low}%` }} className="bg-green-500 flex items-center justify-center text-black font-semibold text-xs">
                    {`${low}%`}
                </div>
            )}
            {medium > 0 && (
                <div style={{ width: `${medium}%` }} className="bg-yellow-400 flex items-center justify-center text-black font-semibold text-xs">
                    {`${medium}%`}
                </div>
            )}
            {high > 0 && (
                <div style={{ width: `${high}%` }} className="bg-red-500 flex items-center justify-center text-black font-semibold text-xs">
                    {`${high}%`}
                </div>
            )}
        </div>
        <div className="w-full text-xs sm:text-sm space-x-4 flex justify-center mt-3">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2" /><span>Baixo Risco</span></div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" /><span>Médio Risco</span></div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2" /><span>Alto Risco</span></div>
        </div>
    </div>
);

export default function InvestorQuiz({ onComplete, totalQuestions, initialAnsweredCount }: InvestorQuizProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [showHint, setShowHint] = useState(false);
    const radioGroupRef = useRef<HTMLDivElement>(null);

    const currentQuestion = investorQuestions[currentStep];
    const currentResponse = currentQuestion ? responses[currentQuestion.id] : undefined;
    const progress = ((initialAnsweredCount + currentStep + 1) / totalQuestions) * 100;

    useEffect(() => {
        if (currentStep < 3 && !currentResponse) {
            setShowHint(true);
            const timer = setTimeout(() => setShowHint(false), 1800);
            return () => clearTimeout(timer);
        }
    }, [currentStep, currentResponse]);

    const maxValQ8 = useMemo(() => {
        if (currentQuestion.id === 'risk_pref_q8') {
            const validOptions = (currentQuestion.options as RichQuestionOption[]).filter(
                o => typeof o.best === 'number' && typeof o.worst === 'number'
            );
            return Math.max(...validOptions.flatMap(d => [d.best!, Math.abs(d.worst!)]));
        }
        return 0;
    }, [currentQuestion]);

    const handleNext = () => {
        if (currentStep < investorQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            const score = calculateScore(responses);
            const profile = getRiskProfile(score);
            onComplete({ responses, score, profile });
        }
    };

    return (
        <div className="w-full flex flex-col h-full bg-white relative">
            <header className="p-4 border-b bg-white">
                <h2 className="text-base font-bold text-center text-gray-800">Questionário</h2>
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            <div className="p-4 sm:p-6 pb-28 flex-grow overflow-y-auto">
                <p className="text-base font-semibold text-gray-800 mb-6">{currentQuestion.text}</p>
                <div
                    ref={radioGroupRef}
                    className={currentQuestion.id === 'risk_pref_q8' ? 'grid grid-cols-2 gap-3' : 'flex flex-col space-y-3'}
                >
                    {(currentQuestion.options as RichQuestionOption[]).map((option) => {
                        const isSelected = currentResponse === option.choice;

                        if (currentQuestion.id === 'risk_pref_q8') {
                            return (
                                <button
                                    key={option.choice}
                                    onClick={() => setResponses(prev => ({ ...prev, [currentQuestion.id]: option.choice }))}
                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between h-full min-h-[200px] sm:min-h-[240px]
                    ${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'}`}
                                >
                                    <span className="text-xs text-gray-600 text-left leading-tight">{option.label}</span>
                                    <div className="w-full h-40 sm:h-48">
                                        {typeof option.best === 'number' && typeof option.worst === 'number' && (
                                            <ChartQ8 best={option.best} worst={option.worst} maxVal={maxValQ8} />
                                        )}
                                    </div>
                                </button>
                            );
                        }

                        return (
                            <button
                                key={option.choice}
                                onClick={() => setResponses(prev => ({ ...prev, [currentQuestion.id]: option.choice }))}
                                className={`p-3 rounded-xl border-2 text-left transition-all
                  ${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'}`}
                            >
                                <span className="text-sm text-gray-700">{option.label}</span>
                                {currentQuestion.id === 'risk_pref_q12' &&
                                    typeof option.low === 'number' &&
                                    typeof option.medium === 'number' &&
                                    typeof option.high === 'number' && (
                                        <ChartQ12 low={option.low} medium={option.medium} high={option.high} />
                                    )}
                            </button>
                        );
                    })}
                </div>

                {currentResponse && (
                    <div className='flex justify-end'>
                        <Button
                            onClick={handleNext}
                            className="self-end mt-6 bg-blue-600 hover:bg-blue-700 "
                        >
                            Próxima
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}