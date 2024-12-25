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
      "INSERT INTO events (event_id, description, account_id, started_at, finished_at) VALUES ($1, $2, $3, $4, $5)",
      [
        event.getEventId(),
        event.getDescription(),
        event.getAccountId(),
        event.getStartedAt(),
        event.getFinishedAt(),
      ]
    );
  }

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

  async findByAccountId(accountId: string): Promise<Event[]> {
    const eventsData = await this.connection.query(
      "SELECT * FROM events WHERE account_id = $1",
      [accountId]
    );
    const events = [];
    for (const event of eventsData) {
      events.push(
        Event.restore(
          event.event_id,
          event.description,
          event.account_id,
          event.started_at,
          event.finished_at
        )
      );
    }
    return events;
  }

  async findByEventId(eventId: string): Promise<Event | undefined> {
    const event = await this.connection.query(
      "SELECT * FROM events WHERE event_id = $1",
      [eventId]
    );
    if (!event) return undefined;
    return Event.restore(
      event.event_id,
      event.description,
      event.account_id,
      event.started_at,
      event.finished_at
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

  async remove(eventId: string): Promise<void> {
    await this.connection.query("DELETE FROM events WHERE event_id = $1", [
      eventId,
    ]);
  }
}
