import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import {
  AcceptedStatus,
  DeclinedStatus,
  PendingStatus,
  Status,
} from "../../../../src/event/domain/vo/InviteeStatus";

let invitee: Invitee;

beforeEach(() => {
  invitee = Invitee.create(crypto.randomUUID(), crypto.randomUUID());
});

test("Should be possible to create an invitation", function () {
  expect(invitee.getInviteeId()).toBeDefined();
  expect(invitee.getInviteeId()).toEqual(expect.any(String));
  expect(invitee.getEventId()).toBeDefined();
  expect(invitee.getEventId()).toEqual(expect.any(String));
  expect(invitee.getGuestId()).toBeDefined();
  expect(invitee.getGuestId()).toEqual(expect.any(String));
  expect(invitee.inviteeStatus).toBeInstanceOf(PendingStatus);
  expect(invitee.getStatus()).toEqual("PENDING");
});

test("Should be possible to restore an invitation", function () {
  const inviteeId = crypto.randomUUID();
  const eventId = crypto.randomUUID();
  const guestId = crypto.randomUUID();
  const inviteeStatus = "PENDING";
  const inviteeRestore = Invitee.restore(
    inviteeId,
    eventId,
    guestId,
    inviteeStatus as Status
  );
  expect(inviteeRestore.getInviteeId()).toEqual(inviteeId);
  expect(inviteeRestore.getEventId()).toEqual(eventId);
  expect(inviteeRestore.getGuestId()).toEqual(guestId);
  expect(inviteeRestore.inviteeStatus).toBeInstanceOf(PendingStatus);
  expect(inviteeRestore.getStatus()).toEqual(inviteeStatus);
});

test("Should change the status to accepted", function () {
  invitee.accepted();
  expect(invitee.inviteeStatus).toBeInstanceOf(AcceptedStatus);
  expect(invitee.getStatus()).toEqual("ACCEPTED");
});

test("Should change the status to declined", function () {
  invitee.declined();
  expect(invitee.inviteeStatus).toBeInstanceOf(DeclinedStatus);
  expect(invitee.getStatus()).toEqual("DECLINED");
});
