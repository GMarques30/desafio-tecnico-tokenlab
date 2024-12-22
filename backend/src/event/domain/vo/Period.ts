import { ValidationError } from "../../../account/application/exception/ValidationError";

export class Period {
  private startedAt: Date;
  private finishedAt: Date;

  constructor(startedAt: string | Date, finishedAt: string | Date) {
    if (startedAt === "" || finishedAt === "") throw new Error("Invalid date.");
    if (new Date(startedAt) > new Date(finishedAt)) {
      throw new ValidationError(
        "The start date cannot be after the finish date."
      );
    }
    if (new Date() > new Date(startedAt)) {
      throw new ValidationError(
        "The provided start date must not be in the past."
      );
    }
    this.startedAt = new Date(startedAt);
    this.finishedAt = new Date(finishedAt);
  }

  getStartedAt() {
    return this.startedAt;
  }

  getFinishedAt() {
    return this.finishedAt;
  }
}
