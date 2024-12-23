import { ConflictError } from "../../../account/application/errors/ConflictError";
import { ValidationError } from "../../../account/application/errors/ValidationError";
import { Invitee } from "../entity/Invitee";

export enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export abstract class InviteeStatus {
  readonly invitee: Invitee;
  abstract status: Status;

  constructor(invitee: Invitee) {
    this.invitee = invitee;
  }

  abstract accepted(): void;
  abstract declined(): void;
}

export class PendingStatus extends InviteeStatus {
  status: Status;

  constructor(invitee: Invitee) {
    super(invitee);
    this.status = Status.PENDING;
  }

  accepted(): void {
    this.invitee.inviteeStatus = new AcceptedStatus(this.invitee);
  }
  declined(): void {
    this.invitee.inviteeStatus = new DeclinedStatus(this.invitee);
  }
}

export class AcceptedStatus extends InviteeStatus {
  status: Status;

  constructor(invitee: Invitee) {
    super(invitee);
    this.status = Status.ACCEPTED;
  }

  accepted(): void {
    throw new ConflictError("Action not allowed in the current status.");
  }
  declined(): void {
    throw new ConflictError("Action not allowed in the current status.");
  }
}

export class DeclinedStatus extends InviteeStatus {
  status: Status;

  constructor(invitee: Invitee) {
    super(invitee);
    this.status = Status.DECLINED;
  }

  accepted(): void {
    throw new ConflictError("Action not allowed in the current status.");
  }
  declined(): void {
    throw new ConflictError("Action not allowed in the current status.");
  }
}

export class InviteeStatusFactory {
  static create(invitee: Invitee, status: Status) {
    if (status === Status.PENDING) return new PendingStatus(invitee);
    if (status === Status.ACCEPTED) return new AcceptedStatus(invitee);
    if (status === Status.DECLINED) return new DeclinedStatus(invitee);
    throw new ValidationError("Invalid status.");
  }
}
