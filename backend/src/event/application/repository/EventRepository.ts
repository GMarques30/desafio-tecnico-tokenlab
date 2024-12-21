import { Event } from "../../domain/entity/Event";

export interface EventRepository {
  save(event: Event): Promise<void>;
  checkEventConflict(event: Event): Promise<boolean>;
  findByAccountId(accountId: string): Promise<Event | undefined>;
  findByEventId(eventId: string): Promise<Event | undefined>;
  update(event: Event): Promise<void>;
}
