import { AxiosInstance } from "./axios";

export class UserService {
    createUser(user: any) {
        return AxiosInstance.post("/create-user", user);
    }
}