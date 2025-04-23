// components/DynamicQuestion.tsx
"use client";

import { Question } from "@/app/(form)/form-questions/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
    question: Question;
    value: string;
    onChange: (value: string) => void;
}

export default function DynamicQuestion({ question, value, onChange }: Props) {
    function maskDate(value: string) {
        value = value.replace(/\D/g, ""); // remove tudo que não é número
        if (value.length <= 2) return value;
        if (value.length <= 4) return `${value.slice(0, 2)}/${value.slice(2)}`;
        return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    }
    return (
        <div className="space-y-4">
            <Label className="font-medium text-base text-gray-800">{question.texto}</Label>

            {question.tipo === "radio" && (
                <RadioGroup value={value} onValueChange={onChange} className="space-y-2 pt-2">
                    {question.respostas.map((reposta) => (
                        <div className="flex items-center space-x-2" key={reposta.id}>
                            <RadioGroupItem id={`${question.id}-${reposta.id}`} value={reposta.id} />
                            <label htmlFor={`${question.id}-${reposta.id}`} className="text-sm text-gray-700">
                                {reposta.texto}
                            </label>
                        </div>
                    ))}
                </RadioGroup>
            )}

            {question.tipo === "data" && (
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(maskDate(e.target.value))}
                    placeholder="dd/mm/aaaa"
                    maxLength={10}
                />
            )}
            
        </div>
    );
}
