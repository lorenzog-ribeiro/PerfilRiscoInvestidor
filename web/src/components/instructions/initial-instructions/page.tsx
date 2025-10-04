import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle, Lightbulb, Lock } from 'lucide-react';
import { Card } from '../../ui/card';

interface InstructionsScreenProps {
  onContinue: () => void;
}

export default function InstructionsScreen({
  onContinue
}: InstructionsScreenProps) {
  return (
    <div className="flex min-h-screen flex-col p-4 justify-center text-gray-800 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl mx-auto pb-8 sm:pb-12 md:pb-16">
        <div className='p-6 sm:p-8 md:p-10'>
          <h1 className="text-2xl font-bold text-center mb-6 sm:text-3xl sm:mb-8">
            Instruções
          </h1>

          <div className="space-y-3 sm:space-y-4">
            {/* Warning Alert */}
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-800 sm:h-6 sm:w-6" />
              <div className="ml-2">
                <AlertTitle className="text-yellow-800 text-base sm:text-lg">
                  FIQUE ATENTO!
                </AlertTitle>
                <AlertDescription className="text-yellow-700 text-sm mt-2">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Duração:</strong> 15 a 20 minutos.
                    </li>
                    <li>
                      Responda todas as perguntas para que possamos calcular seus resultados.
                    </li>
                  </ul>
                </AlertDescription>
              </div>
            </Alert>

            {/* Remember Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <Lightbulb className="h-5 w-5 text-blue-800 sm:h-6 sm:w-6" />
              <div className="ml-2">
                <AlertTitle className="text-blue-800 text-base sm:text-lg">
                  LEMBRE-SE
                </AlertTitle>
                <AlertDescription className="text-blue-700 text-sm mt-2">
                  Não há respostas &quot;corretas&quot; ou &quot;erradas&quot;, mas é importante você
                  preencher o que melhor corresponde ao seu sentimento no momento.
                </AlertDescription>
              </div>
            </Alert>

            {/* Confidentiality Alert */}
            <Alert className="bg-gray-100 border-gray-200">
              <Lock className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
              <div className="ml-2">
                <AlertTitle className="text-gray-800 text-base sm:text-lg">
                  CONFIDENCIALIDADE
                </AlertTitle>
                <AlertDescription className="text-gray-700 text-sm mt-2">
                  Todas as informações fornecidas neste quiz serão tratadas de
                  forma confidencial e anônima. As respostas não permitem a
                  identificação dos participantes.
                </AlertDescription>
              </div>
            </Alert>
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
      </Card >
    </div>
  );
}