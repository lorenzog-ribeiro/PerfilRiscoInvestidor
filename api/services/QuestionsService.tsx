import { AxiosInstance } from "./Axios";

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