import { AxiosInstance } from "./axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ScenariosService {
    win(winScenario: any) {
        console.log(winScenario);
        return AxiosInstance.post("/win", winScenario);
    }
    getwin(scenario: any, userId: any) {
        return AxiosInstance.get("/getwin", {
            params: { scenario, userId },
        });
    }

    loss(lossScenario: any) {
        return AxiosInstance.post("/loss", lossScenario);
    }
    getloss(scenario: any, userId: any) {
        return AxiosInstance.get("/getloss", {
            params: { scenario, userId },
        });
    }

    totalLossScenario(gainLossScenario: any) {
        return AxiosInstance.post("/onlyloss", gainLossScenario);
    }
    getOnlyLossScenario(scenario: any, userId: any) {
        return AxiosInstance.get("/getonlyloss", {
            params: { scenario, userId },
        });
    }
}
