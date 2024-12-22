import { NotFoundError } from "../../../../src/account/application/exception/NotFoundError";
import { AccountRepository } from "../../../../src/account/application/repository/AccountRepository";
import { Account } from "../../../../src/account/domain/entity/Account";
import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { GetEvents } from "../../../../src/event/application/usecase/GetEvents";
import { Event } from "../../../../src/event/domain/entity/Event";
import { AccountRepositoryMemory } from "../../../account/infra/repository/AccountRepositoryMemory";
import { EventRepositoryMemory } from "../../infra/repository/EventRepositoryMemory";

let accountRepository: AccountRepository;
let eventRepository: EventRepository;
let sut: GetEvents;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  eventRepository = new EventRepositoryMemory();
  sut = new GetEvents(accountRepository, eventRepository);
});

test("Should be possible to return all events for this account", async function () {
  const account = Account.create(
    "John",
    "Doe",
    "john.doe@example.com",
    "John@123"
  );
  await accountRepository.save(account);
  const event1 = Event.create(
    "Event 1",
    account.getAccountId(),
    "2025-12-20T00:00:00",
    "2025-12-23T00:00:00"
  );
  const event2 = Event.create(
    "Event 2",
    account.getAccountId(),
    "2025-12-24T00:00:00",
    "2025-12-27T00:00:00"
  );
  await eventRepository.save(event1);
  await eventRepository.save(event2);
  const input = {
    accountId: account.getAccountId(),
  };
  const allEvents = await sut.execute(input);
  expect(allEvents.events).toHaveLength(2);
  expect(allEvents).toEqual(
    expect.objectContaining({
      events: [
        expect.objectContaining({
          eventId: event1.getEventId(),
          description: event1.getDescription(),
          accountId: event1.getAccountId(),
          startedAt: event1.getStartedAt(),
          finishedAt: event1.getFinishedAt(),
        }),
        expect.objectContaining({
          eventId: event2.getEventId(),
          description: event2.getDescription(),
          accountId: event2.getAccountId(),
          startedAt: event2.getStartedAt(),
          finishedAt: event2.getFinishedAt(),
        }),
      ],
    })
  );
});

test("Should throw an error when the account is not found", function () {
  const input = {
    accountId: crypto.randomUUID(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Account not found.")
  );
});
