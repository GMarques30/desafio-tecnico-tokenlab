import { EventDAO } from "../../../../src/event/application/dao/EventDAO";
import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { Status } from "../../../../src/event/domain/vo/InviteeStatus";

export class EventDAOMemory implements EventDAO {
  private readonly events: {
    eventId: string;
    description: string;
    accountId: string;
    startedAt: Date;
    finishedAt: Date;
  }[];

  private readonly invitees: {
    inviteeId: string;
    eventId: string;
    guestId: string;
    inviteeStatus: Status;
  }[];

  constructor() {
    this.events = [];
    this.invitees = [];
  }

  async save(event: {
    eventId: string;
    description: string;
    accountId: string;
    startedAt: Date;
    finishedAt: Date;
  }): Promise<void> {
    this.events.push({
      ...event,
    });
  }

  async findByAccountIdQuery(accountId: string): Promise<
    {
      eventId: string;
      description: string;
      accountId: string;
      startedAt: Date;
      finishedAt: Date;
    }[]
  > {
    return this.events.filter(
      (event) =>
        event.accountId === accountId ||
        this.invitees.some(
          (invitee) =>
            invitee.eventId === event.eventId &&
            invitee.guestId === accountId &&
            invitee.inviteeStatus === "ACCEPTED"
        )
    );
  }

  async saveInvitee(invitee: Invitee): Promise<void> {
    this.invitees.push({
      inviteeId: invitee.getInviteeId(),
      eventId: invitee.getEventId(),
      guestId: invitee.getGuestId(),
      inviteeStatus: invitee.getStatus(),
    });
  }

  async findByInviteeId(inviteeId: string): Promise<Invitee | undefined> {
    const invitee = this.invitees.find(
      (invitee) => invitee.inviteeId === inviteeId
    );
    if (!invitee) return undefined;
    return Invitee.restore(
      invitee.inviteeId,
      invitee.eventId,
      invitee.guestId,
      invitee.inviteeStatus
    );
  }

  async update(invitee: Invitee): Promise<void> {
    const index = this.invitees.findIndex(
      (inviteeDate) => inviteeDate.inviteeId === invitee.getInviteeId()
    );
    this.invitees[index] = {
      inviteeId: invitee.getInviteeId(),
      eventId: invitee.getEventId(),
      guestId: invitee.getGuestId(),
      inviteeStatus: invitee.getStatus(),
    };
  }
}
