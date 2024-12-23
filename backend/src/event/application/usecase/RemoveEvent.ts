import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { AccountRepository } from "../../../account/application/repository/AccountRepository";
import { EventRepository } from "../repository/EventRepository";

export class RemoveEvent {
  private readonly accountRepository: AccountRepository;
  private readonly eventRepository: EventRepository;

  constructor(
    accountRepository: AccountRepository,
    eventRepository: EventRepository
  ) {
    this.accountRepository = accountRepository;
    this.eventRepository = eventRepository;
  }

  async execute(input: RemoveEventInput) {
    const account = await this.accountRepository.findByAccountId(
      input.accountId
    );
    if (!account) throw new NotFoundError("Account not found.");
    const event = await this.eventRepository.findByEventId(input.eventId);
    if (!event) throw new NotFoundError("Event not found.");
    if (event.getAccountId() !== account.getAccountId()) {
      throw new Error("You are not the creator of this event.");
    }
    this.eventRepository.remove(event.getEventId());
  }
}

interface RemoveEventInput {
  eventId: string;
  accountId: string;
}
