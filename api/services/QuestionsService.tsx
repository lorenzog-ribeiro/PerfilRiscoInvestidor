import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: "http://localhost:3333"
});

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