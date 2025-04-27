import { AxiosInstance } from "./axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ScenariosService {
    getwin(scenario: any, userId: any) {
        return AxiosInstance.get("/getwin", {
            params: { scenario, userId }
        });
    }
    win(winScenario: any) {
        console.log(winScenario);
        return AxiosInstance.post("/win", winScenario);
    }
    
    getloss(scenario: any, userId: any) {
        return AxiosInstance.get("/getloss", {
            params: { scenario, userId }
        });
    }
    loss(lossScenario: any) {
        return AxiosInstance.post("/loss", lossScenario);
    }
    lossAggregate(gainLossScenario: any) {
        return AxiosInstance.post("/lossAggregate", gainLossScenario);
    }
}
