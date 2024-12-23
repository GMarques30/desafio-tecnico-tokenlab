import { CredentialsInvalidError } from "../../../../src/account/application/errors/CredentialsInvalidError";
import { NotFoundError } from "../../../../src/account/application/errors/NotFoundError";
import { Authentication } from "../../../../src/account/application/usecase/Authentication";
import { Account } from "../../../../src/account/domain/entity/Account";
import { AccountRepositoryMemory } from "../../infra/repository/AccountRepositoryMemory";
import { AccountRepository } from "./../../../../src/account/application/repository/AccountRepository";
import {
  AuthProvider,
  JWTAuth,
} from "./../../../../src/account/infra/auth/AuthProvider";

jest.mock("../../../../src/account/infra/auth/AuthProvider", () => {
  return {
    JWTAuth: jest.fn().mockImplementation(() => {
      return {
        sign: jest.fn().mockReturnValue("mockedToken"),
        verify: jest.fn().mockReturnValue("mockedPayload"),
      };
    }),
  };
});

let authProvider: AuthProvider;
let accountRepository: AccountRepository;
let sut: Authentication;

beforeEach(() => {
  authProvider = new JWTAuth();
  accountRepository = new AccountRepositoryMemory();
  sut = new Authentication(accountRepository, authProvider);
  const account = Account.create(
    "John",
    "Doe",
    "john.doe@example.com",
    "John@123"
  );
  accountRepository.save(account);
});

test("Should be able to generate a token", async function () {
  const input = {
    email: "john.doe@example.com",
    password: "John@123",
  };
  const token = await sut.execute(input);
  expect(token.token).toBeDefined();
  expect(token.token).toEqual("mockedToken");
});

test("Should throw an error when the account is not found", async function () {
  const input = {
    email: "non-existing@example.com",
    password: "John@123",
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new NotFoundError("Account not found.")
  );
});

test("Should throw an error when the password is not valid", async function () {
  const input = {
    email: "john.doe@example.com",
    password: "Doe@123",
  };
  expect(() => sut.execute(input)).rejects.toThrow(
    new CredentialsInvalidError("Credentials invalid.")
  );
});
