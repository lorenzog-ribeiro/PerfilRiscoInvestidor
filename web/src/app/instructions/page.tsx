"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function Instructions() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
      <div className="w-full max-w-xl bg-white rounded-2xl p-8 shadow space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Instruções para o Quiz
        </h1>

        <div className="text-sm text-gray-700 space-y-4">
          <p>
            <strong>Bem-vindo ao quiz!</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Duração:</strong> 5 a 10 minutos
            </li>
            <li>
              <strong>Confidencialidade:</strong> Suas respostas serão tratadas
              de forma confidencial e anônima.
            </li>
            <li>
              <strong>Respostas:</strong> Não há respostas &quot;corretas&quot;
              ou &quot;erradas&quot;. Opte pela opção que melhor representa o
              que você pensa.
            </li>
            <li>
              <strong>Completude:</strong> Mesmo que sejam parecidas, responda
              todas as perguntas para que possamos calcular seus resultados.
            </li>
          </ul>

          <p className="font-bold mt-6">FIQUE ATENTO!</p>
          <ul className="list-disc list-inside space-y-1 text-black font-semibold">
            <li>
              Para escolher uma alternativa, você deve selecionar o círculo
              correspondente a ela.
            </li>
            <li>
              Seja cuidadoso com suas respostas, pois, uma vez confirmadas, não
              poderão ser alteradas.
            </li>
          </ul>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            variant="outline"
            className="text-orange-500 border-orange-500 hover:bg-orange-100"
          >
            <Link href="/">Sair</Link>
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link href="/user-questions">Continuar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
