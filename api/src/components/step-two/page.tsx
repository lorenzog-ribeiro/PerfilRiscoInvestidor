/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";

export default function StepTwo({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Qual das seguintes afirmações melhor descreve sua situação financeira atual?</Label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.financialStatus}
                    onChange={(e) => setFormData({ ...formData, financialStatus: e.target.value })}
                >
                    <option value="">Selecione</option>
                    <option>Dependo de outras fontes de renda e não tenho dependentes</option>
                    <option>Minha renda cobre todos os meus gastos e tenho dependentes</option>
                    <option>Minha renda cobre todos os meus gastos e não tenho dependentes</option>
                </select>
            </div>
            <div>
                <Label>Qual das seguintes faixas melhor representa a sua renda mensal individual?</Label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.incomeRange}
                    onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
                >
                    <option value="">Selecione</option>
                    <option>Até 1 salário mínimo</option>
                    <option>De 1 a 2 salários mínimos</option>
                    <option>De 2 a 5 salários mínimos</option>
                    <option>De 5 a 10 salários mínimos</option>
                    <option>De 10 a 30 salários mínimos</option>
                    <option>Mais de 30 salários mínimos</option>
                </select>
            </div>
            <div>
                <Label>Qual é o seu nível mais alto de escolaridade?</Label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                >
                    <option value="">Selecione</option>
                    <option>Ensino Fundamental</option>
                    <option>Ensino Médio</option>
                    <option>Graduação</option>
                    <option>Pós-Graduação</option>
                </select>
            </div>
        </div>
    );
}
