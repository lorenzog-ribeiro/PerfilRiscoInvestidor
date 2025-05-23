'use client';
import { useRouter } from "next/navigation";

// pages/instruction.tsx
export default function Instruction() {
    const router = useRouter();
    const redirectToTradeoff = () => {
        router.push("/finance-questions");
        return;
    };
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
            <article className="w-full max-w-3xl bg-white bg-opacity-90 rounded-3xl shadow-xl p-6 sm:p-10 text-gray-900 font-sans space-y-8">
                <h1 className="text-lg sm:text-md font-extrabold text-orange-700 text-center mb-6">
                    A partir de agora, você será apresentado a duas alternativas:
                </h1>

                <section className="space-y-6 max-w-[720px] mx-auto">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1 w-5 h-5 flex items-center justify-center rounded-full bg-green-600 text-white text-2xl font-bold select-none"></div>
                        <p className="text-md sm:text-md font-semibold">
                            <span>Opção Segura: </span>
                            Uma escolha segura com <strong>100%</strong> de chance de acontecer.
                        </p>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-600 text-white text-2xl font-bold select-none"></div>
                        <p className="text-md sm:text-md font-semibold">
                            <span>Opção Arriscada: </span>
                            Uma jogada arriscada com duas possíveis consequências, cada uma com <strong>50%</strong>  de chance.
                            B terá dois resultados possíveis com probabilidades iguais de acontecer (<strong>50%</strong> de chance) .
                        </p>
                    </div>
                </section>

                <p className="text-base sm:text-lg italic text-gray-700 max-w-[720px] mx-auto">
                    ⚠️ Pense suas opções cuidadosamente e escolha o que mais lhe agrada.
                </p>

                <p className="text-base sm:text-lg italic text-gray-700 max-w-[720px] mx-auto">
                    👉 Ao clicar em uma alternativa, você já estará selecionando ela.
                </p>

                <p className="text-base sm:text-lg italic text-gray-700 max-w-[720px] mx-auto">
                    ⚠️ A cada escolha, os cenários mudarão. Fique atento às mudanças dos números!
                </p>

                <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        onClick={redirectToTradeoff}
                    >
                        Vamos Começar
                    </button>
                </div>
            </article>
        </main>
    );
}
