'use client';

import { InvestorData, LiteracyData, DospertData, TradeOffData } from '@/services/types';
import InvestorQuiz from '@/src/components/quiz/investorQuiz';
import LiteracyQuiz from '@/src/components/quiz/literacyQuiz';
import RiskTakingQuiz from '@/src/components/quiz/riskTakingQuiz';
import { Card } from '@/src/components/ui/card';
import { investorQuestions, literacyQuestions, dospertQuestions } from '@/src/lib/constants';
import { useState, useEffect } from 'react';
import ResultPage from '../result/page';

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
    const [tradeOffData, setTradeOffData] = useState<TradeOffData | null>(null);

    const totalQuestions = investorQuestions.length + literacyQuestions.length + dospertQuestions.length;

    // Load tradeOff data from sessionStorage on component mount
    useEffect(() => {
        const storedTradeOffData = sessionStorage.getItem('tradeOffData');
        if (storedTradeOffData) {
            try {
                const parsedData = JSON.parse(storedTradeOffData) as TradeOffData;
                setTradeOffData(parsedData);
            } catch (error) {
                console.error('Error parsing tradeOff data from sessionStorage:', error);
            }
        }
    }, []);

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

    return (
        <main className="min-h-screen max-w-4xl mx-auto flex flex-col justify-center p-3">
            <Card className='w-full h-full'>
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

                {currentScreen === Screen.Results && investorData && literacyData && dospertData && (
                    <ResultPage
                        investorData={investorData}
                        literacyData={literacyData}
                        dospertData={dospertData}
                        tradeOffData={tradeOffData}
                    />
                )}
            </Card>
        </main>
    );
}