import { EventDAO } from "../dao/EventDAO";

export class GetEvents {
  private readonly eventDAO: EventDAO;

  constructor(eventDAO: EventDAO) {
    this.eventDAO = eventDAO;
  }

  async execute(input: GetEventsInput): Promise<GetEventsOutput> {
    const events = await this.eventDAO.findByAccountIdQuery(input.accountId);
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
