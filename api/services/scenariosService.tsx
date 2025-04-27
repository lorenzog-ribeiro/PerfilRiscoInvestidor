import { AxiosInstance } from "./axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ScenariosService {
    getwin(scenario: any,userID:any) {
        return AxiosInstance.get("/win",{
            params:{scenario,userID}
        });
    }
    win(winScenario: any) {
        return AxiosInstance.post("/win", winScenario);
    }
    loss(lossScenario: any) {
        return AxiosInstance.post("/loss", lossScenario);
    }
    lossAggregate(gainLossScenario: any) {
        return AxiosInstance.post("/lossAggregate", gainLossScenario);
    }
}
