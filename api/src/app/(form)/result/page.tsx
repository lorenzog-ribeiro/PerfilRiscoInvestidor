"use client"
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScenariosService } from '../../../../services/scenariosService';
import MontanhaRussa from '@/components/rollercoaster/page';
import TesteA from '@/components/equilibrium/page';

export default function ResultadoFinal() {
    const [perfilData, setPerfilData] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [storedUserId, setStoredUserId] = useState<string | undefined>(undefined);
    const [storedUserAttempt, setStoredUserAttempt] = useState<string | undefined>(undefined);

    const profileService = useMemo(() => new ScenariosService(), []);

    useEffect(() => {
        const userId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userId="))
            ?.split("=")[1];
        const userAttempt = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userAttempt="))
            ?.split("=")[1];
        setStoredUserId(userId);
        setStoredUserAttempt(userAttempt);

        // Função para simular o carregamento de dados
        const carregarDadosAleatorios = () => {
            setCarregando(true);

            // Simulando tempo de carregamento
            setTimeout(() => {
                profileService
                    .calcResult(storedUserId, userAttempt)
                    .then((response: { data: SetStateAction<null> }) => {
                        setPerfilData(response.data);
                    })
                    .catch((error: { message: string }) => {
                        console.log(error.message);
                    });
                setCarregando(false);
            }, 1500); // Simula carregamento por 1.5 segundos
        };

        // Carregar dados na inicialização
        carregarDadosAleatorios();
    }, [profileService]);

    return (
        <div className="container mx-auto px-4 py-8">
            {carregando && (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Carregando análise</CardTitle>
                        <CardDescription>Aguarde enquanto processamos os resultados...</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-64 w-full rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-3/5" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {!carregando && perfilData && (
                <div className="max-w-4xl mx-auto">
                    <TesteA perfilData={perfilData} />
                </div>
            )}
        </div>
    );
}