import { ConflictError } from "../../../../src/account/application/errors/ConflictError";
import { ValidationError } from "../../../../src/account/application/errors/ValidationError";
import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { Status } from "../../../../src/event/domain/vo/InviteeStatus";

test.each(["PENDING", "ACCEPTED", "DECLINED"])(
  "Should create invitee with valid status %s",
  function (status: string) {
    const invitee = Invitee.restore(
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      status as Status
    );
    expect(invitee.getStatus()).toBe(status);
  }
);

test.each([
  "pending",
  "accepted",
  "declined",
  "done",
  "DONE",
  "invalid",
  "INVALID",
  "",
  " ",
  null,
  undefined,
])(
  "Should throw an invalid status error",
  function (status: string | null | undefined) {
    expect(() =>
      Invitee.restore(
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        status as Status
      )
    ).toThrow(new ValidationError("Invalid status."));
  }
);

test("Should throw an error when trying to accept a status that is already accepted", function () {
  const invitee = Invitee.restore(
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
    "ACCEPTED" as Status
  );
  expect(() => invitee.accepted()).toThrow(
    new ConflictError("Action not allowed in the current status.")
  );
});

test("Should throw an error when trying to decline a status that is already accepted", function () {
  const invitee = Invitee.restore(
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
    "ACCEPTED" as Status
  );
  expect(() => invitee.declined()).toThrow(
    new ConflictError("Action not allowed in the current status.")
  );
});

test("Should throw an error when trying to accept a status that is already declined", function () {
  const invitee = Invitee.restore(
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
    "DECLINED" as Status
  );
  expect(() => invitee.accepted()).toThrow(
    new ConflictError("Action not allowed in the current status.")
  );
});

test("Should throw an error when trying to decline a status that is already declined", function () {
  const invitee = Invitee.restore(
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
    "DECLINED" as Status
  );
  expect(() => invitee.declined()).toThrow(
    new ConflictError("Action not allowed in the current status.")
  );
});
