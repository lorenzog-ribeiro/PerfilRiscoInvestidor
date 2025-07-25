"use client"
import { useEffect, useMemo, useState } from 'react'; // ✅ Removido SetStateAction
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScenariosService } from '../../../../services/scenariosService';
// ✅ Removido MontanhaRussa que não estava sendo usado
import TesteA from '@/components/equilibrium/page';

// ✅ Definir interface para o tipo correto
interface PerfilResponse {
    data: {
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
    };
}

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

export default function ResultadoFinal() {
    const [perfilData, setPerfilData] = useState<PerfilData | null>(null); // ✅ Tipo específico
    const [carregando, setCarregando] = useState(true);
    const [storedUserId, setStoredUserId] = useState<string | undefined>(undefined);
    const [storedUserAttempt, setStoredUserAttempt] = useState<string | undefined>(undefined);

    const profileService = useMemo(() => new ScenariosService(), []);

    useEffect(() => {
        setPerfilData(null);
        console.log("🔄 Iniciando carregamento fresh dos dados...");

        const userId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userId="))
            ?.split("=")[1];
        const userAttempt = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userAttempt="))
            ?.split("=")[1];

        console.log("🍪 Cookies encontrados:", { userId, userAttempt });
        console.log("📅 Timestamp:", new Date().toLocaleString());

        setStoredUserId(userId);
        setStoredUserAttempt(userAttempt);

        if (!userId || !userAttempt) {
            console.warn("⚠️ Cookies userId ou userAttempt não encontrados!");
            setCarregando(false);
            return;
        }

        const carregarDadosAleatorios = async () => {
            setCarregando(true);
            console.log("📡 Iniciando requisição para calcResult...");

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                const response: PerfilResponse = await profileService.calcResult(userId, userAttempt); // ✅ Tipo específico
                
                console.log("✅ Resposta recebida:", response);
                console.log("👤 Nome do usuário na resposta:", response?.data?.profile?.usuario?.nome);

                if (!response?.data?.profile?.usuario?.nome) {
                    console.warn("⚠️ Dados incompletos recebidos:", response);
                    throw new Error("Dados do perfil incompletos");
                }

                setPerfilData(response.data);
                console.log("🎉 Dados definidos no estado com sucesso!");

            } catch (error: unknown) { // ✅ Tipo específico para error
                console.error("❌ Erro ao carregar dados:", error);
                if (error instanceof Error) {
                    console.error("Mensagem do erro:", error.message);
                }
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosAleatorios();

        return () => {
            console.log("🧹 Limpando dados do componente...");
            setPerfilData(null);
        };

    }, [profileService]);

    const forceReload = async () => {
        console.log("🔄 Forçando reload dos dados...");
        setPerfilData(null);
        setCarregando(true);

        const userId = storedUserId;
        const userAttempt = storedUserAttempt;

        if (!userId || !userAttempt) {
            console.warn("⚠️ IDs não disponíveis para reload");
            setCarregando(false);
            return;
        }

        try {
            const response: PerfilResponse = await profileService.calcResult(userId, userAttempt); // ✅ Tipo específico
            console.log("✅ Dados recarregados:", response?.data?.profile?.usuario?.nome);
            setPerfilData(response.data);
        } catch (error: unknown) { // ✅ Tipo específico
            console.error("❌ Erro no reload:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (perfilData) {
            console.log("📊 Estado perfilData atualizado:", {
                nome: perfilData.profile.usuario.nome, // ✅ Sem 'any'
                timestamp: new Date().toLocaleString()
            });
        }
    }, [perfilData]);

    // ... resto do JSX permanece igual
    return (
        <div className="container mx-auto px-4 py-8">
            {carregando && (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Carregando análise</CardTitle>
                        <CardDescription>
                            Aguarde enquanto processamos os resultados...
                            <br />
                            <small className="text-xs text-gray-500">
                                {storedUserId ? `ID: ${storedUserId.substring(0, 8)}...` : 'Verificando cookies...'}
                            </small>
                        </CardDescription>
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

            {!carregando && !perfilData && (
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-lg font-medium mb-2">Dados não encontrados</h3>
                        <p className="text-gray-600 mb-4">
                            Não foi possível carregar os dados do perfil.
                        </p>
                        <button 
                            onClick={forceReload}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                        >
                            🔄 Tentar Novamente
                        </button>
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