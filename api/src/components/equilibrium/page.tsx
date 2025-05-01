import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';

// Componente principal da Montanha Russa
const MontanhaRussa = ({ perfilData }) => {
    // Estado para controlar a posição do carrinho (0-1)
    const [posicao, setPosicao] = useState(0.5);
    // Referência para o objeto de animação
    const animacaoRef = useRef(null);
    // Estado para armazenar o valor alvo
    const [valorAlvo, setValorAlvo] = useState(1);
    // Estado para controlar se a animação está em execução
    const [animando, setAnimando] = useState(false);
    // Estado para armazenar as posições anteriores para criar um rastro
    const [posicoes, setPosicoes] = useState([]);

    // Função para converter o valor do perfil (0-2) para posição na curva (0-1)
    const valorParaPosicao = (valor) => {
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

    // Efeito para iniciar a animação quando os dados mudarem
    useEffect(() => {
        if (perfilData) {
            console.log('Dados do perfil recebidos:', perfilData);
            const novoValorAlvo = perfilData.profile.valor;
            console.log(perfilData.profile.valor)

            // Verificar se o valor é válido
            if (typeof novoValorAlvo === 'number') {
                setValorAlvo(novoValorAlvo);
                iniciarAnimacao(novoValorAlvo);
            } else {
                console.error('Valor inválido:', novoValorAlvo);
            }
        }
    }, [perfilData]);

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
    const animarCarrinho = (tempoInicial, duracaoAnimacao, posicaoInicial, posicaoAlvo) => {
        console.log('Iniciando animação:', {
            posicaoInicial,
            posicaoAlvo,
            duracaoAnimacao
        });

        // Função para calcular a posição atual baseada no tempo
        const calcularPosicao = (agora) => {
            const tempoPassado = agora - tempoInicial;
            // Garantir cálculo preciso do progresso
            const progresso = Math.min(tempoPassado / duracaoAnimacao, 1);

            // Função de easing para um movimento mais realista
            const easeInOutCubic = (t) =>
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const progressoComEasing = easeInOutCubic(progresso);

            // Calculamos a nova posição exatamente na curva
            const novaPosicao = posicaoInicial + (posicaoAlvo - posicaoInicial) * progressoComEasing;

            console.log(`Progresso da animação: ${progresso.toFixed(2)}, Nova Posição: ${novaPosicao.toFixed(2)}`);

            return novaPosicao;
        };

        // Função que executa cada quadro da animação
        const animar = (agora) => {
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

    // Iniciar a animação baseada no valor
    const iniciarAnimacao = (valor) => {
        console.log('Iniciando animação com Valor:', valor);

        // Cancelar qualquer animação existente
        if (animacaoRef.current) {
            cancelAnimationFrame(animacaoRef.current);
        }

        setAnimando(true);

        // Converter o valor para uma posição na curva
        const posicaoAlvo = valorParaPosicao(valor);
        console.log('Posição Alvo:', posicaoAlvo);

        // Iniciar a animação com a posição atual e a posição alvo
        const tempoInicial = performance.now();
        const duracaoAnimacao = 2000; // 2 segundos

        animarCarrinho(tempoInicial, duracaoAnimacao, posicao, posicaoAlvo);
    };

    // Funções para obter cores e variantes
    const getValorColor = (valor) => {
        if (valor < 1) return "text-amber-500";
        if (valor === 1) return "text-green-500";
        return "text-blue-500";
    };

    const getBadgeVariant = (valor) => {
        if (valor < 1) return "outline";
        if (valor === 1) return "secondary";
        return "default";
    };

    // Se não tiver dados, não renderiza nada
    if (!perfilData) return null;

    // SVG Path para a trilha da montanha russa
    const trilhaPath = "M30,150 C70,200 130,100 190,150 C250,200 310,100 370,150";

    const carrinhoPosition = posicaoNaCurva(posicao);
    const carrinhoRotation = calcularRotacao(posicao);

    // Calculamos as posições das rodas com um pequeno deslocamento
    const deltaT = 0.015; // Um pequeno delta T para posicionar as rodas na trilha
    const rodaEsquerdaPos = posicaoNaCurva(Math.max(0, posicao - deltaT));
    const rodaDireitaPos = posicaoNaCurva(Math.min(1, posicao + deltaT));

    // Calcular posições para o rastro do carrinho
    const rastroPositions = posicoes.map(pos => posicaoNaCurva(pos));

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Análise de Perfil</CardTitle>
                        <CardDescription>Resultado para: </CardDescription>

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
                        <text x="80" y="220" textAnchor="middle" fill="#64748b" fontSize="12">Menor que 1</text>
                        <text x="200" y="220" textAnchor="middle" fill="#64748b" fontSize="12">Valor = 1</text>
                        <text x="320" y="220" textAnchor="middle" fill="#64748b" fontSize="12">Maior que 1</text>

                        {/* Suportes da montanha russa */}
                        <line x1="80" y1="163" x2="80" y2="210" stroke="#1e293b" strokeWidth="6" />
                        <line x1="200" y1="160" x2="200" y2="210" stroke="#1e293b" strokeWidth="6" />
                        <line x1="320" y1="140" x2="320" y2="210" stroke="#1e293b" strokeWidth="6" />

                        {/* Rastro do carrinho (efeito de movimento) */}
                        {rastroPositions.map((pos, index) => (
                            <circle
                                key={index}
                                cx={pos.x}
                                cy={pos.y}
                                r={2 + index * 0.5}
                                fill="#94a3b8"
                                opacity={0.1 + index * 0.1}
                            />
                        ))}

                        {/* Trilha da montanha russa */}
                        <path
                            d={trilhaPath}
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />

                        {/* Carrinho da montanha russa */}
                        <g>
                            {/* Rodas (posicionadas dinamicamente) */}
                            <circle
                                cx={rodaEsquerdaPos.x}
                                cy={rodaEsquerdaPos.y}
                                r="3"
                                fill="#64748b"
                            />
                            <circle
                                cx={rodaDireitaPos.x}
                                cy={rodaDireitaPos.y}
                                r="3"
                                fill="#64748b"
                            />

                            {/* Carrinho principal */}
                            <g
                                transform={`translate(${carrinhoPosition.x}, ${carrinhoPosition.y}) rotate(${carrinhoRotation})`}
                            >
                                {/* Corpo do carrinho */}
                                <rect x="-15" y="-15" width="30" height="15" rx="4" fill="#0f172a" />

                                {/* Outros elementos do carrinho... */}
                            </g>
                        </g>

                        {/* Base da montanha russa */}
                        <rect x="10" y="240" width="380" height="5" fill="#334155" rx="2" />

                        {/* Indicadores de valor */}
                        <circle cx="80" cy="240" r="4" fill={valorAlvo < 1 ? "#f59e0b" : "#94a3b8"} />
                        <circle cx="200" cy="240" r="4" fill={valorAlvo === 1 ? "#10b981" : "#94a3b8"} />
                        <circle cx="320" cy="240" r="4" fill={valorAlvo > 1 ? "#3b82f6" : "#94a3b8"} />

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
function posicaoNaCurva(t) {
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
function calcularRotacao(t) {
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

export default MontanhaRussa;

// Exemplo de estrutura de perfilData para referência
const exemploPerfil = {
    nome: "Exemplo de Perfil",
    valor: 1.5, // Valor entre 0 e 2
    classificacao: "Intermediário",
    categoria: "Desempenho",
    detalhes: {
        observacoes: "Perfil com desempenho acima da média",
        fatores: [
            { nome: "Fator A", valor: 1.2 },
            { nome: "Fator B", valor: 0.8 }
        ],
        subAnalises: [
            { categoria: "Sub-categoria 1", valor: 1.3 },
            { categoria: "Sub-categoria 2", valor: 0.9 }
        ]
    },
    histórico: [
        { data: "2024-01-15", evento: "Primeira avaliação", valor: 1.0 },
        { data: "2024-02-20", evento: "Segunda avaliação", valor: 1.5 }
    ],
    recomendacoes: [
        "Continuar desenvolvimento",
        "Focar em pontos específicos"
    ],
    fonte: "Sistema de Análise",
    timestamp: new Date().toISOString()
};