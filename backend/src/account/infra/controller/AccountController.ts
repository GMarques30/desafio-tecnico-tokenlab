import { Request, Response } from "express";
import { Authentication } from "../../application/usecase/Authentication";
import { CreateAccount } from "../../application/usecase/CreateAccount";

export class AccountController {
  constructor(
    private readonly createAccount: CreateAccount,
    private readonly authentication: Authentication
  ) {}

  async create(req: Request, res: Response) {
    try {
      await this.createAccount.execute(req.body);
      res.status(201).json();
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const output = await this.authentication.execute(req.body);
      res.status(200).json(output);
    } catch (e: any) {
      res.status(e.status).json({
        message: e.message,
      });
    }
  }
}
