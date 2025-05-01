"use client"
import { useEffect, useMemo, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ScenariosService } from '../../../../services/scenariosService';
import MontanhaRussa from '@/components/rollercoaster/page';

export default function ResultadoFinal() {
    const [perfilData, setPerfilData] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [userId, setUserId] = useState<string | null>(null); // Estado para o userId

    const profileService = useMemo(() => new ScenariosService(), []);

    useEffect(() => {
        const storedUserId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userId="))
            ?.split("=")[1];

        // Função para simular o carregamento de dados
        const carregarDadosAleatorios = () => {
            setCarregando(true);

            // Simulando tempo de carregamento
            setTimeout(() => {
                profileService
                    .calcResult(storedUserId)
                    .then((response: { data: any }) => {
                        setPerfilData(response.data);
                    })
                    .catch((error: { message: string }) => {
                        console.log(error.message);
                    });
                //Seleciona um perfil aleatório
                // const tipos = Object.keys(dadosMockados);
                // const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];

                // // Atualiza timestamp para fingir dados reais
                // const dadoSelecionado = {
                //     ...dadosMockados[tipoAleatorio],
                //     timestamp: new Date().toISOString()
                // };

                // // Se o valor é exatamente 1, adicione um pequeno desvio aleatório em alguns casos
                // if (dadoSelecionado.valor === 1 && Math.random() > 0.7) {
                //     dadoSelecionado.valor = 1 + (Math.random() * 0.05 - 0.025);
                // }

                // setPerfilData(dadoSelecionado);
                setCarregando(false);
            }, 1500); // Simula carregamento por 1.5 segundos
        };

        // Carregar dados na inicialização
        carregarDadosAleatorios();
    }, []);

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
                    <MontanhaRussa perfilData={perfilData} />

                    <div className="mt-8 flex justify-center">
                        {/* <Button
                            onClick={() => {
                                setCarregando(true);
                                // Simulando tempo de carregamento
                                setTimeout(() => {
                                    // Seleciona um perfil aleatório
                                    const tipos = Object.keys(dadosMockados);
                                    const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];

                                    // Atualiza timestamp para fingir dados reais
                                    const dadoSelecionado = {
                                        ...dadosMockados[tipoAleatorio],
                                        timestamp: new Date().toISOString()
                                    };

                                    setPerfilData(dadoSelecionado);
                                    setCarregando(false);
                                }, 1500);
                            }}
                            className="px-6"
                        >
                            Gerar Nova Análise
                        </Button> */}
                    </div>
                </div>
            )}
        </div>
    );
}