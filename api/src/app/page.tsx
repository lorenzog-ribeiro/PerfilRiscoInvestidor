import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import Image from "next/image";

export default function Home() {
  return (
  <div className="flex flex-col items-center text-center justify-center min-h-screen py-2">
  <Card>
    <h5>Qual é o seu perfil de investidor? </h5>
    <p className="">Você sabe como suas emoções, metas e disposição para correr riscos podem te ajudar a escolher os investimentos mais adequados para você? Participe da nossa pesquisa e dê o primeiro passo para descobrir!</p>
    <Button className="mb-4">Iniciar o Quiz</Button>
  </Card>
  </div>
  );
}
