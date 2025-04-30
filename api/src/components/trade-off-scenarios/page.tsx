"use client";

import { redirect } from "next/navigation";
import FirstScenario from "../first-scenario/page";
import SecondScenario from "../second-scenario/page";
import ThirdScenario from "../third-scenario/page";
import { useState } from "react";

export default function ScenarioController() {
    const [currentIndex, setCurrentIndex] = useState(0);
    if(currentIndex == 3) {
        redirect("/form-questions");
    }

    const scenarios = [
        <FirstScenario key="1" onAnswered={() => setCurrentIndex(1)} />,
        <SecondScenario key="2" onAnswered={() => setCurrentIndex(2)} />,
        <ThirdScenario key="3" onAnswered={() => setCurrentIndex(3)} />,
    ];

    return <div className="flex flex-col items-center justify-center space-y-6">{scenarios[currentIndex]}</div>;
}
