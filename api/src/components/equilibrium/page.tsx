import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import Link from "next/link";

interface PerfilData {
    profile: {
        valor: number;
        usuario: {
            nome: string;
        };
        perfil: string;
        descricao: string;
        perda: number;    // Percentual de perda
        ganho: number;    // Percentual de ganho
        curta: string;    // Curta descrição do perfil
    };
}


const TesteA: React.FC<{ perfilData: PerfilData }> = ({ perfilData }) => {
    const [valor, setValor] = useState<number>(perfilData.profile.valor); // Valor aleatório entre 0 e 2
    const [posicao, setPosicao] = useState<{ cx: number; cy: number }>({ cx: 200, cy: 125 });
    const [linhaFinal, setLinhaFinal] = useState<{ x: number; y: number }>({ x: 220, y: 160 });
    let valorResult = (perfilData.profile.valor * 1000).toFixed(0);
    // Ajusta a rotação com base no valor
    // Se valor > 1, inclina para o lado verde (positivo); se < 1, para o lado vermelho (negativo).
    const rotacao = valor < 1
        ? Math.max((1 - valor) * -15, -20)
        : Math.min((valor - 1) * 15, 20);

    function removeCookies() {
        const cookies = document.cookie.split(";");

        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Análise de Perfil</CardTitle>
                        <CardDescription>Resultado para: {perfilData.profile.usuario.nome}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                <div className="flex justify-center">
                    {/* SVG da Gangorra */}

                    <svg
                        viewBox="0 0 400 250"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ transition: "transform 0.5s ease", transform: `rotate(${rotacao}deg)` }}
                    >

                        {/* Linha de equilíbrio (linha horizontal) */}
                        <line x1="50" y1="180" x2="350" y2="180" stroke="#94a3b8" stroke-width="2" />

                        {/* Bolinha vermelha (lado negativo) */}
                        <text x="120" y="130" fill="#000" textAnchor="middle" fontSize="12">
                            <tspan x="120" dy="0">Você</tspan>
                            <tspan x="120" dy="1.2em">aceitaria</tspan>
                            <tspan x="120" dy="1.2em">perder</tspan>
                        </text>
                        <circle cx="120" cy="230" r="5" fill="#ef4444" />
                        <line x1="120" y1="230" x2="120" y2="180" stroke="#ef4444" stroke-width="2" />
                        <text x="120" y="245" fill="red" textAnchor="middle" fontSize="12">
                            <tspan x="120" dy="0">R$ 1000</tspan>
                        </text>

                        {/* Bolinha cinza (ponto de equilíbrio) */}
                        <circle cx="200" cy="180" r="5" fill="#94a3b8" />
                        <line x1="200" y1="0" x2="200" y2="180" stroke="#94a3b8" stroke-width="2" />

                        {/* Bolinha verde (lado positivo) */}
                        <text x="280" y="130" fill="#000" textAnchor="middle" fontSize="12">
                            <tspan x="280" dy="0">Se tivesse</tspan>
                            <tspan x="280" dy="1.2em">chance de</tspan>
                            <tspan x="280" dy="1.2em">ganhar</tspan>
                        </text>
                        <circle cx="280" cy="230" r="5" fill="#22c55e" />
                        <line x1="280" y1="230" x2="280" y2="180" stroke="#22c55e" stroke-width="2" />
                        <text x="280" y="245" fill="green" textAnchor="middle" fontSize="12">
                            <tspan x="280" dy="0">R$ {valorResult}</tspan>
                        </text>
                    </svg>
                </div>

                <Tabs defaultValue="resumo" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="resumo">Resumo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="resumo" className="space-y-4 pt-4">
                        <div>
                            <h4 className="text-sm font-medium">Perfil</h4>
                            <p>{perfilData.profile.perfil}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Descrição</h4>
                            <p>{perfilData.profile.curta}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Descrição</h4>
                            <p>{perfilData.profile.descricao}</p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-center pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={removeCookies}>
                        <Link href="/">Refazer a Análise</Link>
                    </Button>
                </div>
            </CardContent>
        </Card >
    );
};

export default TesteA;
