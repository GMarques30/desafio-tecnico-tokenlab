import "dotenv/config";

import express, { Router } from "express";
import { AccountRepositoryMemory } from "../test/account/infra/repository/AccountRepositoryMemory";
import { Authentication } from "./account/application/usecase/Authentication";
import { CreateAccount } from "./account/application/usecase/CreateAccount";
import { JWTAuth } from "./account/infra/auth/AuthProvider";
import { AccountController } from "./account/infra/controller/AccountController";
import { PgPromiseAdapter } from "./account/infra/database/Connection";

const connection = new PgPromiseAdapter();
const authProvider = new JWTAuth();
const accountRepository = new AccountRepositoryMemory();
const createAccount = new CreateAccount(accountRepository);
const authentication = new Authentication(accountRepository, authProvider);
const accountController = new AccountController(createAccount, authentication);

const routes = Router();
const app = express();
app.use(express.json());

routes.post("/signup", (req, res) => accountController.create(req, res)); // Rota pública

routes.use((req, res, next) => authProvider.checkToken(req, res, next));

routes.post("/login", (req, res) => accountController.login(req, res)); // Rota privada
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
