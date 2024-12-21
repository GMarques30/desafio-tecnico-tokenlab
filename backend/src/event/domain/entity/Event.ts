import { UUID } from "../../../account/domain/vo/UUID";
import { Period } from "../vo/Period";

export class Event {
  private readonly eventId: UUID;
  private description: string;
  private accountId: UUID;
  private period: Period;

  private constructor(
    eventId: UUID,
    description: string,
    accountId: UUID,
    period: Period
  ) {
    this.eventId = eventId;
    this.description = description;
    this.accountId = accountId;
    this.period = period;
  }

  static create(
    description: string,
    accountId: string,
    startedAt: string,
    finishedAt: string
  ) {
    const eventId = UUID.create();
    const accId = new UUID(accountId);
    const period = new Period(startedAt, finishedAt);
    return new Event(eventId, description, accId, period);
  }

  static restore(
    eventId: string,
    description: string,
    accountId: string,
    startedAt: Date,
    finishedAt: Date
  ) {
    const evId = new UUID(eventId);
    const accId = new UUID(accountId);
    const period = new Period(startedAt, finishedAt);
    return new Event(evId, description, accId, period);
  }

  getEventId() {
    return this.eventId.getUUID();
  }

  getDescription() {
    return this.description;
  }

  setDescription(description: string) {
    this.description = description;
  }

  getAccountId() {
    return this.accountId.getUUID();
  }

  getStartedAt() {
    return this.period.getStartedAt();
  }

  getFinishedAt() {
    return this.period.getFinishedAt();
  }

  setPeriod(startedAt: string | Date, finishedAt: string | Date) {
    this.period = new Period(startedAt, finishedAt);
  }
}
