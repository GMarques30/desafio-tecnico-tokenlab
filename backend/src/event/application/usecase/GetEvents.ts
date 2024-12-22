import { NotFoundError } from "../../../account/application/exception/NotFoundError";
import { AccountRepository } from "../../../account/application/repository/AccountRepository";
import { EventRepository } from "../repository/EventRepository";

export class GetEvents {
  private readonly accountRepository: AccountRepository;
  private readonly eventRepository: EventRepository;

  constructor(
    accountRepository: AccountRepository,
    eventRepository: EventRepository
  ) {
    (this.accountRepository = accountRepository),
      (this.eventRepository = eventRepository);
  }

  async execute(input: GetEventsInput): Promise<GetEventsOutput> {
    const account = await this.accountRepository.findByAccountId(
      input.accountId
    );
    if (!account) throw new NotFoundError("Account not found.");
    const events = await this.eventRepository.findByAccountId(input.accountId);
    return {
      events,
    };
  }
}

interface GetEventsInput {
  accountId: string;
}

interface GetEventsOutput {
  events: {
    eventId: string;
    description: string;
    accountId: string;
    startedAt: Date;
    finishedAt: Date;
  }[];
}
