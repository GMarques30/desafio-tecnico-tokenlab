import { NotFoundError } from "../../../account/application/errors/NotFoundError";
import { Invitee } from "../../domain/entity/Invitee";
import { InviteeRepository } from "../repository/InviteeRepository";
import { AccountRepository } from "./../../../account/application/repository/AccountRepository";
import { EventRepository } from "./../repository/EventRepository";

export class InviteEvent {
  private readonly accountRepository: AccountRepository;
  private readonly eventRepository: EventRepository;
  private readonly inviteeRepository: InviteeRepository;

  constructor(
    accountRepository: AccountRepository,
    eventRepository: EventRepository,
    inviteeRepository: InviteeRepository
  ) {
    this.accountRepository = accountRepository;
    this.eventRepository = eventRepository;
    this.inviteeRepository = inviteeRepository;
  }

  async execute(input: InviteEventInput): Promise<InviteEventOutput> {
    const eventOwner = await this.accountRepository.findByAccountId(
      input.accountId
    );
    if (!eventOwner) {
      throw new NotFoundError("Account not found.");
    }
    if (eventOwner.getAccountId() === input.guestId) {
      throw new Error("The event owner cannot invite themselves as a guest.");
    }
    const event = await this.eventRepository.findByEventId(input.eventId);
    if (!event) {
      throw new NotFoundError("Event not found.");
    }
    if (event.getAccountId() !== eventOwner.getAccountId()) {
      throw new Error("You are not the creator of this event.");
    }
    const guestAccount = await this.accountRepository.findByAccountId(
      input.guestId
    );
    if (!guestAccount) {
      throw new NotFoundError("Guest account not found.");
    }
    const invitee = Invitee.create(input.eventId, input.guestId);
    await this.inviteeRepository.save(invitee);
    return {
      inviteeId: invitee.getInviteeId(),
    };
  }
}

interface InviteEventInput {
  accountId: string;
  eventId: string;
  guestId: string;
}

interface InviteEventOutput {
  inviteeId: string;
}
