import "express";

declare global {
  namespace Express {
    export interface Request {
      accountId: string;
    }
  }
}
