import { NotFoundError } from "../../../../src/account/application/errors/NotFoundError";
import { AccountRepository } from "../../../../src/account/application/repository/AccountRepository";
import { Account } from "../../../../src/account/domain/entity/Account";
import { AcceptEvent } from "../../../../src/event/application/usecase/AcceptEvent";
import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { AccountRepositoryMemory } from "../../../account/infra/repository/AccountRepositoryMemory";
import { InviteeRepositoryMemory } from "../../infra/repository/InviteeRepositoryMemory";
import { InviteeRepository } from "./../../../../src/event/application/repository/InviteeRepository";

let inviteeRepository: InviteeRepository;
let accountRepository: AccountRepository;
let sut: AcceptEvent;
let guest: Account;
let invitee: Invitee;

beforeEach(async () => {
  inviteeRepository = new InviteeRepositoryMemory();
  accountRepository = new AccountRepositoryMemory();
  sut = new AcceptEvent(accountRepository, inviteeRepository);
  guest = Account.create("John", "Doe", "john.doe@example.com", "John@123");
  await accountRepository.save(guest);
  invitee = Invitee.create(crypto.randomUUID(), guest.getAccountId());
  await inviteeRepository.save(invitee);
});

test("Should be possible to accept an invitation to an event", async function () {
  const input = {
    inviteeId: invitee.getInviteeId(),
    guestId: guest.getAccountId(),
  };
  await sut.execute(input);
  const inviteeData = await inviteeRepository.findByInviteeId(
    invitee.getInviteeId()
  );
  expect(inviteeData?.getStatus()).toEqual("ACCEPTED");
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
    new Error("This account was not invited to this event.")
  );
});
