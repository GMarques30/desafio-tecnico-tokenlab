import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { NotEventCreator } from "../errors/NotEventCreator";
import { EventRepository } from "../repository/EventRepository";

export class RemoveEvent {
  private readonly eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(input: RemoveEventInput) {
    const event = await this.eventRepository.findByEventId(input.eventId);
    if (!event) throw new NotFoundError("Event not found.");
    if (event.getAccountId() !== input.accountId) {
      throw new NotEventCreator("You are not the creator of this event.");
    }
    this.eventRepository.remove(event.getEventId());
  }
}

interface RemoveEventInput {
  eventId: string;
  accountId: string;
}
