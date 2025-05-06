import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { useRouter } from 'next/router';


interface PerfilData {
    profile: {
        valor: number;
        usuario: {
            nome: string;
        };
        perfil: string;
        descricao: string;
    };
}

const TesteA: React.FC<{ perfilData: PerfilData }> = ({ perfilData }) => {
    const [valor, setValor] = useState<number>(perfilData.profile.valor); // Valor aleatório entre 0 e 2
    const [posicao, setPosicao] = useState<{ cx: number; cy: number }>({ cx: 200, cy: 125 });
    const [linhaFinal, setLinhaFinal] = useState<{ x: number; y: number }>({ x: 220, y: 160 });
    const router = useRouter();

    function removeCookies() {
        const cookies = document.cookie.split(";");
      
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
        router.push('/');
      }      

    useEffect(() => {
        // Função para calcular a posição da bolinha (roldana) ao longo da linha azul
        const calcularPosicaoBolinha = (valor: number) => {
            const P0 = { x: 50, y: 200 }; // Ponto inicial da linha azul (ESTAÇÃO A)
            const P1 = { x: 350, y: 50 }; // Ponto final da linha azul (ESTAÇÃO B)

            // Calculando a posição t (de 0 a 1) baseado no valor, que define onde a bolinha vai estar
            let t = Math.max(0, Math.min(1, (valor / 2))); // Normaliza o valor para estar entre 0 e 1

            // Interpolação linear para calcular a posição da bolinha
            const cx = P0.x + t * (P1.x - P0.x);
            const cy = P0.y + t * (P1.y - P0.y);

            return { cx, cy };
        };

        // Atualizando a posição da bolinha com base no valor
        const novaPosicao = calcularPosicaoBolinha(valor);
        setPosicao(novaPosicao);

        // Calculando o final da linha cinza (usando o mesmo ângulo das linhas vermelha e verde)
        // Delta x = 20, Delta y = 35 para manter o mesmo ângulo
        setLinhaFinal({
            x: novaPosicao.cx + 20,
            y: novaPosicao.cy + 35
        });
    }, [valor]);

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
                    {/* SVG da Montanha Russa */}
                    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="400" height="250" fill="#f8fafc" rx="8" />

                        {/* Linha azul fixa (linha de base) */}
                        <line x1="50" y1="200" x2="350" y2="50" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,4" />

                        {/* Bolinha vermelha (ESTAÇÃO A) */}
                        <circle cx="120" cy="165" r="5" fill="#ef4444" />
                        <line x1="120" y1="165" x2="140" y2="200" stroke="#ef4444" stroke-width="2" />
                        {/* <text x="120" y="230" font-size="10" fill="#ef4444" font-weight="bold" transform="rotate(-30 110 210)">-37.65%</text> */}

                        {/* Linha cinza (Com mesmo ângulo das linhas verde e vermelha) */}
                        <line
                            x1={posicao.cx}
                            y1={posicao.cy}
                            x2={linhaFinal.x}
                            y2={linhaFinal.y}
                            stroke="#94a3b8"
                            stroke-width="2"
                        />

                        {/* Bolinha cinza (Roldana do teleférico) */}
                        <circle
                            cx={posicao.cx}
                            cy={posicao.cy}
                            r="5"
                            fill="#94a3b8"
                        />


                        {/* Bolinha verde (ESTAÇÃO B) */}
                        <circle cx="280" cy="85" r="5" fill="#22c55e" />
                        <line x1="280" y1="85" x2="305" y2="130" stroke="#22c55e" stroke-width="2" />
                        {/* <text x="300" y="150" font-size="10" fill="#22c55e" font-weight="bold" transform="rotate(-30 250 130)">+12.60%</text> */}

                        {/* Rótulos */}
                        <text x="10" y="30" font-size="10" fill="#64748b">RETORNO</text>
                        <text x="360" y="230" font-size="10" fill="#64748b">RISCO</text>
                    </svg>
                </div>

                <Tabs defaultValue="resumo" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="resumo">Resumo</TabsTrigger>
                        {/* <TabsTrigger value="detalhes">Detalhes</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="resumo" className="space-y-4 pt-4">
                        <div>
                            <h4 className="text-sm font-medium">Perfil</h4>
                            <p>{perfilData.profile.perfil}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">Descrição</h4>
                            <p>{perfilData.profile.descricao}</p>
                        </div>
                    </TabsContent>

                    {/* <TabsContent value="detalhes" className="space-y-4 pt-4">
                        <div className="space-y-1 mt-2">
                            <div className="flex justify-between">
                                <h4 className="text-sm font-medium">Teste</h4>
                                <span>{valor.toFixed(2)}</span>
                            </div>
                            <Progress value={valor * 50} className="h-2" />
                        </div>
                    </TabsContent> */}
                </Tabs>

                <div className="flex justify-center pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={removeCookies}>
                        Refazer a Análise
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default TesteA;
