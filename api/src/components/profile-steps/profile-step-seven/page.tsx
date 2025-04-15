import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function StepSeven({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <div>
                <Label className="font-medium">
                    Você trabalha/trabalhou em alguma posição diretamente relacionada ao mercado financeiro(agente
                    autônomo, gestor de carteira, analista, acadêmico de finanças, etc.)?
                </Label>
                <RadioGroup
                    className="space-y-2 pt-2"
                    value={formData.hasFinanceExperience}
                    onValueChange={(value) => setFormData({ ...formData, hasFinanceExperience: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sim" id="hasFinanceExperience-yes" />
                        <Label htmlFor="hasFinanceExperience-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Não" id="hasFinanceExperience-no" />
                        <Label htmlFor="hasFinanceExperience-no">Não</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
