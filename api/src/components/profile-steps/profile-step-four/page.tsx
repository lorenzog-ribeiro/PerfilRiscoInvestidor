/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function StepFour({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="font-medium">
                    Qual é o maior nível de educação que você concluiu?
                </Label>
                <RadioGroup
                    className="space-y-2 pt-2"
                    value={formData.educationLevel}
                    onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ensino Fundamental" id="edu-1" />
                        <label htmlFor="edu-1">Ensino Fundamental</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ensino Médio" id="edu-2" />
                        <label htmlFor="edu-2">Ensino Médio</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Graduação" id="edu-3" />
                        <label htmlFor="edu-3">Graduação</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Pós-graduação" id="edu-4" />
                        <label htmlFor="edu-4">Pós-graduação</label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
