import { ValidationError } from "../../application/exception/ValidationError";

export class Email {
  private email: string;

  constructor(email: string) {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      throw new ValidationError("Invalid email.");
    }
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }
}
