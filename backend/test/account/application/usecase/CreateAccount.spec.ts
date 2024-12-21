import { AccountRepository } from "../../../../src/account/application/repository/AccountRepository";
import { CreateAccount } from "../../../../src/account/application/usecase/CreateAccount";
import { AccountRepositoryMemory } from "../../../../test/account/infra/repository/AccountRepositoryMemory";

let accountRepository: AccountRepository;
let sut: CreateAccount;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  sut = new CreateAccount(accountRepository);
});

test("Should create an account from the use case", async function () {
  const input = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "John@123",
  };
  await sut.execute(input);
  const account = await accountRepository.findByEmail(input.email);
  expect(account).toBeTruthy();
  expect(account?.getAccountId()).toBeDefined();
});

test("Should throw an error when account already exists", async function () {
  const input = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "John@123",
  };
  await sut.execute(input);
  expect(() => sut.execute(input)).rejects.toThrow(
    new Error("This email is already in use.")
  );
});
