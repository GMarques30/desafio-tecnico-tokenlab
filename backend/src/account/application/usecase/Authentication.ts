import { AuthProvider } from "../../infra/auth/AuthProvider";
import { CredentialsInvalidError } from "../errors/CredentialsInvalidError";
import { NotFoundError } from "../errors/NotFoundError";
import { AccountRepository } from "../repository/AccountRepository";

export class Authentication {
  private readonly accountRepository: AccountRepository;
  private readonly authProvider: AuthProvider;

  constructor(
    accountRepository: AccountRepository,
    authProvider: AuthProvider
  ) {
    this.accountRepository = accountRepository;
    this.authProvider = authProvider;
  }

  async execute(input: AuthenticationInput): Promise<AuthenticationOutput> {
    const account = await this.accountRepository.findByEmail(input.email);
    if (!account) {
      throw new NotFoundError("Account not found.");
    }
    if (!account.passwordMatches(input.password)) {
      throw new CredentialsInvalidError("Credentials invalid.");
    }
    const token = this.authProvider.sign(
      { accountId: account.getAccountId() },
      process.env.SECRET_KEY!,
      {
        expiresIn: "2h",
      }
    );
    return {
      token,
    };
  }
}

interface AuthenticationInput {
  email: string;
  password: string;
}

interface AuthenticationOutput {
  token: string;
}
