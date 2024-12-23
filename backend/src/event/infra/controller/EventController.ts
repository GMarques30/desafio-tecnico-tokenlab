import { Request, Response } from "express";
import { CreateEvent } from "../../application/usecase/CreateEvent";
import { EditEvent } from "../../application/usecase/EditEvent";
import { GetEvents } from "../../application/usecase/GetEvents";
import { RemoveEvent } from "../../application/usecase/RemoveEvent";
import { InviteEvent } from "./../../application/usecase/InviteEvent";

export class EventController {
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly editEvent: EditEvent,
    private readonly removeEvent: RemoveEvent,
    private readonly getEvents: GetEvents,
    private readonly inviteEvent: InviteEvent
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
    const body = {
      ...req.body,
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
}
