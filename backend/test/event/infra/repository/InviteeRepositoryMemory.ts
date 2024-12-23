import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { Status } from "../../../../src/event/domain/vo/InviteeStatus";
import { InviteeRepository } from "./../../../../src/event/application/repository/InviteeRepository";

export class InviteeRepositoryMemory implements InviteeRepository {
  private readonly invitees: {
    inviteeId: string;
    eventId: string;
    guestId: string;
    inviteeStatus: Status;
  }[];

  constructor() {
    this.invitees = [];
  }

  async save(invitee: Invitee): Promise<void> {
    this.invitees.push({
      inviteeId: invitee.getInviteeId(),
      eventId: invitee.getEventId(),
      guestId: invitee.getGuestId(),
      inviteeStatus: invitee.getStatus(),
    });
  }

  async findByInviteeId(inviteeId: string): Promise<Invitee | undefined> {
    const data = this.invitees.find(
      (invitee) => invitee.inviteeId === inviteeId
    );
    if (!data) return undefined;
    return Invitee.restore(
      data.inviteeId,
      data.eventId,
      data.guestId,
      data.inviteeStatus
    );
  }
}
