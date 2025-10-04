'use client';

import { useState, useMemo } from 'react';
import { DospertData } from '@/services/types';
import { dospertQuestions, dospertScale } from '@/src/lib/constants';
import { Button } from '../ui/button';

interface RiskTakingQuizProps {
    onComplete: (data: DospertData) => void;
    totalQuestions: number;
    initialAnsweredCount: number;
}

export default function RiskTakingQuiz({ onComplete, totalQuestions, initialAnsweredCount }: RiskTakingQuizProps) {
    const [responses, setResponses] = useState<DospertData>({});

    const answeredCount = Object.keys(responses).length;
    const progress = useMemo(() =>
        ((initialAnsweredCount + answeredCount) / totalQuestions) * 100,
        [initialAnsweredCount, answeredCount, totalQuestions]
    );

    const allAnswered = answeredCount === dospertQuestions.length;

    return (
        <div className="flex flex-col bg-white relative">
            <header className="p-4 border-b">
                <h2 className="text-base font-bold text-center text-gray-800">Propensão a Assumir Riscos</h2>
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            <div className="flex-grow p-4 sm:p-6 pb-28 bg-gray-50">
                {dospertQuestions.map(question => {
                    const currentResponse = responses[question.id.toString()];
                    return (
                        <div key={question.id} className="bg-white p-4 sm:p-6 mb-4 border rounded-lg shadow-sm">
                            <fieldset>
                                <legend className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{question.text}</legend>
                                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                                    Indique a probabilidade de sua ação, onde <strong>1</strong> é &quot;Extremamente improvável&quot; e <strong>7</strong> é &quot;Extremamente provável&quot;.
                                </p>

                                <div className="flex justify-between items-center">
                                    {Array.from({ length: 7 }, (_, i) => i + 1).map(value => {
                                        const isSelected = currentResponse === value;
                                        return (
                                            <div key={value} className="flex flex-col items-center">
                                                <label className="cursor-pointer group relative">
                                                    <input
                                                        type="radio"
                                                        name={`dospert-${question.id}`}
                                                        value={value}
                                                        className="sr-only"
                                                        checked={isSelected}
                                                        onChange={() => setResponses(prev => ({ ...prev, [question.id.toString()]: value }))}
                                                    />
                                                    <span className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-colors
                            ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                                        {value}
                                                    </span>
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {dospertScale.labels[value]}
                                                    </div>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </fieldset>
                        </div>
                    );
                })}

                {allAnswered && (
                    <div className='flex justify-end'>
                        <Button
                            onClick={() => onComplete(responses)}
                            className="self-end bg-green-600 hover:bg-green-700"
                        >
                            Finalizar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}