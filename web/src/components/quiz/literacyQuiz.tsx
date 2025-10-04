'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LiteracyData } from '@/services/types';
import { literacyQuestions, literacyScale } from '@/src/lib/constants';
import { Button } from '../ui/button';

interface LiteracyQuizProps {
    onComplete: (data: LiteracyData) => void;
    totalQuestions: number;
    initialAnsweredCount: number;
}

export default function LiteracyQuiz({ onComplete, totalQuestions, initialAnsweredCount }: LiteracyQuizProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<LiteracyData>({});

    const currentQuestion = literacyQuestions[currentStep];
    const currentResponse = responses[currentQuestion.id];
    const progress = ((initialAnsweredCount + currentStep + 1) / totalQuestions) * 100;

    const handleNext = () => {
        if (currentStep < literacyQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(responses);
        }
    };

    const isLikert = currentQuestion.type === 'likert-5';

    return (
        <div className="w-full flex flex-col h-full bg-white relative">
            <header className="p-4 border-b">
                <h2 className="text-base font-bold text-center text-gray-800">Litenracy</h2>
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4 sm:p-6 pb-28">
                {isLikert ? (
                    <fieldset>
                        <legend className="text-base font-semibold text-gray-800 mb-4">{currentQuestion.text}</legend>
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-center items-center flex-col sm:flex-row gap-4">
                                <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">Nenhum conhecimento</span>
                                <div className="flex items-center space-x-2">
                                    {currentQuestion.options.map(value => {
                                        const isSelected = currentResponse === value;
                                        const ratingValue = parseInt(value, 10);
                                        return (
                                            <label key={value} className="cursor-pointer group relative">
                                                <input
                                                    type="radio"
                                                    name={currentQuestion.id}
                                                    value={value}
                                                    className="sr-only"
                                                    checked={isSelected}
                                                    onChange={() => setResponses(prev => ({ ...prev, [currentQuestion.id]: value }))}
                                                />
                                                <span className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors
                          ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                                    {value}
                                                </span>
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    {literacyScale.labels[ratingValue as keyof typeof literacyScale.labels]}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">Conhecimento avançado</span>
                            </div>
                        </div>
                    </fieldset>
                ) : (
                    <>
                        <p className="text-base font-semibold text-gray-800 mb-4">{currentQuestion.text}</p>
                        <div className="flex flex-col space-y-3">
                            {currentQuestion.options.map(option => {
                                const isSelected = currentResponse === option;
                                return (
                                    <button
                                        key={option}
                                        onClick={() => setResponses(prev => ({ ...prev, [currentQuestion.id]: option }))}
                                        className={`p-3 rounded-xl border-2 text-left transition-all
                      ${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'}`}
                                    >
                                        <span className="text-sm text-gray-700">{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {currentResponse && (
                    <div className='flex justify-end'>
                        <Button
                            onClick={handleNext}
                            className="self-end bg-blue-600 hover:bg-blue-700"
                        >
                            Próxima
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}