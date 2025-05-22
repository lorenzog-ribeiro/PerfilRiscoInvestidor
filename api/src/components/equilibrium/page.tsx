import React, { useState } from "react";
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
        perda: number;
        ganho: number;
        curta: string;
    };
}

const TesteA: React.FC<{ perfilData: PerfilData }> = ({ perfilData }) => {
    const valor = 2;
    const valorResult = (valor * 1000).toFixed(0);

    let rotacao = 0;

    if (valor > 1.5) {
        rotacao = 15;
    } else if (valor > 1) {
        rotacao = 10;
    } else if (valor < 1) {
        rotacao = -10;
    }


    const removeCookies = () => {
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    };

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
                    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">

                        {/* Triângulo base (apoio) */}
                        <polygon points="160,200 240,200 200,120" fill="#475569" />

                        {/* Grupo girando com rotação */}
                        <g transform={`rotate(${rotacao}, 200, 180)`}>
                            {/* Barra da gangorra */}
                            <line x1="50" y1="125" x2="350" y2="120" stroke="#475569" strokeWidth="3" />

                            {/* Lado esquerdo - perder */}
                            <text x="120" y="80" fill="#000" textAnchor="middle" fontSize="12">
                                <tspan x="120" dy="0">Você</tspan>
                                <tspan x="120" dy="1.2em">aceitaria</tspan>
                                <tspan x="120" dy="1.2em">perder</tspan>
                            </text>
                            <circle cx="120" cy="165" r="5" fill="#ef4444" />
                            <line x1="120" y1="165" x2="120" y2="125" stroke="#ef4444" strokeWidth="2" />
                            <text x="120" y="185" fill="red" textAnchor="middle" fontSize="12">
                                R$ 1000
                            </text>

                            {/* Lado direito - ganhar */}
                            <text x="280" y="80" fill="#000" textAnchor="middle" fontSize="12">
                                <tspan x="280" dy="0">Se tivesse</tspan>
                                <tspan x="280" dy="1.2em">chance de</tspan>
                                <tspan x="280" dy="1.2em">ganhar</tspan>
                            </text>
                            <circle cx="280" cy="165" r="5" fill="#22c55e" />
                            <line x1="280" y1="165" x2="280" y2="122" stroke="#22c55e" strokeWidth="2" />
                            <text x="280" y="180" fill="green" textAnchor="middle" fontSize="12">
                                R$ {valorResult}
                            </text>
                        </g>
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
                            <h4 className="text-sm font-medium">Descrição curta</h4>
                            <p>{perfilData.profile.curta}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Descrição completa</h4>
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
        </Card>
    );
};

export default TesteA;
