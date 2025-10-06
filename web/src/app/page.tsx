import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardHeader } from "../components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-2xl p-6 sm:p-12">
        <CardHeader className="mb-4 flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold color text-blue-800 mb-4">
            Qual é o seu perfil de investidor?
          </h1>
          <p className="text-sm text-left">
            Você sabe como suas emoções, metas e disposição para correr riscos
            podem te ajudar a escolher os investimentos mais adequados para você?
            <br />
            <b>
              Participe da nossa pesquisa e dê o primeiro passo para descobrir!
            </b>
          </p>
          <Button className="mt-4 bg-blue-700 hover:bg-blue-500 w-55" asChild>
            <Link href="/user">Iniciar Quiz</Link>
          </Button>
        </CardHeader>
        <hr />
        <div className="flex flex-col items-center justify-center">
          <div>
            <span className="text-sm font-semibold">Realização:</span>
            <div className="m-2">
              <Image
                src="copyright/cvm/CVM_realizaçao.svg"
                alt="Investidor"
                width={300}
                height={80}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold">Apoio:</span>
            <div className="m-2">
              <Image
                src="copyright/cvm/CVM_apoio.svg"
                alt="Investidor"
                width={300}
                height={80}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold">Parceiros:</span>
            <div className="m-2">
              <Image
                src="copyright/cvm/CVM_parceiros.svg"
                alt="Investidor"
                width={500}
                height={80}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
