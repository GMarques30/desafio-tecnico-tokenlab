import { EventRepository } from "../repository/EventRepository";

export class GetEvents {
  private readonly eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
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
