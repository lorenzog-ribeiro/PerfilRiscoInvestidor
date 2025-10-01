"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TradeOffForm from "../trade-off-form/page";

export default function ScenarioController() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === 3) {
      router.push("/form-questions");
    }
  }, [currentIndex, router]);

  // 🔥 Define os cenários como objetos
  const scenariosConfig = [
    { scenario: 1, title: "Cenário 1" },
    { scenario: 2, title: "Cenário 2" },
    { scenario: 3, title: "Cenário 3" },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <TradeOffForm
        key={scenariosConfig[currentIndex].scenario}
        scenario={scenariosConfig[currentIndex].scenario}
        title={scenariosConfig[currentIndex].title}
        onAnswered={() => setCurrentIndex(currentIndex + 1)}
      />
    </div>
  );
}
