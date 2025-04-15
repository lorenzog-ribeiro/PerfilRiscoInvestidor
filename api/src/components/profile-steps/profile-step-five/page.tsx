/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function StepFive({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="font-medium">Sobre sua situação financeira, qual das seguintes opções melhor descreve seu cénario atual?</Label>
                <RadioGroup
                    className="space-y-2 pt-2"
                    value={formData.financialStatus}
                    onValueChange={(value) => setFormData({ ...formData, financialStatus: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Iniciante" id="fin-1" />
                        <Label htmlFor="fin-1">Dependo de outras fontes de renda (pais, tios, etc.)e não tenho dependentes financeiros</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Intermediário" id="fin-2" />
                        <Label htmlFor="fin-2">Minha renda cobre todos os meus gastos e tenho dependentes financeiros</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Avançado" id="fin-3" />
                        <Label htmlFor="fin-3">Minha renda cobre todos os meus gastos e não tenho dependentes financeiros</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
