"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FirstScenario from "../first-scenario/page";
import SecondScenario from "../second-scenario/page";
import ThirdScenario from "../third-scenario/page";

export default function ScenarioController() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    if (currentIndex === 3) {
      router.push("/form-questions");
    }
  }, [currentIndex, router]);

  const scenarios = [
    <FirstScenario key="1" onAnswered={() => setCurrentIndex(1)} />,
    <SecondScenario key="2" onAnswered={() => setCurrentIndex(2)} />,
    <ThirdScenario key="3" onAnswered={() => setCurrentIndex(3)} />,
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {scenarios[currentIndex]}
    </div>
  );
}
