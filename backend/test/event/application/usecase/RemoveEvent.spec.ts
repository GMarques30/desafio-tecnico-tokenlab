import { NotFoundError } from "../../../../src/account/application/errors/NotFoundError";
import { Account } from "../../../../src/account/domain/entity/Account";
import { NotEventCreator } from "../../../../src/event/application/errors/NotEventCreator";
import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { RemoveEvent } from "../../../../src/event/application/usecase/RemoveEvent";
import { Event } from "../../../../src/event/domain/entity/Event";
import { EventRepositoryMemory } from "../../infra/repository/EventRepositoryMemory";

let eventRepository: EventRepository;
let sut: RemoveEvent;
let account: Account;
let event: Event;

beforeEach(async () => {
  eventRepository = new EventRepositoryMemory();
  sut = new RemoveEvent(eventRepository);
  account = Account.create("John", "Doe", "john.doe@example.com", "John@123");
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
  const input = {
    eventId: event.getEventId(),
    accountId: crypto.randomUUID(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotEventCreator("You are not the creator of this event.")
  );
});
