import { AccountRepository } from "../../application/repository/AccountRepository";
import { Account } from "../../domain/entity/Account";
import { Connection } from "../database/Connection";

export class AccountRepositoryDatabase implements AccountRepository {
  private readonly connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async save(account: Account): Promise<void> {
    await this.connection.query(
      "INSERT INTO accounts (account_id, first_name, last_name, email, password, avatar) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        account.getAccountId(),
        account.getFirstName(),
        account.getLastName(),
        account.getEmail(),
        account.getPassword(),
        account.getAvatar(),
      ]
    );
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const [data] = await this.connection.query(
      "SELECT * FROM accounts WHERE email = $1",
      [email]
    );
    if (!data) return undefined;
    return Account.restore(
      data.account_id,
      data.first_name,
      data.last_name,
      data.email,
      data.password,
      data.avatar
    );
  }

  async findByAccountId(accountId: string): Promise<Account | undefined> {
    const [data] = await this.connection.query(
      "SELECT * FROM accounts WHERE account_id = $1",
      [accountId]
    );
    if (!data) return undefined;
    return Account.restore(
      data.account_id,
      data.first_name,
      data.last_name,
      data.email,
      data.password,
      data.avatar
    );
  }
}
