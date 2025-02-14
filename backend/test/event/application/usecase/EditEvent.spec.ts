import { ConflictError } from "../../../../src/account/application/errors/ConflictError";
import { NotFoundError } from "../../../../src/account/application/errors/NotFoundError";
import { Account } from "../../../../src/account/domain/entity/Account";
import { NotEventCreator } from "../../../../src/event/application/errors/NotEventCreator";
import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { EditEvent } from "../../../../src/event/application/usecase/EditEvent";
import { Event } from "../../../../src/event/domain/entity/Event";
import { EventRepositoryMemory } from "../../infra/repository/EventRepositoryMemory";

let eventRepository: EventRepository;
let sut: EditEvent;
let account: Account;
let event: Event;

beforeEach(async () => {
  eventRepository = new EventRepositoryMemory();
  sut = new EditEvent(eventRepository);
  account = Account.create("John", "Doe", "john.doe@example.com", "John@123");
  event = Event.create(
    "Event 1",
    account.getAccountId(),
    "2025-12-21T00:00:00",
    "2025-12-23T00:00:00"
  );
  await eventRepository.save(event);
});

test("Should be possible to edit an event", async function () {
  const input = {
    eventId: event.getEventId(),
    description: "New description",
    accountId: account.getAccountId(),
    startedAt: "2026-01-02T00:00:00",
    finishedAt: "2026-01-03T00:00:00",
  };
  await sut.execute(input);
  const eventUpdated = await eventRepository.findByEventId(input.eventId);
  expect(eventUpdated).toBeDefined();
  expect(eventUpdated?.getDescription()).toEqual(input.description);
  expect(eventUpdated?.getStartedAt()).toEqual(new Date(input.startedAt));
  expect(eventUpdated?.getFinishedAt()).toEqual(new Date(input.finishedAt));
});

test("Should be possible to change some of the data", async function () {
  const input = {
    eventId: event.getEventId(),
    description: "New description",
    accountId: account.getAccountId(),
  };
  await sut.execute(input);
  const eventUpdated = await eventRepository.findByEventId(input.eventId);
  expect(eventUpdated?.getDescription()).toEqual(input.description);
  expect(eventUpdated?.getStartedAt()).toEqual(event.getStartedAt());
  expect(eventUpdated?.getFinishedAt()).toEqual(event.getFinishedAt());
});

test("Should throw an error if the event was not found", function () {
  const input = {
    eventId: crypto.randomUUID(),
    accountId: account.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Event not found.")
  );
});

test("Should throw an error if the accountId does not match the event's accountId", async function () {
  const input = {
    eventId: event.getEventId(),
    accountId: crypto.randomUUID(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotEventCreator("You are not the creator of this event.")
  );
});

test("Should throw an error when the new event date starts before and ends during another event", async function () {
  const event2 = Event.create(
    "Event 2",
    account.getAccountId(),
    "2025-12-21T00:00:00",
    "2025-12-23T00:00:00"
  );
  await eventRepository.save(event2);
  const input = {
    eventId: event2.getEventId(),
    startedAt: "2025-12-20T00:00:00",
    finishedAt: "2025-12-22T00:00:00",
    accountId: account.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new ConflictError(
      "You already have an event taking place at the same time."
    )
  );
});

test("Should throw an error when the new event date starts during another event and ends afterwards", async function () {
  const event2 = Event.create(
    "Event 2",
    account.getAccountId(),
    "2025-12-21T00:00:00",
    "2025-12-23T00:00:00"
  );
  await eventRepository.save(event2);
  const input = {
    eventId: event2.getEventId(),
    startedAt: "2025-12-22T00:00:00",
    finishedAt: "2025-12-24T00:00:00",
    accountId: account.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new ConflictError(
      "You already have an event taking place at the same time."
    )
  );
});

test("Should throw an error when the new event date starts and ends during another event ", async function () {
  const event2 = Event.create(
    "Event 2",
    account.getAccountId(),
    "2025-12-21T00:00:00",
    "2025-12-23T00:00:00"
  );
  await eventRepository.save(event2);
  const input = {
    eventId: event2.getEventId(),
    startedAt: "2025-12-22T00:00:00",
    finishedAt: "2025-12-22T12:00:00",
    accountId: account.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new ConflictError(
      "You already have an event taking place at the same time."
    )
  );
});
