import { CreateAccount } from "../../application/usecase/CreateAccount";
import { HttpServer } from "./../http/HttpServer";

export class AccountController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly createAccount: CreateAccount
  ) {
    httpServer.register("post", "/signup", async (params: any, body: any) => {
      await this.createAccount.execute(body);
    });
  }
}
