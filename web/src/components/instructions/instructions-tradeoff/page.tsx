import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, Lightbulb, Lock } from "lucide-react";
import { Card } from "../../ui/card";

interface InstructionsScreenProps {
  onContinue: () => void;
}

export default function InstructionsScreen({
  onContinue,
}: InstructionsScreenProps) {
  return (
    <div className="flex min-h-screen flex-col p-4 justify-center text-gray-800 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl mx-auto pb-6 sm:pb-12 md:pb-12">
        <div className="p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl font-bold text-center mb-6 sm:text-xl sm:mb-8">
            Neste Quiz, você terá duas alternativas e deve escolher a que você
            mais se sente à vontade em aceitar.
          </h1>

          <div className="space-y-3 sm:space-y-4">
            {/* Warning Alert */}
            <Alert className="bg-green-50 border-green-200">
              <AlertTriangle className="h-5 w-5 text-green-800 sm:h-6 sm:w-6" />
              <div className="ml-2">
                <AlertTitle className="text-green-800 text-base sm:text-lg">
                  Opção Segura
                </AlertTitle>
                <AlertDescription className="text-green-700 text-sm mt-2">
                  Uma escolha com 100% de chance de acontecer
                </AlertDescription>
              </div>
            </Alert>

            {/* Remember Alert */}
            <Alert className="bg-red-50 border-red-200">
              <Lightbulb className="h-5 w-5 text-red-800 sm:h-6 sm:w-6" />
              <div className="ml-2">
                <AlertTitle className="text-red-800 text-base sm:text-lg">
                  Opção Arriscada
                </AlertTitle>
                <AlertDescription className="text-red-700 text-sm mt-2">
                  Uma jogada com duas consequências, cada uma com 50% de chance.
                  É como lançar uma moeda, em que cada lado representa um
                  resultado possível.
                </AlertDescription>
              </div>
            </Alert>
          </div>
          <div>
            <div className="space-y-3 pt-6">
              <div className="flex items-start text-left bg-blue-50 p-3 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p className="text-blue-700 text-sm">
                  Pense cuidadosamente e escolha o que mais lhe agrada.
                </p>
              </div>
              <div className="flex items-start text-left bg-yellow-50 p-3 rounded-lg">
                <svg
                  className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
                <p className="text-yellow-700 text-sm">
                  A cada escolha, os cenários mudarão. Fique atento aos números!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="w-full max-w-2xl mx-auto mt-2 sm:mt-3 justify-center flex">
          <div className="space-y-2 sm:space-y-4">
            <Button
              onClick={onContinue}
              className="w-75 font-bold py-6 px-4 rounded-xl transition-colors duration-300 text-base sm:text-lg"
            >
              Continuar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
