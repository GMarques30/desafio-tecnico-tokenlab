import { NotFoundError } from "../../../../src/account/application/errors/NotFoundError";
import { AccountRepository } from "../../../../src/account/application/repository/AccountRepository";
import { Account } from "../../../../src/account/domain/entity/Account";
import { InvalidGuest } from "../../../../src/event/application/errors/InvalidGuest";
import { NotEventCreator } from "../../../../src/event/application/errors/NotEventCreator";
import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { InviteeRepository } from "../../../../src/event/application/repository/InviteeRepository";
import { InviteEvent } from "../../../../src/event/application/usecase/InviteEvent";
import { Event } from "../../../../src/event/domain/entity/Event";
import { AccountRepositoryMemory } from "../../../account/infra/repository/AccountRepositoryMemory";
import { EventRepositoryMemory } from "../../infra/repository/EventRepositoryMemory";
import { InviteeRepositoryMemory } from "../../infra/repository/InviteeRepositoryMemory";

let inviteeRepository: InviteeRepository;
let eventRepository: EventRepository;
let accountRepository: AccountRepository;
let sut: InviteEvent;
let account: Account;
let guest: Account;
let event: Event;

beforeEach(async () => {
  inviteeRepository = new InviteeRepositoryMemory();
  eventRepository = new EventRepositoryMemory();
  accountRepository = new AccountRepositoryMemory();
  sut = new InviteEvent(accountRepository, eventRepository, inviteeRepository);
  account = Account.create("John", "Doe", "john.doe@example.com", "John@123");
  guest = Account.create("Jane", "Smith", "jane.smith@example.com", "Jane@456");
  await accountRepository.save(guest);
  event = Event.create(
    "Event 1",
    account.getAccountId(),
    "2025-12-23T00:00:00",
    "2025-12-28T00:00:00"
  );
  await eventRepository.save(event);
});

test("Should be possible to create an invitation to an event", async function () {
  const input = {
    accountId: account.getAccountId(),
    eventId: event.getEventId(),
    guestId: guest.getAccountId(),
  };
  const { inviteeId } = await sut.execute(input);
  expect(inviteeId).toBeDefined();
  expect(inviteeId).toEqual(expect.any(String));
  const invitee = await inviteeRepository.findByInviteeId(inviteeId);
  expect(invitee?.getInviteeId()).toEqual(inviteeId);
  expect(invitee?.getEventId()).toEqual(input.eventId);
  expect(invitee?.getGuestId()).toEqual(input.guestId);
  expect(invitee?.getStatus()).toEqual("PENDING");
});

test("Should throw an error if the guestId is the same as the event creator", function () {
  const input = {
    accountId: account.getAccountId(),
    eventId: event.getEventId(),
    guestId: account.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new InvalidGuest("The event owner cannot invite themselves as a guest.")
  );
});

test("Should throw an error if the event is not found", function () {
  const input = {
    accountId: account.getAccountId(),
    eventId: crypto.randomUUID(),
    guestId: guest.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Event not found.")
  );
});

test("Should throw an error if the account you are inviting is not the owner of the event", async function () {
  const input = {
    accountId: crypto.randomUUID(),
    eventId: event.getEventId(),
    guestId: guest.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotEventCreator("You are not the creator of this event.")
  );
});

test("Should throw an error if the guest is not found", function () {
  const input = {
    accountId: account.getAccountId(),
    eventId: event.getEventId(),
    guestId: crypto.randomUUID(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Guest account not found.")
  );
});
