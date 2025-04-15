/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function StepTwo({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="font-medium">
                    Quais das seguintes alternativas descreve melhor a forma como você se identifica hoje?
                </Label>
                <RadioGroup
                    className="space-y-2 pt-2"
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mulher" id="gen-1" />
                        <label htmlFor="gen-1">Mulher</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Homem" id="gen-2" />
                        <label htmlFor="gen-2">Homem</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Queer, não-binário ou gênero fluido" id="gen-3" />
                        <label htmlFor="gen-3">Queer, não-binário ou gênero fluido</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Prefiro me autodescrever" id="gen-4" />
                        <label htmlFor="gen-4">Prefiro me autodescrever</label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
