import { Account } from "../../domain/entity/Account";

export interface AccountRepository {
  save(account: Account): Promise<void>;
  findByEmail(email: string): Promise<Account | undefined>;
}
