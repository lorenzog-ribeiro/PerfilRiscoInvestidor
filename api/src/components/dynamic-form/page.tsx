// components/DynamicQuestion.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Question {
    id: string;
    categoria: string;
    pergunta: string;
    tipo: string;
    respostas: string[];
}

interface Props {
    question: Question;
    value: string;
    onChange: (value: string) => void;
}

export default function DynamicQuestion({ question, value, onChange }: Props) {
    function formatDate(value: string) {
        let v = value.replace(/\D/g, "").slice(0, 8);
        if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
        else if (v.length >= 3) v = v.replace(/(\d{2})(\d{0,2})/, "$1/$2");
        return v;
    }
    return (
        <div className="space-y-4">
            <Label className="font-medium text-base text-gray-800">{question.pergunta}</Label>

            {question.tipo === "radio" && (
                <RadioGroup value={value} onValueChange={onChange} className="space-y-2 pt-2">
                    {question.respostas.map((resposta, index) => (
                        <div className="flex items-center space-x-2" key={index}>
                            <RadioGroupItem id={`${question.id}-${index}`} value={resposta} />
                            <label htmlFor={`${question.id}-${index}`} className="text-sm text-gray-700">
                                {resposta}
                            </label>
                        </div>
                    ))}
                </RadioGroup>
            )}

            {question.tipo === "data" && (
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(formatDate(e.target.value))}
                    placeholder="dd/mm/aaaa"
                    maxLength={10}
                />
            )}
        </div>
    );
}
