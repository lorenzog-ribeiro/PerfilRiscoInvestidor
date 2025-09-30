import { AxiosInstance } from "./Axios";

export class UserService {
  createUser(user: any) {
    console.log(user);
    return AxiosInstance.post("user/create-user", user);
  }
}
