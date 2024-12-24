import "dotenv/config";

import express, { Router } from "express";
import { AccountRepositoryMemory } from "../test/account/infra/repository/AccountRepositoryMemory";
import { EventRepositoryMemory } from "../test/event/infra/repository/EventRepositoryMemory";
import { InviteeRepositoryMemory } from "../test/event/infra/repository/InviteeRepositoryMemory";
import { Authentication } from "./account/application/usecase/Authentication";
import { CreateAccount } from "./account/application/usecase/CreateAccount";
import { JWTAuth } from "./account/infra/auth/AuthProvider";
import { AccountController } from "./account/infra/controller/AccountController";
import { PgPromiseAdapter } from "./account/infra/database/Connection";
import { AcceptEvent } from "./event/application/usecase/AcceptEvent";
import { CreateEvent } from "./event/application/usecase/CreateEvent";
import { DeclineEvent } from "./event/application/usecase/DeclineEvent";
import { EditEvent } from "./event/application/usecase/EditEvent";
import { GetEvents } from "./event/application/usecase/GetEvents";
import { InviteEvent } from "./event/application/usecase/InviteEvent";
import { RemoveEvent } from "./event/application/usecase/RemoveEvent";
import { EventController } from "./event/infra/controller/EventController";

const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryMemory();
const eventRepository = new EventRepositoryMemory();
const inviteeRepository = new InviteeRepositoryMemory();

const authProvider = new JWTAuth();
const createAccount = new CreateAccount(accountRepository);
const authentication = new Authentication(accountRepository, authProvider);
const createEvent = new CreateEvent(eventRepository);
const editEvent = new EditEvent(eventRepository);
const removeEvent = new RemoveEvent(eventRepository);
const getEvents = new GetEvents(eventRepository);
const inviteEvent = new InviteEvent(
  accountRepository,
  eventRepository,
  inviteeRepository
);
const acceptEvent = new AcceptEvent(inviteeRepository);
const declineEvent = new DeclineEvent(inviteeRepository);

const accountController = new AccountController(createAccount, authentication);
const eventController = new EventController(
  createEvent,
  editEvent,
  removeEvent,
  getEvents,
  inviteEvent,
  acceptEvent,
  declineEvent
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
routes.post("/events/:eventId/invite", (req, res) =>
  eventController.invite(req, res)
);
routes.patch("/invitee/:inviteeId/accept", (req, res) =>
  eventController.accept(req, res)
);
routes.patch("/invitee/:inviteeId/decline", (req, res) =>
  eventController.decline(req, res)
);

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
