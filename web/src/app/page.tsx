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
            <span className="text-sm font-semibold">REALIZAÇÃO:</span>
            <div className="m-2">
              <Image
                src="copyright/sof/realizacao.svg"
                alt="Investidor"
                width={800}
                height={150}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between w-72 mb-2">
              <span className="text-sm font-semibold">Patrocinio:</span>
              <span className="text-sm font-semibold">APOIO:</span>
            </div>
            <div className="flex items-center">
              <Image
                src="copyright/sof/apoiadores.svg"
                alt="Investidor"
                width={700}
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
