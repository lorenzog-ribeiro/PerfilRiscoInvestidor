'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from "@/components/ui/label";
import { Card } from '@/components/ui/card';

export default function PdfViewer() {
  const [aceito, setAceito] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
      <Card className="w-full max-w-md p-6 sm:p-12">
        <div>
          <h1 className="text-xl font-bold color text-orange-500">Qual é o seu perfil de investidor? </h1>
          <p className="text-sm text-left">Para participar da pesquisa, leia atentamente o Termo de Consentimento Livre e Esclarecido e, no final da página, marque a caixa.
            <br /><u><a target='blank' href='/TCLE.pdf'>Clique aqui para ler!</a></u>
          </p>

        </div>
        {/* <iframe
        src="/TCLE.pdf"
        className="w-full h-[75vh] max-w-4xl border"
      /> */}
        <div className="flex gap-2 itens-left">
          <Checkbox className="border-black-800" id="aceite" checked={aceito} onCheckedChange={setAceito} className='border-1' />
          <Label htmlFor="aceite" className="text-sm">
            Eu li e concordo com os termos do TCLE.
          </Label>
        </div>
      </Card>
    </div>
  );
}

