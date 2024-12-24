import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { NotInvitedError } from "../errors/NotInvitedError";
import { InviteeRepository } from "../repository/InviteeRepository";

export class DeclineEvent {
  private readonly inviteeRepository: InviteeRepository;

  constructor(inviteeRepository: InviteeRepository) {
    this.inviteeRepository = inviteeRepository;
  }

  async execute(input: DeclineEventInput) {
    const invitee = await this.inviteeRepository.findByInviteeId(
      input.inviteeId
    );
    if (!invitee) {
      throw new NotFoundError("Invitee not found.");
    }
    if (input.guestId !== invitee.getGuestId()) {
      throw new NotInvitedError("This account was not invited to this event.");
    }
    invitee.declined();
    await this.inviteeRepository.update(invitee);
  }
}

interface DeclineEventInput {
  inviteeId: string;
  guestId: string;
}
