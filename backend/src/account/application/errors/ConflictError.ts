export class ConflictError extends Error {
  private status: number;

  constructor(message: string) {
    super(message);
    this.status = 409;
  }
}
