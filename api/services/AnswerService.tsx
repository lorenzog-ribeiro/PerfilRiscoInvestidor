/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "./Axios";

export class AnswerService {
    save(answer: any) {
        return AxiosInstance.post("/save-answer", answer);
    }
}