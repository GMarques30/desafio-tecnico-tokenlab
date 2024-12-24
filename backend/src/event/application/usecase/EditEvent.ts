import { ConflictError } from "../../../account/application/errors/ConflictError";
import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { NotEventCreator } from "../errors/NotEventCreator";
import { EventRepository } from "../repository/EventRepository";

export class EditEvent {
  private readonly eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(input: EditEventInput): Promise<void> {
    const event = await this.eventRepository.findByEventId(input.eventId);
    if (!event) throw new NotFoundError("Event not found.");
    if (input.accountId !== event.getAccountId()) {
      throw new NotEventCreator("You are not the creator of this event.");
    }
    event.setDescription(input.description || event.getDescription());
    event.setPeriod(
      input.startedAt || event.getStartedAt(),
      input.finishedAt || event.getFinishedAt()
    );
    const eventConflictExists = await this.eventRepository.checkEventConflict(
      event
    );
    if (eventConflictExists) {
      throw new ConflictError(
        "You already have an event taking place at the same time."
      );
    }
    await this.eventRepository.update(event);
  }
}

interface EditEventInput {
  eventId: string;
  description?: string;
  accountId: string;
  startedAt?: string;
  finishedAt?: string;
}
