import { Status } from "../../domain/vo/InviteeStatus";
import { InviteeRepository } from "../repository/InviteeRepository";

export class GetInvitees {
  private readonly inviteeRepository: InviteeRepository;

  constructor(inviteeRepository: InviteeRepository) {
    this.inviteeRepository = inviteeRepository;
  }

  async execute(input: GetInviteesInput): Promise<GetInviteesOutput> {
    const invitees = await this.inviteeRepository.findByGuestId(input.guestId);
    return {
      invitees: invitees.map((invitee) => ({
        inviteeId: invitee.getInviteeId(),
        eventId: invitee.getEventId(),
        guestId: invitee.getGuestId(),
        inviteeStatus: invitee.getStatus(),
      })),
    };
  }
}

interface GetInviteesInput {
  guestId: string;
}

interface GetInviteesOutput {
  invitees: {
    inviteeId: string;
    eventId: string;
    guestId: string;
    inviteeStatus: Status;
  }[];
}
