import { AxiosInstance } from "./axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ScenariosService {
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
