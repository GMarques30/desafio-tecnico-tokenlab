import { NotFoundError } from "../../../../src/account/application/errors/NotFoundError";
import { Account } from "../../../../src/account/domain/entity/Account";
import { NotInvitedError } from "../../../../src/event/application/errors/NotInvitedError";
import { InviteeRepository } from "../../../../src/event/application/repository/InviteeRepository";
import { DeclineEvent } from "../../../../src/event/application/usecase/DeclineEvent";
import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { AccountRepositoryMemory } from "../../../account/infra/repository/AccountRepositoryMemory";
import { InviteeRepositoryMemory } from "../../infra/repository/InviteeRepositoryMemory";

let inviteeRepository: InviteeRepository;
let sut: DeclineEvent;
let guest: Account;
let invitee: Invitee;

beforeEach(async () => {
  inviteeRepository = new InviteeRepositoryMemory();
  const accountRepository = new AccountRepositoryMemory();
  sut = new DeclineEvent(inviteeRepository);
  guest = Account.create("John", "Doe", "john.doe@example.com", "John@123");
  await accountRepository.save(guest);
  invitee = Invitee.create(crypto.randomUUID(), guest.getAccountId());
  await inviteeRepository.save(invitee);
});

test("Should be possible to decline an invitation to an event", async function () {
  const input = {
    inviteeId: invitee.getInviteeId(),
    guestId: guest.getAccountId(),
  };
  await sut.execute(input);
  const inviteeData = await inviteeRepository.findByInviteeId(
    invitee.getInviteeId()
  );
  expect(inviteeData?.getStatus()).toEqual("DECLINED");
});

test("Should throw an error if the invitation is not found", function () {
  const input = {
    inviteeId: crypto.randomUUID(),
    guestId: guest.getAccountId(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Invitee not found.")
  );
});

test("Should throw an error if the guest identifier is different from the one on the invitation", function () {
  const input = {
    inviteeId: invitee.getInviteeId(),
    guestId: crypto.randomUUID(),
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotInvitedError("This account was not invited to this event.")
  );
});
