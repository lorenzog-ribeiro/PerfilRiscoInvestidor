/* eslint-disable @typescript-eslint/no-explicit-any */
// components/form/StepOne.tsx
'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepOne({ formData, setFormData }: any) {
  function formatDate(value: string) {
    let v = value.replace(/\D/g, "").slice(0, 8);
    if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    else if (v.length >= 3) v = v.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    return v;
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="font-medium">Por favor, usando o formato dia/mês/ano, informe: Quando você nasceu?</Label>
        <Input
          placeholder="dd/mm/aaaa"
          type="text"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: formatDate(e.target.value) })}
          className="w-full mt-2"
          maxLength={10}
        />
      </div>
    </div>
  );
}