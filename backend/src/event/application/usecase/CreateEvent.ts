import { ConflictError } from "../../../account/application/errors/ConflictError";
import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { AccountRepository } from "../../../account/application/repository/AccountRepository";
import { Event } from "../../domain/entity/Event";
import { EventRepository } from "../repository/EventRepository";

export class CreateEvent {
  private readonly accountRepository: AccountRepository;
  private readonly eventRepository: EventRepository;

  constructor(
    accountRepository: AccountRepository,
    eventRepository: EventRepository
  ) {
    this.accountRepository = accountRepository;
    this.eventRepository = eventRepository;
  }

  async execute(input: CreateEventInput): Promise<void> {
    const account = await this.accountRepository.findByAccountId(
      input.accountId
    );
    if (!account) throw new NotFoundError("Account not found.");
    const event = Event.create(
      input.description,
      input.accountId,
      input.startedAt,
      input.finishedAt
    );
    const eventConflictExists = await this.eventRepository.checkEventConflict(
      event
    );
    if (eventConflictExists)
      throw new ConflictError(
        "You already have an event taking place at the same time."
      );
    await this.eventRepository.save(event);
  }
}

interface CreateEventInput {
  description: string;
  accountId: string;
  startedAt: string;
  finishedAt: string;
}
