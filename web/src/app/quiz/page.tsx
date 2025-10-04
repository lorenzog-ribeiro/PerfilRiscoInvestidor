'use client';

import { InvestorData, LiteracyData, DospertData } from '@/services/types';
import InvestorQuiz from '@/src/components/quiz/investorQuiz';
import LiteracyQuiz from '@/src/components/quiz/literacyQuiz';
import RiskTakingQuiz from '@/src/components/quiz/riskTakingQuiz';
import { Card } from '@/src/components/ui/card';
import { investorQuestions, literacyQuestions, dospertQuestions } from '@/src/lib/constants';
import { useState } from 'react';

enum Screen {
    Investor,
    Literacy,
    RiskTaking,
    Results,
    Instructions
}

export default function QuizPage() {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Investor);
    const [investorData, setInvestorData] = useState<InvestorData | null>(null);
    const [literacyData, setLiteracyData] = useState<LiteracyData | null>(null);
    const [dospertData, setDospertData] = useState<DospertData | null>(null);

    const totalQuestions = investorQuestions.length + literacyQuestions.length + dospertQuestions.length;

    const handleInvestorComplete = (data: InvestorData) => {
        setInvestorData(data);
        setCurrentScreen(Screen.Literacy);
    };

    const handleLiteracyComplete = (data: LiteracyData) => {
        setLiteracyData(data);
        setCurrentScreen(Screen.RiskTaking);
    };

    const handleRiskTakingComplete = (data: DospertData) => {
        setDospertData(data);
        setCurrentScreen(Screen.Results);
    };

    const handleRestart = () => {
        setCurrentScreen(Screen.Instructions);
        setInvestorData(null);
        setLiteracyData(null);
        setDospertData(null);
    };

    return (
        <main className="min-h-screen max-w-4xl mx-auto shadow-lg flex flex-col justify-center p-3">
            {currentScreen === Screen.Investor && (
                <InvestorQuiz
                    onComplete={handleInvestorComplete}
                    totalQuestions={totalQuestions}
                    initialAnsweredCount={0}
                />
            )}

            {currentScreen === Screen.Literacy && (
                <LiteracyQuiz
                    onComplete={handleLiteracyComplete}
                    totalQuestions={totalQuestions}
                    initialAnsweredCount={investorQuestions.length}
                />
            )}

            {currentScreen === Screen.RiskTaking && (
                <RiskTakingQuiz
                    onComplete={handleRiskTakingComplete}
                    totalQuestions={totalQuestions}
                    initialAnsweredCount={investorQuestions.length + literacyQuestions.length}
                />
            )}
        </main>
    );
}