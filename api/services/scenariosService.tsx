import { AxiosInstance } from "./Axios";

export class ScenariosService {
    win(winScenario: any) {
        return AxiosInstance.post("/win", winScenario);
    }
    getwin(scenario: any, userId: any, attempt: any) {
        return AxiosInstance.get("/getwin", {
            params: { scenario, userId, attempt },
        });
    }

    loss(lossScenario: any) {
        return AxiosInstance.post("/loss", lossScenario);
    }
    getloss(scenario: any, userId: any, attempt: any) {
        return AxiosInstance.get("/getloss", {
            params: { scenario, userId, attempt },
        });
    }

    totalLossScenario(gainLossScenario: any) {
        return AxiosInstance.post("/onlyloss", gainLossScenario);
    }
    getOnlyLossScenario(scenario: any, userId: any, attempt: any) {
        return AxiosInstance.get("/getonlyloss", {
            params: { scenario, userId, attempt },
        });
    }

    calcResult(userId: any, tentativa: any) {
        return AxiosInstance.get("/result", {
            params: { userId, tentativa },
        });
    }
}
