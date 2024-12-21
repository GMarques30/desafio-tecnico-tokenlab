import cors from "cors";
import express, { Request, Response } from "express";

export interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  private readonly server: any;

  constructor() {
    this.server = express();
    this.server.use(express.json());
    this.server.use(cors());
  }

  register(method: string, url: string, callback: Function): void {
    this.server[method](url, async function (req: Request, res: Response) {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (e: any) {
        res.status(e.status).json({
          message: e.message,
        });
      }
    });
  }

  listen(port: Number): void {
    this.server.listen(port, () =>
      console.log(`The server is open on the port: ${port}`)
    );
  }
}
