"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // ADICIONAR

// MODIFICAR: Importar com dynamic e ssr: false
const TradeOffForm = dynamic(() => import("./TradeOffForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  ),
});

export default function ScenarioController() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scenario2LastValue, setScenario2LastValue] = useState<number | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (currentIndex === 3) {
      router.push("/quiz");
    }
  }, [currentIndex, router]);

  const scenariosConfig = [
    { scenario: 1, title: "Cenário 1" },
    { scenario: 2, title: "Cenário 2" },
    { scenario: 3, title: "Cenário 3" },
  ];

  const currentScenario = scenariosConfig[currentIndex];

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <TradeOffForm
        key={currentScenario.scenario}
        scenario={currentScenario.scenario}
        title={currentScenario.title}
        onAnswered={() => setCurrentIndex(currentIndex + 1)}
        onValueSelected={(value) => {
          if (currentScenario.scenario === 2) {
            setScenario2LastValue(value);
          }
        }}
        initialFixedValue={
          currentScenario.scenario === 3 ? scenario2LastValue : null
        }
      />
    </div>
  );
}
