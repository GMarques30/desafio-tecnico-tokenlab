import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";

export interface AuthProvider {
  sign(
    payload: string | Buffer | object,
    secretKey: string,
    options: object
  ): string;
  verify(token: string, secretKey: string, options: object): string | object;
  checkToken(req: Request, res: Response, next: NextFunction): void;
}

export class JWTAuth implements AuthProvider {
  sign(
    payload: string | Buffer | object,
    secretKey: string,
    options: SignOptions
  ): string {
    return sign(payload, secretKey, options);
  }

  verify(
    token: string,
    secretKey: string,
    options: object
  ): string | JwtPayload {
    return verify(token, secretKey, options);
  }

  checkToken(req: Request, res: Response, next: NextFunction): any {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token is required." });
    }

    try {
      this.verify(
        token,
        process.env.SECRET_KEY!,
        (err: Error, decoded: any) => {
          if (err) {
            return res
              .status(401)
              .json({ message: "Invalid or expired token." });
          }
          req.accountId = decoded.accountId;
          next();
        }
      );
    } catch (err) {
      return res.status(500).json({ message: "An internal error occurred." });
    }
  }
}
