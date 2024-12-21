export class UUID {
  private value: string;

  constructor(uuid: string) {
    if (
      !uuid.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      )
    ) {
      throw new Error("Invalid UUID.");
    }
    this.value = uuid;
  }

  static create(): UUID {
    const uuid = crypto.randomUUID();
    return new UUID(uuid);
  }

  getUUID(): string {
    return this.value;
  }
}
