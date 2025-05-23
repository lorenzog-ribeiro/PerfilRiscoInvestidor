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
        <main className="min-h-screen flex items-center justify-center px-4 py-8">
            <article className="w-full max-w-3xl bg-white bg-opacity-90 rounded-3xl shadow-xl p-6 sm:p-10 text-gray-900 font-sans space-y-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-700 text-center mb-6">
                    Prepare-se para um desafio!
                </h1>

                <p className="text-base sm:text-lg leading-relaxed max-w-[720px] mx-auto">
                    Você vai encarar duas opções que testam seu jeito de lidar com risco e segurança. Vamos nessa?
                </p>

                <section className="space-y-6 max-w-[720px] mx-auto">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold select-none"></div>
                        <p className="text-lg sm:text-xl font-semibold">
                            <span className="underline decoration-indigo-500 decoration-4">Opção A:</span> O caminho
                            seguro, garantido <strong>100%</strong> de sucesso. Sem sustos, sem surpresas — só
                            tranquilidade.
                        </p>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white text-2xl font-bold select-none"></div>
                        <p className="text-lg sm:text-xl font-semibold">
                            <span className="underline decoration-red-500 decoration-4">Opção B:</span> A aposta ousada,
                            cheia de emoção! Como jogar "cara ou coroa", com <strong>50%</strong> de chance de ganhar e{" "}
                            <strong>50%</strong> de chance de perder. Quem gosta de aventura vai adorar!
                        </p>
                    </div>
                </section>

                <p className="text-base sm:text-lg italic text-gray-700 max-w-[720px] mx-auto">
                    ⚠️ Pense suas opções cuidadosamente e escolha o que mais lhe agrada.
                </p>

                <p className="text-base sm:text-lg font-semibold text-indigo-800 max-w-[720px] mx-auto">
                    👉 Ao clicar em uma alternativa, você já estará selecionando ela.
                </p>

                <p className="text-base sm:text-lg text-red-700 font-semibold max-w-[720px] mx-auto">
                    ⚠️ A cada escolha, os cenários mudarão. Fique atento às mudanças dos números!
                </p>

                <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        onClick={redirectToTradeoff}
                    >
                        Continuar
                    </button>
                </div>
            </article>
        </main>
    );
}
