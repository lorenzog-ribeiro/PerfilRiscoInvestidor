"use client";
import { SetStateAction, useMemo, useState } from "react";
import { Button } from "@/src//components/ui/button";
import { Input } from "@/src//components/ui/input";
import { Label } from "@/src//components/ui/label";
import { UserService } from "../../../services/UserService";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/src/components/ui/checkbox";

export default function UserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setbirthDate] = useState("");
  const [aceito, setAceito] = useState(false);
  const [loading, setLoading] = useState(false); // Adicionando estado para controlar o carregamento
  const [error, setError] = useState(""); // Estado para exibir erros
  const [emailError, setEmailError] = useState(""); // Novo estado para exibir erros de email
  const userService = useMemo(() => new UserService(), []);
  const router = useRouter();

  // Função para definir um cookie
  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiração do cookie
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  // Validação simples para os campos
  const validateForm = () => {
    if (!name || !email || !birthDate) {
      setError("Por favor, preencha todos os campos.");
      return false;
    }
    if (aceito === false) {
      setError("Os termos devem ser aceitos para continuar.");
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

    setLoading(true); // Ativar carregamento
    const userData = { name, email, birthDate };

    userService
      .createUser(userData)
      .then((response: { data: SetStateAction<string> }) => {
        const userId = response.data as string;
        // Armazenar o userId no cookie por 7 dias
        setCookie("userId", userId, 7);

        // Redirecionar para a página com o userId na URL
        router.push(`/instructions`);
      })
      .catch((error: { message: string }) => {
        setError(error.message); // Exibir mensagem de erro
      })
      .finally(() => {
        setLoading(false); // Desativar carregamento após a requisição
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6">
        <h1 className="text-xl font-bold color text-orange-500">
          Qual é o seu perfil de investidor?{" "}
        </h1>

        {/* Exibe a mensagem de erro, se houver */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Escreva seu nome"
        />

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Escreva seu email"
          className={emailError ? "border-red-500" : ""}
        />
        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setbirthDate(e.target.value)}
          placeholder="Selecione a data do seu aniversario"
        />
        <div>
          <p className="text-sm text-left">
            Para participar da pesquisa, leia atentamente o Termo de
            Consentimento Livre e Esclarecido e, no final da página, marque a
            caixa.
            <br />
            <u>
              <a target="blank" href="/TCLE.pdf">
                Clique aqui para ler!
              </a>
            </u>
          </p>
        </div>
        <div className="flex gap-2 itens-left">
          <Checkbox
            className="border-black-800 border-1"
            id="aceite"
            checked={aceito}
            required
            onCheckedChange={(checked) => {
              setAceito(checked === true);
            }}
          />
          <Label htmlFor="aceite" className="text-sm">
            Eu li e concordo com os termos do TCLE.
          </Label>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleCreateUser}
          disabled={loading} // Desabilita o botão durante o carregamento
        >
          {loading ? "Carregando..." : "Continuar"}{" "}
          {/* Texto condicional no botão */}
        </Button>
      </div>
    </div>
  );
}
