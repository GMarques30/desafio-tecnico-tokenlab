import { GetEvents } from "../../../../src/event/application/usecase/GetEvents";
import { Event } from "../../../../src/event/domain/entity/Event";
import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { EventDAOMemory } from "../../infra/dao/EventDAOMemory";

let eventDAO: EventDAOMemory;
let sut: GetEvents;
let accountId1: string;
let accountId2: string;
let event1: Event;
let event2: Event;
let event3: Event;

beforeEach(() => {
  eventDAO = new EventDAOMemory();
  sut = new GetEvents(eventDAO);
  accountId1 = crypto.randomUUID();
  accountId2 = crypto.randomUUID();
  event1 = Event.create(
    "Event 1",
    crypto.randomUUID(),
    "2025-12-24T00:00:00",
    "2025-12-26T00:00:00"
  );
  eventDAO.save({
    eventId: event1.getEventId(),
    description: event1.getDescription(),
    accountId: event1.getAccountId(),
    startedAt: event1.getStartedAt(),
    finishedAt: event1.getFinishedAt(),
  });
  event2 = Event.create(
    "Event 2",
    crypto.randomUUID(),
    "2025-12-27T00:00:00",
    "2025-12-28T00:00:00"
  );
  eventDAO.save({
    eventId: event2.getEventId(),
    description: event2.getDescription(),
    accountId: event2.getAccountId(),
    startedAt: event2.getStartedAt(),
    finishedAt: event2.getFinishedAt(),
  });
  event3 = Event.create(
    "Event 3",
    accountId1,
    "2025-12-29T00:00:00",
    "2025-12-31T00:00:00"
  );
  eventDAO.save({
    eventId: event3.getEventId(),
    description: event3.getDescription(),
    accountId: event3.getAccountId(),
    startedAt: event3.getStartedAt(),
    finishedAt: event3.getFinishedAt(),
  });
  const invitee1 = Invitee.create(event1.getEventId(), accountId1);
  invitee1.accepted();
  eventDAO.saveInvitee(invitee1);
  const invitee2 = Invitee.create(event2.getEventId(), accountId2);
  eventDAO.saveInvitee(invitee2);
  const invitee3 = Invitee.create(event2.getEventId(), accountId1);
  invitee3.accepted();
  eventDAO.saveInvitee(invitee3);
});

test("Should return all events created and accepted by that account", async function () {
  const input = {
    accountId: accountId1,
  };
  const { events } = await sut.execute(input);
  expect(events).toHaveLength(3);
  expect(events).toEqual([
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
    expect.objectContaining({
      eventId: event3.getEventId(),
      description: event3.getDescription(),
      accountId: event3.getAccountId(),
      startedAt: event3.getStartedAt(),
      finishedAt: event3.getFinishedAt(),
    }),
  ]);
});

test("Should return empty if there are no events", async function () {
  const input = {
    accountId: crypto.randomUUID(),
  };
  const { events } = await sut.execute(input);
  expect(events).toHaveLength(0);
  expect(events).toEqual([]);
});
