import { InvestorData, LiteracyData, DospertData } from "@/services/types";

export default function ResultPage({ investorData, literacyData, dospertData }: {
    investorData: InvestorData;
    literacyData: LiteracyData;
    dospertData: DospertData;
}) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Resultados do Questionário</h1>
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Perfil do Investidor</h2>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(investorData, null, 2)}</pre>
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Conhecimento Financeiro</h2>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(literacyData, null, 2)}</pre>
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Propensão a Assumir Riscos</h2>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(dospertData, null, 2)}</pre>
            </section>
        </div>
    );
}