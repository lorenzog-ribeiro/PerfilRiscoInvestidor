"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TradeOffForm from "../trade-off-form/page";

export default function ScenarioController() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scenario2LastValue, setScenario2LastValue] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (currentIndex === 3) {
      router.push("/form-questions");
    }
  }, [currentIndex, router]);

  const scenariosConfig = [
    { scenario: 1, title: "Cenário 1" },
    { scenario: 2, title: "Cenário 2" },
    { scenario: 3, title: "Cenário 3" },
  ];

  const currentScenario = scenariosConfig[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <TradeOffForm
        key={currentScenario.scenario}
        scenario={currentScenario.scenario}
        title={currentScenario.title}
        onAnswered={() => setCurrentIndex(currentIndex + 1)}
        onValueSelected={(value) => {
          // Salva o valor quando estiver no cenário 2
          if (currentScenario.scenario === 2) {
            setScenario2LastValue(value);
          }
        }}
        initialFixedValue={
          // Passa o valor salvo apenas no cenário 3
          currentScenario.scenario === 3 ? scenario2LastValue : null
        }
      />
    </div>
  );
}
