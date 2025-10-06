'use client';

import { useState } from 'react';
import { EconomyData } from '@/services/types';
import { economiesQuestions } from '@/src/lib/constants';
import { Button } from '../ui/button';

interface EconomyQuizProps {
    onComplete: (data: EconomyData) => void;
    totalQuestions: number;
    initialAnsweredCount: number;
}

export default function EconomyQuiz({ onComplete, totalQuestions, initialAnsweredCount }: EconomyQuizProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<string, string>>({});

    const currentQuestion = economiesQuestions[currentStep];
    const currentResponse = currentQuestion ? responses[currentQuestion.id] : undefined;
    const progress = ((initialAnsweredCount + currentStep + 1) / totalQuestions) * 100;

    const handleNext = () => {
        if (currentStep < economiesQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Convert responses to EconomyData format
            const economyData: EconomyData = {};
            Object.entries(responses).forEach(([questionId, choice]) => {
                // Store the choice index or a numeric representation
                economyData[questionId] = choice.charCodeAt(0) - 'a'.charCodeAt(0);
            });
            onComplete(economyData);
        }
    };

    return (
        <div className="w-full flex flex-col h-full bg-white relative">
            <header className="p-4 border-b bg-white">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Questionário Socioeconômico
                </h2>
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }} 
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">
                        Questão {currentStep + 1} de {economiesQuestions.length}
                    </p>
                </div>
            </header>

            <div className="p-4 sm:p-6 pb-28 flex-grow overflow-y-auto">
                <p className="text-base font-semibold text-gray-800 mb-6">
                    {currentQuestion.text}
                </p>
                
                <div className="flex flex-col space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = currentResponse === option.choice;
                        
                        return (
                            <button
                                key={option.choice}
                                onClick={() => setResponses(prev => ({ 
                                    ...prev, 
                                    [currentQuestion.id]: option.choice 
                                }))}
                                className={`p-4 rounded-xl border-2 text-left transition-all
                                    ${isSelected 
                                        ? 'bg-blue-50 border-blue-500 shadow-md' 
                                        : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-sm text-gray-700 font-medium">
                                    {option.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {currentResponse && (
                    <div className='flex justify-end pt-4'>
                        <Button
                            onClick={handleNext}
                            className="self-end mt-6 bg-blue-600 hover:bg-blue-700"
                        >
                            {currentStep < economiesQuestions.length - 1 ? 'Próxima' : 'Continuar'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
