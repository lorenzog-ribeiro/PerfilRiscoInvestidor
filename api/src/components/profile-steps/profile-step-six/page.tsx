/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function StepSix({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="font-medium">Qual faixa de renda mensal melhor representa sua situação financeira atual?</Label>
                <RadioGroup
                    className="space-y-2 pt-2"
                    value={formData.incomeRange}
                    onValueChange={(value) => setFormData({ ...formData, incomeRange: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Até 1 salário mínimo" id="income-1" />
                        <label htmlFor="income-1">Até 1 salário mínimo (até R$ 1.320,00)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="De 1 a 2 salários mínimos" id="income-2" />
                        <label htmlFor="income-1">De 1 a 2 salários mínimos (até R$ 1.321,00 até R$ 2.640,00)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="De 2 a 5 salários mínimos" id="income-3" />
                        <label htmlFor="income-1">De 2 a 5 salários mínimos (até R$ 2.641,00 até R$ 6.600,00)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="De 5 a 10 salários mínimos" id="income-4" />
                        <label htmlFor="income-1">De 5 a 10 salários mínimos (até R$ 6.601,00 até R$ 13.200,00)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="De 10 a 30 salários mínimos" id="income-5" />
                        <label htmlFor="income-1">De 10 a 30 salários mínimos (até R$ 13.201,00 até R$ 39.600,00)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mais de 30 salários mínimos" id="income-6" />
                        <label htmlFor="income-1">Mais de 30 salários mínimos (acima de R$ 39.600,00)</label>
                    </div>

                </RadioGroup>
            </div>
        </div>
    );
}