import { Email } from "../vo/Email";
import { Name } from "../vo/Name";
import { Password } from "../vo/Password";
import { UUID } from "../vo/UUID";

export class Account {
  private readonly accountId: UUID;
  private name: Name;
  private email: Email;
  private password: Password;
  private avatar: string;

  private constructor(
    accountId: UUID,
    name: Name,
    email: Email,
    password: Password,
    avatar: string
  ) {
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
  }

  static create(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Account {
    const accountId = UUID.create();
    const name = new Name(firstName, lastName);
    const mail = new Email(email);
    const encryptedPassword = Password.create(password);
    const avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
    return new Account(accountId, name, mail, encryptedPassword, avatar);
  }

  static restore(
    accountId: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string
  ): Account {
    const uuid = new UUID(accountId);
    const name = new Name(firstName, lastName);
    const mail = new Email(email);
    const pass = Password.restore(password);
    return new Account(uuid, name, mail, pass, avatar);
  }

  getAccountId(): string {
    return this.accountId.getUUID();
  }

  getFirstName(): string {
    return this.name.getFirstName();
  }

  getLastName(): string {
    return this.name.getLastName();
  }

  getFullName(): string {
    return this.name.getFullName();
  }

  getEmail() {
    return this.email.getEmail();
  }

  getPassword() {
    return this.password.getPassword();
  }

  passwordMatches(password: string): boolean {
    return this.password.passwordMatches(password);
  }

  getAvatar() {
    return this.avatar;
  }
}
