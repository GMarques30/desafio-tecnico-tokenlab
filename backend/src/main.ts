import "dotenv/config";

import express, { Router } from "express";
import { AccountRepositoryMemory } from "../test/account/infra/repository/AccountRepositoryMemory";
import { EventRepositoryMemory } from "../test/event/infra/repository/EventRepositoryMemory";
import { Authentication } from "./account/application/usecase/Authentication";
import { CreateAccount } from "./account/application/usecase/CreateAccount";
import { JWTAuth } from "./account/infra/auth/AuthProvider";
import { AccountController } from "./account/infra/controller/AccountController";
import { PgPromiseAdapter } from "./account/infra/database/Connection";
import { CreateEvent } from "./event/application/usecase/CreateEvent";
import { EditEvent } from "./event/application/usecase/EditEvent";
import { GetEvents } from "./event/application/usecase/GetEvents";
import { RemoveEvent } from "./event/application/usecase/RemoveEvent";
import { EventController } from "./event/infra/controller/EventController";

const connection = new PgPromiseAdapter();
const authProvider = new JWTAuth();
const accountRepository = new AccountRepositoryMemory();
const createAccount = new CreateAccount(accountRepository);
const authentication = new Authentication(accountRepository, authProvider);
const accountController = new AccountController(createAccount, authentication);

const eventRepository = new EventRepositoryMemory();
const createEvent = new CreateEvent(accountRepository, eventRepository);
const editEvent = new EditEvent(accountRepository, eventRepository);
const removeEvent = new RemoveEvent(accountRepository, eventRepository);
const getEvents = new GetEvents(accountRepository, eventRepository);
const eventController = new EventController(
  createEvent,
  editEvent,
  removeEvent,
  getEvents
);

const routes = Router();
const app = express();
app.use(express.json());

routes.post("/signup", (req, res) => accountController.create(req, res));
routes.post("/login", (req, res) => accountController.login(req, res));

routes.use((req, res, next) => authProvider.checkToken(req, res, next));

routes.post("/events", (req, res) => eventController.create(req, res));
routes.put("/events/:eventId", (req, res) => eventController.edit(req, res));
routes.delete("/events/:eventId", (req, res) =>
  eventController.remove(req, res)
);
routes.get("/events", (req, res) => eventController.get(req, res));

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
