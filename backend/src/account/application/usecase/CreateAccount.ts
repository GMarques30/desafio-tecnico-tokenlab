import { Account } from "../../domain/entity/Account";
import { ConflictError } from "../exception/ConflictError";
import { AccountRepository } from "./../repository/AccountRepository";

export class CreateAccount {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(input: CreateAccountInput): Promise<void> {
    const accountAlreadyExists = await this.accountRepository.findByEmail(
      input.email
    );
    if (accountAlreadyExists) {
      throw new ConflictError("This email is already in use.");
    }
    const account = Account.create(
      input.firstName,
      input.lastName,
      input.email,
      input.password
    );
    await this.accountRepository.save(account);
  }
}

interface CreateAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
