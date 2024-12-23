import { UUID } from "../../../account/domain/vo/UUID";
import {
  InviteeStatus,
  InviteeStatusFactory,
  Status,
} from "../vo/InviteeStatus";

export class Invitee {
  private inviteeId: UUID;
  private eventId: UUID;
  private guestId: UUID;
  inviteeStatus: InviteeStatus;

  private constructor(
    inviteeId: UUID,
    eventId: UUID,
    guestId: UUID,
    inviteeStatus: Status
  ) {
    this.inviteeId = inviteeId;
    this.eventId = eventId;
    this.guestId = guestId;
    this.inviteeStatus = InviteeStatusFactory.create(this, inviteeStatus);
  }

  static create(eventId: string, guestId: string) {
    const inviteeId = UUID.create();
    const evId = new UUID(eventId);
    const guestIdentifier = new UUID(guestId);
    return new Invitee(inviteeId, evId, guestIdentifier, "PENDING" as Status);
  }

  static restore(
    inviteeId: string,
    eventId: string,
    guestId: string,
    inviteeStatus: Status
  ) {
    const invId = new UUID(inviteeId);
    const evId = new UUID(eventId);
    const accId = new UUID(guestId);
    return new Invitee(invId, evId, accId, inviteeStatus);
  }

  getInviteeId() {
    return this.inviteeId.getUUID();
  }

  getEventId() {
    return this.eventId.getUUID();
  }

  getGuestId() {
    return this.guestId.getUUID();
  }

  getStatus() {
    return this.inviteeStatus.status;
  }

  accepted() {
    this.inviteeStatus.accepted();
  }

  declined() {
    this.inviteeStatus.declined();
  }
}
