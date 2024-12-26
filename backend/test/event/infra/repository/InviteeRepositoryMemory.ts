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

  async update(invitee: Invitee): Promise<void> {
    const index = this.invitees.findIndex(
      (inv) => inv.inviteeId === invitee.getInviteeId()
    );
    this.invitees[index] = {
      inviteeId: invitee.getInviteeId(),
      eventId: invitee.getEventId(),
      guestId: invitee.getEventId(),
      inviteeStatus: invitee.getStatus(),
    };
  }

  async findByGuestId(guestId: string): Promise<Invitee[]> {
    return this.invitees
      .filter(
        (invitee) =>
          invitee.guestId === guestId && invitee.inviteeStatus === "PENDING"
      )
      .map((invitee) =>
        Invitee.restore(
          invitee.inviteeId,
          invitee.eventId,
          invitee.guestId,
          invitee.inviteeStatus
        )
      );
  }
}
