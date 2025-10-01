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
    try {
      const userData = { name, email, birthDate: new Date(birthDate) };
      const response = await userService.createUser(userData);
      const userId = response.data as string;

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6"
      >
        <h1 className="text-xl font-bold color text-orange-500">
          Qual é o seu perfil de investidor?{" "}
        </h1>
        {/* Exibe a mensagem de erro, se houver */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Escreva seu nome"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Escreva seu email"
            className={emailError ? "border-red-500" : ""}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Data de Nascimento</Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setbirthDate(e.target.value)}
            placeholder="Selecione a data do seu aniversario"
            disabled={loading}
          />
        </div>
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
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Continuar"}{" "}
          {/* Texto condicional no botão */}
        </Button>
      </form>
    </div>
  );
}
