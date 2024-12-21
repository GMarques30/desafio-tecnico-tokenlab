import { Connection } from "../../../account/infra/database/Connection";
import { Event } from "../../domain/entity/Event";
import { EventRepository } from "./../../application/repository/EventRepository";

export class EventRepositoryDatabase implements EventRepository {
  private readonly connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async save(event: Event): Promise<void> {
    await this.connection.query(
      "INSERT INTO event (event_id, description, account_id, started_at, finished_at) VALUES ($1, $2, $3, $4, $5)",
      [
        event.getEventId(),
        event.getDescription(),
        event.getAccountId(),
        event.getStartedAt(),
        event.getFinishedAt(),
      ]
    );
  }

  // "SELECT COUNT(*) FROM events WHERE event_id != $1 AND account_id = $2 AND ((started_at < $3 AND finished_at > $4))"
  async checkEventConflict(event: Event): Promise<boolean> {
    const eventConflictExists = await this.connection.query(
      "SELECT COUNT(*) FROM events WHERE event_id != $1 AND account_id = $2 AND ((started_at < $4 AND finished_at > $3) OR (started_at <= $3 AND finished_at >= $4))",
      [
        event.getEventId(),
        event.getAccountId(),
        event.getStartedAt(),
        event.getFinishedAt(),
      ]
    );
    return eventConflictExists > 0;
  }

  async findByAccountId(accountId: string): Promise<Event | undefined> {
    const event = await this.connection.query(
      "SELECT * FROM events WHERE account_id = $1",
      [accountId]
    );
    if (!event) return undefined;
    return Event.restore(
      event.eventId,
      event.description,
      event.acountId,
      event.startedAt,
      event.finishedAt
    );
  }

  async findByEventId(eventId: string): Promise<Event | undefined> {
    const event = await this.connection.query(
      "SELECT * FROM events WHERE event_id = $1",
      [eventId]
    );
    if (!event) return undefined;
    return Event.restore(
      event.eventId,
      event.description,
      event.acountId,
      event.startedAt,
      event.finishedAt
    );
  }

  async update(event: Event): Promise<void> {
    await this.connection.query(
      "UPDATE events SET description = $2, account_id = $3, started_at = $4, finished_at = $5 WHERE event_id = $1",
      [
        event.getEventId(),
        event.getDescription(),
        event.getAccountId(),
        event.getStartedAt(),
        event.getFinishedAt(),
      ]
    );
  }
}
