/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

// Dados importados direto do JSON que você já tem
import scenariosJSON from "../../../scenarios.json";
import Etapa1 from "../stage-1/page";
import Etapa2 from "../stage-2/page";
import Etapa3 from "../stage-3/page";
import { toast } from "sonner";

export default function ScenarioController() {
  const [scenarios, setScenarios] = useState(scenariosJSON);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScenario = scenarios[currentIndex];

  const handleConclude = (updatedScenario: any) => {
    const newScenarios = [...scenarios];
    newScenarios[currentIndex] = updatedScenario;
  
    setScenarios(newScenarios);
  
    if (currentIndex < newScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast.success("Todos os cenários foram concluídos!");
    }
  };
  

  switch (currentScenario.tipo) {
    case "ganho":
      return <Etapa1 scenario={currentScenario} onConclude={handleConclude} />;
    case "ganho_perda":
      return <Etapa2 scenario={currentScenario} onConclude={handleConclude} />;
    case "perda":
      return <Etapa3 scenario={currentScenario} onConclude={handleConclude} />;
  }
}
