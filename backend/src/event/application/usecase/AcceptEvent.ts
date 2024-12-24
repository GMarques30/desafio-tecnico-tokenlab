import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { AccountRepository } from "../../../account/application/repository/AccountRepository";
import { InviteeRepository } from "../repository/InviteeRepository";

export class AcceptEvent {
  private readonly accountRepository: AccountRepository;
  private readonly inviteeRepository: InviteeRepository;

  constructor(
    accountRepository: AccountRepository,
    inviteeRepository: InviteeRepository
  ) {
    this.accountRepository = accountRepository;
    this.inviteeRepository = inviteeRepository;
  }

  async execute(input: AcceptEventInput): Promise<void> {
    const invitee = await this.inviteeRepository.findByInviteeId(
      input.inviteeId
    );
    if (!invitee) {
      throw new NotFoundError("Invitee not found.");
    }
    if (input.guestId !== invitee.getGuestId()) {
      throw new Error("This account was not invited to this event.");
    }
    invitee.accepted();
    await this.inviteeRepository.update(invitee);
  }
}

interface AcceptEventInput {
  inviteeId: string;
  guestId: string;
}
