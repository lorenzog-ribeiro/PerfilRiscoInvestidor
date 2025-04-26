/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FirstScenario from "../first-scenario/page";

export default function ScenarioController() {
    return <FirstScenario />;

    // switch (currentScenario.tipo) {
    //   case "ganho":
    //
    //   case "ganho_perda":
    //     return <Etapa2 scenario={currentScenario} onConclude={handleConclude} />;
    //   case "perda":
    //     return <Etapa3 scenario={currentScenario} onConclude={handleConclude} />;
    // }
}
