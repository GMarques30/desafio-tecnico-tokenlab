import { Account } from "../../../../src/account/domain/entity/Account";
import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { CreateEvent } from "../../../../src/event/application/usecase/CreateEvent";
import { AccountRepositoryMemory } from "../../../account/infra/repository/AccountRepositoryMemory";
import { EventRepositoryMemory } from "../../infra/repository/EventRepositoryMemory";
import { AccountRepository } from "./../../../../src/account/application/repository/AccountRepository";

let accountRepository: AccountRepository;
let eventRepository: EventRepository;
let sut: CreateEvent;
let account: Account;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  eventRepository = new EventRepositoryMemory();
  sut = new CreateEvent(accountRepository, eventRepository);
  account = Account.create("John", "Doe", "john.doe@example.com", "John@123");
  accountRepository.save(account);
});

test("Should create an event without conflict", async function () {
  const input = {
    description: "Event 1",
    accountId: account.getAccountId(),
    startedAt: "2025-12-21",
    finishedAt: "2025-12-22",
  };
  await sut.execute(input);
  const event = await eventRepository.findByAccountId(account.getAccountId());
  expect(event[0].description).toEqual("Event 1");
});

test("Should throw an error when acount not found", function () {
  const input = {
    description: "Event 1",
    accountId: crypto.randomUUID(),
    startedAt: "2025-12-21",
    finishedAt: "2025-12-22",
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new Error("Account not found.")
  );
});

test("Should throw an error when creating an event that starts before but ends during another event", async function () {
  const input = {
    description: "Event 1",
    accountId: account.getAccountId(),
    startedAt: "2025-12-21T00:00:00",
    finishedAt: "2025-12-23T00:00:00",
  };
  await sut.execute(input);
  const input2 = {
    description: "Event 2",
    accountId: account.getAccountId(),
    startedAt: "2025-12-20T00:00:00",
    finishedAt: "2025-12-22T00:00:00",
  };
  expect(() => sut.execute(input2)).rejects.toThrow(
    new Error("You already have an event taking place at the same time.")
  );
});

test("Should throw an error when creating an event that starts during the event of another event but ends after it", async function () {
  const input = {
    description: "Event 1",
    accountId: account.getAccountId(),
    startedAt: "2025-12-21T00:00:00",
    finishedAt: "2025-12-23T00:00:00",
  };
  await sut.execute(input);
  const input2 = {
    description: "Event 2",
    accountId: account.getAccountId(),
    startedAt: "2025-12-22T00:00:00",
    finishedAt: "2025-12-24T00:00:00",
  };
  expect(() => sut.execute(input2)).rejects.toThrow(
    new Error("You already have an event taking place at the same time.")
  );
});

test("Should throw an error when creating an event that starts and ends during the event of another one", async function () {
  const input = {
    description: "Event 1",
    accountId: account.getAccountId(),
    startedAt: "2025-12-21T00:00:00",
    finishedAt: "2025-12-23T00:00:00",
  };
  await sut.execute(input);
  const input2 = {
    description: "Event 2",
    accountId: account.getAccountId(),
    startedAt: "2025-12-22T00:00:00",
    finishedAt: "2025-12-22T12:00:00",
  };
  expect(() => sut.execute(input2)).rejects.toThrow(
    new Error("You already have an event taking place at the same time.")
  );
});

test("Should throw an error when one event ends during the event of another", async function () {
  const input = {
    description: "Event 1",
    accountId: account.getAccountId(),
    startedAt: "2025-12-21",
    finishedAt: "2025-12-22",
  };
  await sut.execute(input);
  const input2 = {
    description: "Event 2",
    accountId: account.getAccountId(),
    startedAt: "2025-12-20T00:00:00",
    finishedAt: "2025-12-21T00:00:00",
  };
  expect(() => sut.execute(input2)).rejects.toThrow(
    new Error("You already have an event taking place at the same time.")
  );
});
