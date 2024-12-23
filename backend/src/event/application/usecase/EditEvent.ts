import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { AccountRepository } from "../../../account/application/repository/AccountRepository";
import { EventRepository } from "../repository/EventRepository";

export class EditEvent {
  private readonly accountRepository: AccountRepository;
  private readonly eventRepository: EventRepository;

  constructor(
    accountRepository: AccountRepository,
    eventRepository: EventRepository
  ) {
    this.accountRepository = accountRepository;
    this.eventRepository = eventRepository;
  }

  async execute(input: EditEventInput): Promise<void> {
    const account = await this.accountRepository.findByAccountId(
      input.accountId
    );
    if (!account) throw new NotFoundError("Account not found.");
    const event = await this.eventRepository.findByEventId(input.eventId);
    if (!event) throw new NotFoundError("Event not found.");
    if (account.getAccountId() !== event.getAccountId()) {
      throw new Error("You are not the creator of this event.");
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
      throw new Error(
        "You already have an event taking place at the same time."
      );
    }
    console.log(event);
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
