"use client";
import { SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserService } from "../../../../services/UserService";
import { useRouter } from "next/navigation";

export default function UserPage() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);  // Adicionando estado para controlar o carregamento
    const [error, setError] = useState("");  // Estado para exibir erros
    const [emailError, setEmailError] = useState("");  // Novo estado para exibir erros de email
    const userService = useMemo(() => new UserService(), []);
    const router = useRouter();

    // Função para definir um cookie
    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  // Expiração do cookie
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    };

    // Validação simples para os campos
    const validateForm = () => {
        if (!nome || !email) {
            setError("Por favor, preencha todos os campos.");
            return false;
        }

        // Validação simples de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Por favor, insira um e-mail válido.");
            return false;
        }

        setError(""); // Limpa qualquer erro anterior
        setEmailError(""); // Limpa erro de e-mail
        return true;
    };

    const handleCreateUser = async () => {
        if (!validateForm()) return;

        setLoading(true);  // Ativar carregamento
        const userData = { nome, email };

        userService
            .createUser(userData)
            .then((response: { data: SetStateAction<string> }) => {
                const userId = response.data as string;
                
                // Armazenar o userId no cookie por 7 dias
                setCookie("userId", userId, 7);

                // Redirecionar para a página com o userId na URL
                router.push(`/form-questions`);
            })
            .catch((error: { message: string }) => {
                setError(error.message);  // Exibir mensagem de erro
            })
            .finally(() => {
                setLoading(false);  // Desativar carregamento após a requisição
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6">
                <Label className="font-medium text-base text-gray-800">Preencha algumas informações</Label>

                {/* Exibe a mensagem de erro, se houver */}
                {error && <div className="text-red-500 text-sm">{error}</div>}

                <Input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Escreva seu nome"
                />

                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Escreva seu email"
                    className={emailError ? "border-red-500" : ""}  // Adicionando borda vermelha se o email for inválido
                />
                {/* Exibe mensagem de erro caso o e-mail seja inválido */}
                {emailError && <div className="text-red-500 text-sm">{emailError}</div>}

                <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleCreateUser}
                    disabled={loading}  // Desabilita o botão durante o carregamento
                >
                    {loading ? "Carregando..." : "Continuar"}  {/* Texto condicional no botão */}
                </Button>
            </div>
        </div>
    );
}
