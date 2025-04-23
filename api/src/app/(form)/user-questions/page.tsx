"use client";
import { SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserService } from "../../../../services/UserService";
import { useRouter } from "next/navigation";

export default function UserPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const userService = useMemo(() => new UserService(), []);
    const router = useRouter();

    const handleCreateUser = async () => {
        const userData = { nome, email };

        userService.createUser(userData)
            .then((response: { data: SetStateAction<string> }) => {
                const userId = response.data;
                router.push(`/form-questions?userId=${userId}`);
            })
            .catch((error: { message: string }) => {
                console.log(error.message);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-6">
                <Label className="font-medium text-base text-gray-800">Preencha algumas informacoes</Label>

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
                    placeholder="Escreva email"
                />

                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreateUser}>
                    Continuar
                </Button>
            </div>
        </div>
    );
}
