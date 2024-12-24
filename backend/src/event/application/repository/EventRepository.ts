import { Event } from "../../domain/entity/Event";

export interface EventRepository {
  save(event: Event): Promise<void>;
  checkEventConflict(event: Event): Promise<boolean>;
  findByAccountId(accountId: string): Promise<
    {
      eventId: string;
      description: string;
      accountId: string;
      startedAt: Date;
      finishedAt: Date;
    }[] // DEVE RETORNAR Event[]
  >;
  findByEventId(eventId: string): Promise<Event | undefined>;
  update(event: Event): Promise<void>;
  remove(eventId: string): Promise<void>;
}
