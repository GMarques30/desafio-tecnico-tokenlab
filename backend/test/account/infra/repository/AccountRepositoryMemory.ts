import { AccountRepository } from "../../../../src/account/application/repository/AccountRepository";
import { Account } from "../../../../src/account/domain/entity/Account";

export class AccountRepositoryMemory implements AccountRepository {
  private readonly accounts: {
    accountId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
  }[];

  constructor() {
    this.accounts = [];
  }

  async save(account: Account): Promise<void> {
    this.accounts.push({
      accountId: account.getAccountId(),
      firstName: account.getFirstName(),
      lastName: account.getLastName(),
      email: account.getEmail(),
      password: account.getPassword(),
      avatar: account.getAvatar(),
    });
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const account = this.accounts.find((account) => account.email === email);
    if (!account) return undefined;
    return Account.restore(
      account.accountId,
      account.firstName,
      account.lastName,
      account.email,
      account.password,
      account.avatar
    );
  }

  async findByAccountId(accountId: string): Promise<Account | undefined> {
    const account = this.accounts.find(
      (account) => account.accountId === accountId
    );
    if (!account) return undefined;
    return Account.restore(
      account.accountId,
      account.firstName,
      account.lastName,
      account.email,
      account.password,
      account.avatar
    );
  }
}
