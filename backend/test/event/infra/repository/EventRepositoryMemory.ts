import { EventRepository } from "../../../../src/event/application/repository/EventRepository";
import { Event } from "../../../../src/event/domain/entity/Event";

export class EventRepositoryMemory implements EventRepository {
  private readonly events: {
    eventId: string;
    description: string;
    accountId: string;
    startedAt: Date;
    finishedAt: Date;
  }[];

  constructor() {
    this.events = [];
  }

  async save(event: Event): Promise<void> {
    this.events.push({
      eventId: event.getEventId(),
      description: event.getDescription(),
      accountId: event.getAccountId(),
      startedAt: event.getStartedAt(),
      finishedAt: event.getFinishedAt(),
    });
  }

  async checkEventConflict(event: Event): Promise<boolean> {
    const eventConflictExists = this.events.find(
      (ev) =>
        ev.eventId !== event.getEventId() &&
        ev.accountId === event.getAccountId() &&
        ((ev.startedAt < event.getFinishedAt() &&
          ev.finishedAt > event.getStartedAt()) ||
          (ev.startedAt <= event.getStartedAt() &&
            ev.finishedAt >= event.getFinishedAt()))
    );

    return eventConflictExists !== undefined;
  }

  async findByAccountId(accountId: string): Promise<
    {
      eventId: string;
      description: string;
      accountId: string;
      startedAt: Date;
      finishedAt: Date;
    }[]
  > {
    const events = this.events.filter((event) => event.accountId === accountId);
    return events;
  }

  async findByEventId(eventId: string): Promise<Event | undefined> {
    const event = this.events.find((event) => event.eventId === eventId);
    if (!event) return undefined;
    return Event.restore(
      event.eventId,
      event.description,
      event.accountId,
      event.startedAt,
      event.finishedAt
    );
  }

  async update(event: Event): Promise<void> {
    const index = this.events.findIndex(
      (ev) => ev.eventId === event.getEventId()
    );
    this.events[index] = {
      eventId: event.getEventId(),
      description: event.getDescription(),
      accountId: event.getAccountId(),
      startedAt: event.getStartedAt(),
      finishedAt: event.getFinishedAt(),
    };
  }

  async remove(eventId: string): Promise<void> {
    const index = this.events.findIndex((event) => event.eventId === eventId);
    if (index === -1) {
      return;
    }
    this.events.splice(index, 1);
  }
}
