import crypto from "node:crypto";

export class Password {
  private password: string;

  private constructor(password: string) {
    this.password = password;
  }

  static create(password: string) {
    if (!password.match(/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*\W)).{6,12}$/)) {
      throw new Error("Invalid password.");
    }
    const encryptedPassword = crypto
      .createHash("SHA-256")
      .update(password)
      .digest("hex");
    return new Password(encryptedPassword);
  }

  static restore(password: string) {
    return new Password(password);
  }

  passwordMatches(password: string): boolean {
    return (
      this.getPassword() ===
      crypto.createHash("SHA-256").update(password).digest("hex")
    );
  }

  getPassword(): string {
    return this.password;
  }
}
