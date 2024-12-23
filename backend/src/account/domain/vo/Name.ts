import { ValidationError } from "../../application/errors/ValidationError";

export class Name {
  private firstName: string;
  private lastName: string;

  constructor(firstName: string, lastName: string) {
    if (
      !firstName.match(/^[A-Za-zÀ-ÿ]{3,}$/) ||
      !lastName.match(/^[A-Za-zÀ-ÿ]{3,}$/)
    ) {
      throw new ValidationError("Invalid name.");
    }
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
