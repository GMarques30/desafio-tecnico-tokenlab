import { NotFoundError } from "../../../../src/account/application/exception/NotFoundError";
import { AccountRepository } from "../../../../src/account/application/repository/AccountRepository";
import { Account } from "../../../../src/account/domain/entity/Account";
import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { RemoveEvent } from "../../../../src/event/application/usecase/RemoveEvent";
import { Event } from "../../../../src/event/domain/entity/Event";
import { AccountRepositoryMemory } from "../../../account/infra/repository/AccountRepositoryMemory";
import { EventRepositoryMemory } from "../../infra/repository/EventRepositoryMemory";

let eventRepository: EventRepository;
let accountRepository: AccountRepository;
let sut: RemoveEvent;
let account: Account;
let event: Event;

beforeEach(async () => {
  eventRepository = new EventRepositoryMemory();
  accountRepository = new AccountRepositoryMemory();
  sut = new RemoveEvent(accountRepository, eventRepository);
  account = Account.create("John", "Doe", "john.doe@example.com", "John@123");
  await accountRepository.save(account);
  event = Event.create(
    "Event 1",
    account.getAccountId(),
    "2025-12-20T00:00:00",
    "2025-12-23T00:00:00"
  );
  await eventRepository.save(event);
});

test("Should be possible to remove an event", async function () {
  const input = {
    eventId: event.getEventId(),
    accountId: account.getAccountId(),
  };
  await sut.execute(input);
  const eventData = await eventRepository.findByEventId(input.eventId);
  expect(eventData).toEqual(undefined);
});

test("Should throw an error if the account is not found", function () {
  const input = {
    eventId: event.getEventId(),
    accountId: crypto.randomUUID(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Account not found.")
  );
});

test("Should throw an error if the event is not found", function () {
  const input = {
    eventId: crypto.randomUUID(),
    accountId: account.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Event not found.")
  );
});

test("Should throw an error when you remove it if it wasn't that account that created the event", async function () {
  const newAccount = Account.create(
    "John",
    "Doe",
    "john.doe2@example.com",
    "Doe@1234"
  );
  await accountRepository.save(newAccount);
  const input = {
    eventId: event.getEventId(),
    accountId: newAccount.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new Error("You are not the creator of this event.")
  );
});
