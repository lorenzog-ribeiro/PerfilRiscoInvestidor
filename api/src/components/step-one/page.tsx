"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StepOne({ formData, setFormData }: any) {
    function formatDate(value: string) {
        let v = value.replace(/\D/g, "").slice(0, 8);
        if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
        else if (v.length >= 3) v = v.replace(/(\d{2})(\d{0,2})/, "$1/$2");
        return v;
    }

    return (
        <div className="space-y-4">
            <div>
                <Label>Por favor, usando o formato dia/mês/ano, informe: Quando você nasceu?</Label>
                <Input
                    placeholder="dd/mm/aaaa"
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: formatDate(e.target.value) })}
                    className="w-full"
                    maxLength={10}
                />
            </div>
            <div>
                <Label>Qual é a sua idade atual em anos?</Label>
                <Input
                    placeholder="23"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full"
                />
            </div>
            <div>
                <Label>Quais das seguintes alternativas descreve melhor a forma como você se identifica hoje?</Label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                    <option value="">Selecione</option>
                    <option>Mulher</option>
                    <option>Homem</option>
                    <option>Queer, não-binário ou gênero fluido</option>
                    <option>Prefiro me autodescrever</option>
                </select>
            </div>
            <div>
                <Label>Qual é o seu estado civil?</Label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                >
                    <option value="">Selecione</option>
                    <option>Solteiro(a)</option>
                    <option>Casado(a)</option>
                    <option>Separado(a)</option>
                    <option>Divorciado(a)</option>
                    <option>Viúvo(a)</option>
                </select>
            </div>
        </div>
    );
}
