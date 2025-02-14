import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { NotInvitedError } from "../errors/NotInvitedError";
import { InviteeRepository } from "../repository/InviteeRepository";

export class AcceptEvent {
  private readonly inviteeRepository: InviteeRepository;

  constructor(inviteeRepository: InviteeRepository) {
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
      throw new NotInvitedError("This account was not invited to this event.");
    }
    invitee.accepted();
    await this.inviteeRepository.update(invitee);
  }
}

interface AcceptEventInput {
  inviteeId: string;
  guestId: string;
}
