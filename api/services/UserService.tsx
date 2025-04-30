import { AxiosInstance } from "./Axios";

export class UserService {
    createUser(user: any) {
        return AxiosInstance.post("/create-user", user);
    }
}