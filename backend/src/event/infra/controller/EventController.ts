import { Request, Response } from "express";
import { AcceptEvent } from "../../application/usecase/AcceptEvent";
import { CreateEvent } from "../../application/usecase/CreateEvent";
import { DeclineEvent } from "../../application/usecase/DeclineEvent";
import { EditEvent } from "../../application/usecase/EditEvent";
import { GetEvents } from "../../application/usecase/GetEvents";
import { GetInvitees } from "../../application/usecase/GetInvitees";
import { RemoveEvent } from "../../application/usecase/RemoveEvent";
import { InviteEvent } from "./../../application/usecase/InviteEvent";

export class EventController {
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly editEvent: EditEvent,
    private readonly removeEvent: RemoveEvent,
    private readonly getEvents: GetEvents,
    private readonly inviteEvent: InviteEvent,
    private readonly acceptEvent: AcceptEvent,
    private readonly declineEvent: DeclineEvent,
    private readonly getInvitees: GetInvitees
  ) {}

  async create(req: Request, res: Response) {
    try {
      await this.createEvent.execute({ ...req.body, accountId: req.accountId });
      res.status(201).json();
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async edit(req: Request, res: Response) {
    const { description, startedAt, finishedAt } = req.body;
    const body = {
      description,
      startedAt,
      finishedAt,
      accountId: req.accountId,
      eventId: req.params.eventId,
    };
    try {
      await this.editEvent.execute(body);
      res.status(200).json();
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async remove(req: Request, res: Response) {
    const input = {
      eventId: req.params.eventId,
      accountId: req.accountId,
    };
    try {
      await this.removeEvent.execute(input);
      res.status(200).json();
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const output = await this.getEvents.execute({
        accountId: req.accountId,
      });
      res.status(200).json(output);
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async invite(req: Request, res: Response) {
    const { guestId } = req.body;
    try {
      const output = await this.inviteEvent.execute({
        accountId: req.accountId,
        eventId: req.params.eventId,
        guestId,
      });
      res.status(200).json(output);
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async accept(req: Request, res: Response) {
    const guestId = req.accountId;
    const { inviteeId } = req.params;
    try {
      await this.acceptEvent.execute({
        inviteeId,
        guestId,
      });
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async decline(req: Request, res: Response) {
    const guestId = req.accountId;
    const { inviteeId } = req.params;
    try {
      await this.declineEvent.execute({
        inviteeId,
        guestId,
      });
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async getAllPendingInvitees(req: Request, res: Response) {
    const input = {
      guestId: req.accountId,
    };
    try {
      const output = await this.getInvitees.execute(input);
      res.status(200).json(output);
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }
}
