/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FirstScenario from "../first-scenario/page";
import SecondScenario from "../second-scenario/page";
import ThridScenario from "../third-scenario/page";

export default function ScenarioController() {
    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <ThridScenario />
        </div>
    );
}
