import { Label } from "@/components/ui/label";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StepThree({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Você já atuou ou trabalha no mercado financeiro?</Label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.hasFinanceExperience}
                    onChange={(e) => setFormData({ ...formData, hasFinanceExperience: e.target.value })}
                >
                    <option value="">Selecione</option>
                    <option>Sim</option>
                    <option>Não</option>
                </select>
            </div>
        </div>
    );
}
