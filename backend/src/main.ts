import "dotenv/config";

import { AccountRepositoryMemory } from "../test/account/infra/repository/AccountRepositoryMemory";
import { CreateAccount } from "./account/application/usecase/CreateAccount";
import { AccountController } from "./account/infra/controller/AccountController";
import { PgPromiseAdapter } from "./account/infra/database/Connection";
import { ExpressAdapter } from "./account/infra/http/HttpServer";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
// const accountRepository = new AccountRepositoryDatabase(connection);
const accountRepository = new AccountRepositoryMemory();
const createAccount = new CreateAccount(accountRepository);
new AccountController(httpServer, createAccount);

httpServer.listen(Number(process.env.PORT) || 8080);
