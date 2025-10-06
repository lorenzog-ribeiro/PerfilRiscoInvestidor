'use client';

import { useState, useEffect } from 'react';
import { isfbPart1Questions, ISFBQuestion, likert5Scale, ISFBData } from '@/src/lib/isfb';
import { Button } from '../ui/button';

interface ISFBQuizProps {
    onComplete: (data: ISFBData) => void;
    totalQuestions: number;
    initialAnsweredCount: number;
}

const QuizCard: React.FC<{ 
    question: ISFBQuestion; 
    response: string | undefined; 
    onSelect: (id: string, value: string) => void;
}> = ({ question, response, onSelect }) => {
    const { id, text, type, options = [] } = question;

    if (type === 'likert5') {
        return (
            <div>
                <fieldset>
                    <legend id={`${id}-legend`} className="text-base font-semibold text-gray-800 mb-6">
                        {text}
                    </legend>
                    <div role="radiogroup" aria-labelledby={`${id}-legend`} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-center items-center">
                            <span className="text-sm text-gray-600 font-medium mr-2 sm:mr-4 text-center min-w-[60px]">
                                Nada
                            </span>
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                {likert5Scale.map(item => {
                                    const isSelected = response === item.choice;
                                    return (
                                        <label key={item.value} className="cursor-pointer group relative">
                                            <input 
                                                type="radio" 
                                                name={id} 
                                                value={item.choice} 
                                                className="sr-only peer" 
                                                checked={isSelected} 
                                                onChange={() => onSelect(id, item.choice)} 
                                            />
                                            <span className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-semibold transition-colors
                                                ${isSelected 
                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }
                                                peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-blue-500
                                            `}>
                                                {item.value}
                                            </span>
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {item.label}
                                                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                                                </svg>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                            <span className="text-sm text-gray-600 font-medium ml-2 sm:ml-4 text-center min-w-[80px]">
                                Totalmente
                            </span>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }

    return (
        <div>
            <p className="text-base font-semibold text-gray-800 mb-4">{text}</p>
            <div className="flex flex-col space-y-3">
                {options.map(({choice, label}) => {
                    const isSelected = response === choice;
                    return (
                        <button
                            key={choice}
                            onClick={() => onSelect(id, choice)}
                            className={`p-4 rounded-xl border-2 text-left transition-all
                                ${isSelected 
                                    ? 'bg-blue-50 border-blue-500 shadow-md' 
                                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-sm text-gray-700 font-medium">{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const ISFBQuiz: React.FC<ISFBQuizProps> = ({ onComplete, totalQuestions, initialAnsweredCount }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<ISFBData>({});
    const [showHint, setShowHint] = useState(false);
    
    const currentQuestion = isfbPart1Questions[currentStep];
    const currentResponse = currentQuestion ? responses[currentQuestion.id] : undefined;

    const currentQuestionNumber = initialAnsweredCount + currentStep + 1;
    const progress = (currentQuestionNumber / totalQuestions) * 100;

    useEffect(() => {
        const isFirstThreeQuestions = currentStep < 3;
        
        if (currentResponse) {
            setShowHint(false);
            return;
        }

        if (isFirstThreeQuestions) {
            setShowHint(true);
            const timer = setTimeout(() => setShowHint(false), 1800);
            return () => clearTimeout(timer);
        }
    }, [currentStep, currentResponse]);

    const handleSelect = (id: string, value: string) => {
        setResponses(prev => ({ ...prev, [id]: value }));
    };

    const handleNext = () => {
        if (currentStep < isfbPart1Questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(responses);
        }
    };
    
    return (
        <div className="w-full flex flex-col h-full bg-white relative">
            <header className="p-4 border-b bg-white">
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </header>
            
            <div className="p-4 sm:p-6 pb-28 flex-grow overflow-y-auto">
                {currentQuestion && (
                    <QuizCard
                        question={currentQuestion}
                        response={currentResponse}
                        onSelect={handleSelect}
                    />
                )}
            </div>
            
            {currentResponse && (
                <div className='flex justify-end p-4 border-t bg-white'>
                    <Button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="lg"
                    >
                        {currentStep === isfbPart1Questions.length - 1 ? 'Continuar' : 'Próxima'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ISFBQuiz;
