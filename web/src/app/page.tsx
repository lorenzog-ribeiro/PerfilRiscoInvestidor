import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md p-6 sm:p-12">
        <h1 className="text-xl font-bold color text-orange-500">
          Qual é o seu perfil de investidor?{" "}
        </h1>
        <p className="text-sm text-left">
          Você sabe como suas emoções, metas e disposição para correr riscos
          podem te ajudar a escolher os investimentos mais adequados para você?
          <br />
          <b>
            Participe da nossa pesquisa e dê o primeiro passo para descobrir!
          </b>
        </p>
        <Button className="mb-4 bg-orange-400 hover:bg-orange-300" asChild>
          <Link href="/user">Iniciar Quiz</Link>
        </Button>
        <hr />
        <div className="flex flex-col items-center justify-center">
          <div>
            <span className="text-sm font-semibold">REALIZAÇÃO:</span>
            <div className="m-2">
              <Image
                src="copyright/prpqnovo.svg"
                alt="Investidor"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold">APOIO:</span>
            <div className="flex items-center">
              <Image
                src="copyright/cnpq-logo.svg"
                alt="Investidor"
                width={150}
                height={150}
                className="rounded-lg"
              />
              <Image
                src="copyright/fapemig.svg"
                alt="Investidor"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
