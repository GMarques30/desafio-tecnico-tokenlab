import { EventDAO } from "../../application/dao/EventDAO";
import { Connection } from "./../../../account/infra/database/Connection";

export class EventDAODatabase implements EventDAO {
  private readonly connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async save(event: {
    eventId: string;
    description: string;
    accountId: string;
    startedAt: Date;
    finishedAt: Date;
  }): Promise<void> {
    await this.connection.query(
      "INSERT INTO events (event_id, description, account_id, started_at, finished_at) VALUES ($1, $2, $3, $4, $5)",
      [
        event.eventId,
        event.description,
        event.accountId,
        event.startedAt,
        event.finishedAt,
      ]
    );
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
    const eventsData = await this.connection.query(
      "SELECT e.event_id, e.description, e.account_id, e.started_at, e.finished_at FROM events e LEFT JOIN invitees i ON e.event_id = i.event_id WHERE e.account_id = $1 OR (i.guest_id = $1 AND i.invitee_status = 'ACCEPTED')",
      [accountId]
    );
    const events = [];
    for (const event of eventsData) {
      events.push({
        eventId: event.event_id,
        description: event.description,
        accountId: event.account_id,
        startedAt: event.started_at,
        finishedAt: event.finished_at,
      });
    }
    return events;
  }
}
