import { AxiosInstance } from "./axios";

export class QuestionService{
    getUnique(question:number){
        return AxiosInstance.get("/questions",{
            params:{question}
        });
    };
    getCountQuestion(){
        return AxiosInstance.get("/questions/count");
    };
}