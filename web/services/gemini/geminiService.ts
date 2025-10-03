
import { GoogleGenAI } from "@google/genai";
import { DospertResult, InvestorData } from '../types';

export const getPersonalizedAdvice = async (investorData: InvestorData, dospertResults: DospertResult[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const investorProfile = investorData.profile;

        const dospertSummary = dospertResults.map(r =>
            `- ${r.name} (${r.classification}): Tendência a ${r.classification === 'Alta' ? 'assumir' : r.classification === 'Média' ? 'considerar' : 'evitar'} riscos.`
        ).join('\n');

        const prompt = `
            Aja como um consultor financeiro amigável e experiente.
            Um usuário completou um questionário de perfil de risco e obteve os seguintes resultados:

            1. Perfil de Investidor:
               - Título: ${investorProfile.title}
               - Descrição: ${investorProfile.description}

            2. Propensão a Tomar Riscos (DOSPERT):
            ${dospertSummary}

            Com base nesses resultados combinados, forneça um parágrafo de conselho personalizado, conciso e encorajador. 
            O tom deve ser positivo e educacional, não prescritivo. 
            As frases devem seguir a estrutura sujeito + verbo + predicado, em ordem direta.
            Evitar jargões, promessas de retorno, gerúndios, pleonasmos, generalidades, termos ambíguos, expressões vagas, adjetivações subjetivas e juízos de valor.
            Também alerte as pessoas que tiverem perfis muito elevados de risco que elas precisam avaliar a capacidade de lidar com riscos para assumi-los com segurança.  
            Foque em como o autoconhecimento desses perfis pode ajudar o usuário a tomar melhores decisões financeiras.
            Comece com uma saudação como "Com base em suas respostas...".
            Não use markdown, apenas texto puro.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error fetching personalized advice from Gemini:", error);
        return "Não foi possível gerar o conselho personalizado. Por favor, tente novamente mais tarde.";
    }
};
