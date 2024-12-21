import { Request, Response } from "express";
import { CreateEvent } from "../../application/usecase/CreateEvent";
import { EditEvent } from "../../application/usecase/EditEvent";

export class EventController {
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly editEvent: EditEvent
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
}
