import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';

// Componente principal da Montanha Russa
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
    // Estado para controlar a posição do carrinho (0-1)
    const [posicao, setPosicao] = useState(0.5);
    // Referência para o objeto de animação
    const animacaoRef = useRef<number | null>(null);
    // Estado para armazenar o valor alvo
    const [valorAlvo, setValorAlvo] = useState(1);
    // Estado para controlar se a animação está em execução
    const [animando, setAnimando] = useState(false);
    // Estado para armazenar as posições anteriores para criar um rastro
    const [posicoes, setPosicoes] = useState<number[]>([]);

    // Função para converter o valor do perfil (0-2) para posição na curva (0-1)
    const valorParaPosicao = (valor: number) => {
        // Garantir que o valor é um número e está dentro do intervalo esperado
        const safeValor = Number(valor);

        if (isNaN(safeValor)) {
            console.error('Valor inválido fornecido:', valor);
            return 0.5; // Posição padrão no meio
        }

        // Valores menores que 1 mapeados para 0-0.5
        if (safeValor < 1) {
            return Math.max(safeValor * 0.5, 0.05);
        }
        // Valor exatamente 1 mapeado para 0.5
        else if (safeValor === 1) {
            return 0.5;
        }
        // Valores maiores que 1 mapeados para 0.5-1
        else {
            return 0.5 + Math.min((safeValor - 1) * 0.5, 0.45);
        }
    };
    // Iniciar a animação baseada no valor
    const iniciarAnimacao = useCallback((valor: number) => {
        // Cancelar qualquer animação existente
        if (animacaoRef.current) {
            cancelAnimationFrame(animacaoRef.current);
        }

        setAnimando(true);

        // Converter o valor para uma posição na curva
        const posicaoAlvo = valorParaPosicao(valor);

        // Iniciar a animação com a posição atual e a posição alvo
        const tempoInicial = performance.now();
        const duracaoAnimacao = 2000; // 2 segundos

        animarCarrinho(tempoInicial, duracaoAnimacao, posicao, posicaoAlvo);
    }, [posicao]);

    // Efeito para iniciar a animação quando os dados mudarem
    useEffect(() => {
        if (perfilData) {
            const novoValorAlvo = perfilData.profile.valor;

            if (typeof novoValorAlvo === 'number') {
                setValorAlvo(novoValorAlvo);
                iniciarAnimacao(novoValorAlvo);
            }
        }
    }, [perfilData, iniciarAnimacao]);

    // Monitorar mudanças de estado para depuração
    useEffect(() => {
        console.log('Estado da animação:', {
            posicao,
            valorAlvo,
            animando
        });
    }, [posicao, valorAlvo, animando]);

    // Efeito para limpar a animação quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (animacaoRef.current) {
                cancelAnimationFrame(animacaoRef.current);
                animacaoRef.current = null;
            }
        };
    }, []);

    // Efeito para gerenciar o rastro do carrinho
    const MAX_TRACE_LENGTH = 10;
    useEffect(() => {
        if (animando) {
            setPosicoes(prev => {
                const newPositions = [...prev, posicao];
                return newPositions.slice(-MAX_TRACE_LENGTH);
            });
        }
    }, [posicao, animando]);

    // Função que realiza a animação do carrinho
    const animarCarrinho = (tempoInicial: number, duracaoAnimacao: number, posicaoInicial: number, posicaoAlvo: number) => {
        console.log('Iniciando animação:', {
            posicaoInicial,
            posicaoAlvo,
            duracaoAnimacao
        });

        // Função para calcular a posição atual baseada no tempo
        const calcularPosicao = (agora: number) => {
            const tempoPassado = agora - tempoInicial;
            // Garantir cálculo preciso do progresso
            const progresso = Math.min(tempoPassado / duracaoAnimacao, 1);

            // Função de easing para um movimento mais realista
            const easeInOutCubic = (t: number) =>
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const progressoComEasing = easeInOutCubic(progresso);

            // Calculamos a nova posição exatamente na curva
            const novaPosicao = posicaoInicial + (posicaoAlvo - posicaoInicial) * progressoComEasing;

            console.log(`Progresso da animação: ${progresso.toFixed(2)}, Nova Posição: ${novaPosicao.toFixed(2)}`);

            return novaPosicao;
        };

        // Função que executa cada quadro da animação
        const animar = (agora: number) => {
            // Calcular nova posição
            const novaPosicao = calcularPosicao(agora);
            setPosicao(novaPosicao);

            // Verificar se a animação está próxima do fim
            const estaProximoDoFim = Math.abs(novaPosicao - posicaoAlvo) < 0.01;

            // Continuar a animação se não chegamos ao fim
            if (!estaProximoDoFim) {
                animacaoRef.current = requestAnimationFrame(animar);
            } else {
                // Finalizar animação
                setPosicao(posicaoAlvo);
                setAnimando(false);
                console.log('Animação concluída');
            }
        };

        // Iniciar o loop de animação
        animacaoRef.current = requestAnimationFrame(animar);
    };

    // Funções para obter cores e variantes
    const getValorColor = (valor: number) => {
        if (valor < 1) return "text-amber-500";
        if (valor === 1) return "text-green-500";
        return "text-blue-500";
    };

    // const getBadgeVariant = (valor: number) => {
    //     if (valor < 1) return "outline";
    //     if (valor === 1) return "secondary";
    //     return "default";
    // };

    // Se não tiver dados, não renderiza nada
    if (!perfilData) return null;

    // Calcular posições para o rastro do carrinho

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Análise de Perfil</CardTitle>
                        <CardDescription>Resultado para: {perfilData.profile.usuario.nome} </CardDescription>

                        {/* {perfilData.nome} */}
                    </div>
                    {/* <Badge
                        variant={getBadgeVariant(perfilData.valor)}
                        className="text-md py-1 px-3"
                    >
                        {perfilData.classificacao}
                    </Badge> */}
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                <div className="flex justify-center">
                    {/* SVG da Montanha Russa */}
                    <svg width="400" height="250" viewBox="0 0 400 250" className="mt-4">
                        {/* Céu de fundo */}
                        <rect x="0" y="0" width="400" height="250" fill="#f8fafc" rx="8" />

                        {/* Indicadores de valor no fundo */}
                        {/* <text x="80" y="220" textAnchor="middle" fill="#64748b" fontSize="12">Menor que 1</text>
                        <text x="200" y="220" textAnchor="middle" fill="#64748b" fontSize="12">Valor = 1</text>
                        <text x="320" y="220" textAnchor="middle" fill="#64748b" fontSize="12">Maior que 1</text> */}

                        {/* <svg width="400" height="250">
                            <line x1="-10" y1="250" x2="400" y2="0" stroke="black" stroke-width="6" />

                            <line x1="290" y1="270" x2="200" y2="120" stroke="black" stroke-width="3" />
                            <circle
                                fill="#94a3b8"
                                opacity={0.1 + 0.1}
                            />
                        </svg> */}
                        <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="400" height="250" fill="#f8fafc" rx="8" />

                            <line x1="50" y1="200" x2="350" y2="50" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,4" />

                            <circle cx="120" cy="165" r="5" fill="#ef4444" />

                            <line x1="120" y1="165" x2="140" y2="200" stroke="#ef4444" stroke-width="2" />

                            <text x="110" y="210" font-size="10" fill="#ef4444" font-weight="bold">-37.65%</text>

                            <circle cx="200" cy="125" r="5" fill="#94a3b8" />
                            <line x1="200" y1="125" x2="240" y2="200" stroke="#94a3b8" stroke-width="2" />

                            <circle cx="280" cy="85" r="5" fill="#22c55e" />
                            <line x1="280" y1="85" x2="305" y2="130" stroke="#22c55e" stroke-width="2" />

                            <text x="255" y="85" font-size="10" fill="#22c55e" font-weight="bold">+12.60%</text>

                            <text x="10" y="30" font-size="10" fill="#64748b">RETORNO</text>
                            <text x="370" y="230" font-size="10" fill="#64748b">RISCO</text>
                        </svg>


                        {/* Regra para definir a animação de pulso */}
                        <defs>
                            <style>
                                {`
                                @keyframes pulse {
                                    0% { transform: scale(1); }
                                    100% { transform: scale(1.05); }
                                }
                                `}
                            </style>
                        </defs>
                    </svg>
                </div>
                <Tabs defaultValue="resumo" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="resumo">Resumo</TabsTrigger>
                        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                        {/* <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="resumo" className="space-y-4 pt-4">
                        <div>
                            <h4 className="text-sm font-medium">Perfil</h4>
                            <p>{perfilData.profile.perfil}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium">Descricao</h4>
                            <p>{perfilData.profile.descricao}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="detalhes" className="space-y-4 pt-4">
                        <div key={1} className="space-y-1 mt-2">
                            <div className="flex justify-between">
                                <h4 className="text-sm font-medium">teste</h4>
                                <span className={getValorColor(1)}>{1}</span>
                            </div>
                            <Progress value={1 * 50} className="h-2" />
                        </div>

                        {/* {perfilData.detalhes.fatores.map((fator, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium">{fator.nome}</h4>
                                    <span className={getValorColor(fator.valor)}>{fator.valor.toFixed(1)}</span>
                                </div>
                                <Progress value={fator.valor * 50} className="h-2" />
                            </div>
                        ))} */}

                        {/* {perfilData.detalhes.subAnalises && (
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="text-md font-medium mb-3">Sub-Análises</h4>
                                {perfilData.detalhes.subAnalises.map((subAnalise, index) => (
                                    <div key={index} className="space-y-1 mt-2">
                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium">teste</h4>
                                            <span className={getValorColor(subAnalise.valor)}>{subAnalise.valor.toFixed(1)}</span>
                                        </div>
                                        <Progress value={subAnalise.valor * 50} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </TabsContent>

                    {/* <TabsContent value="recomendacoes" className="pt-4">
                        {perfilData.recomendacoes && perfilData.recomendacoes.length > 0 ? (
                            <ul className="space-y-2">
                                {perfilData.recomendacoes.map((recomendacao, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-2 mt-1 text-blue-500">•</span>
                                        <span>{recomendacao}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhuma recomendação disponível.</p>
                        )}
                    </TabsContent> */}
                </Tabs>
                <div className="flex justify-center pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        Refazer a analise
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Funções auxiliares posicaoNaCurva e calcularRotacao permanecem inalteradas
function posicaoNaCurva(t: number) {
    // Pontos de controle para a curva de Bezier cúbica
    // Estes valores devem corresponder ao path definido em trilhaPath
    const p0 = { x: 30, y: 150 };
    const p1 = { x: 70, y: 200 };
    const p2 = { x: 130, y: 100 };
    const p3 = { x: 190, y: 150 };
    const p4 = { x: 250, y: 200 };
    const p5 = { x: 310, y: 100 };
    const p6 = { x: 370, y: 150 };

    // Se t está na primeira metade da curva (0-0.5)
    if (t <= 0.5) {
        // Normalizar t para 0-1 na primeira curva
        const normalizedT = t * 2;

        // Curva de Bezier cúbica para a primeira metade
        const x = Math.pow(1 - normalizedT, 3) * p0.x +
            3 * Math.pow(1 - normalizedT, 2) * normalizedT * p1.x +
            3 * (1 - normalizedT) * Math.pow(normalizedT, 2) * p2.x +
            Math.pow(normalizedT, 3) * p3.x;

        // Complemento das funções auxiliares

        const y = Math.pow(1 - normalizedT, 3) * p0.y +
            3 * Math.pow(1 - normalizedT, 2) * normalizedT * p1.y +
            3 * (1 - normalizedT) * Math.pow(normalizedT, 2) * p2.y +
            Math.pow(normalizedT, 3) * p3.y;

        return { x, y };
    }
    else {
        // Normalizar t para 0-1 na segunda curva
        const normalizedT = (t - 0.5) * 2;

        // Curva de Bezier cúbica para a segunda metade
        const x = Math.pow(1 - normalizedT, 3) * p3.x +
            3 * Math.pow(1 - normalizedT, 2) * normalizedT * p4.x +
            3 * (1 - normalizedT) * Math.pow(normalizedT, 2) * p5.x +
            Math.pow(normalizedT, 3) * p6.x;

        const y = Math.pow(1 - normalizedT, 3) * p3.y +
            3 * Math.pow(1 - normalizedT, 2) * normalizedT * p4.y +
            3 * (1 - normalizedT) * Math.pow(normalizedT, 2) * p5.y +
            Math.pow(normalizedT, 3) * p6.y;

        return { x, y };
    }
}
// Calcula a rotação aproximada do carrinho baseado na tangente da curva
function calcularRotacao(t: number) {
    // Calculamos dois pontos próximos para estimar a tangente
    const delta = 0.01;
    const p1 = posicaoNaCurva(Math.max(0, t - delta));
    const p2 = posicaoNaCurva(Math.min(1, t + delta));

    // Calculamos o ângulo da tangente
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Convertemos para graus
    return Math.atan2(dy, dx) * 180 / Math.PI;
}

export default TesteA;