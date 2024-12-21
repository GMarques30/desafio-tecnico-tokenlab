import { Event } from "../../../../src/event/domain/entity/Event";

test("Should create an event valid", function () {
  const accountId = crypto.randomUUID();
  const startedAt = "2025-12-21T00:00:00";
  const finishedAt = "2025-12-22T12:00:00";
  const event = Event.create("Event 1", accountId, startedAt, finishedAt);
  expect(event.getEventId()).toBeDefined();
  expect(event.getDescription()).toEqual("Event 1");
  expect(event.getAccountId()).toEqual(accountId);
  expect(event.getStartedAt()).toBeInstanceOf(Date);
  expect(event.getStartedAt()).toEqual(new Date(startedAt));
  expect(event.getFinishedAt()).toBeInstanceOf(Date);
  expect(event.getFinishedAt()).toEqual(new Date(finishedAt));
});

test("Should not possible create a event when started date is greater than finished date", function () {
  const accountId = crypto.randomUUID();
  const startedAt = "2025-12-21T01:00:00";
  const finishedAt = "2025-12-20T00:00:00";
  expect(() => Event.create("Event", accountId, startedAt, finishedAt)).toThrow(
    new Error("The start date cannot be after the finish date.")
  );
});
