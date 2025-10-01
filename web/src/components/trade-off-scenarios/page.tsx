"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FirstScenario from "../first-scenario/page";

export default function ScenarioController() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === 3) {
      router.push("/form-questions");
    }
  }, [currentIndex, router]);

  const scenarios = [
    <FirstScenario key="1" onAnswered={() => setCurrentIndex(1)} />,
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {scenarios[currentIndex]}
    </div>
  );
}
