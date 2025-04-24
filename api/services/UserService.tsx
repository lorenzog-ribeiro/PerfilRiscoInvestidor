/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "./axios";

export class UserService {
    createUser(user: any) {
        return AxiosInstance.post("/create-user", user);
    }
}