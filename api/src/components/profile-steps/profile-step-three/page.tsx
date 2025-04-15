/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function StepThree({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="font-medium">Qual é o seu estado civil?</Label>
                <RadioGroup
                    className="space-y-2 pt-2"
                    value={formData.maritalStatus}
                    onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Solteiro(a)" id="mar-1" />
                        <label htmlFor="mar-1">Solteiro(a)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Casado(a)" id="mar-2" />
                        <label htmlFor="mar-2">Casado(a)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Separado(a)" id="mar-3" />
                        <label htmlFor="mar-3">Separado(a)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Divorciado(a)" id="mar-4" />
                        <label htmlFor="mar-4">Divorciado(a)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Viúvo(a)" id="mar-5" />
                        <label htmlFor="mar-5">Viúvo(a)</label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
