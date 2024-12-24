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
