import { Account } from "../../../../src/account/domain/entity/Account";

let account: Account;

beforeEach(() => {
  account = Account.create("John", "Doe", "john.doe@example.com", "John@123");
});

test("Should create an account", function () {
  expect(account.getAccountId()).not.toBeNull();
  expect(account.getFirstName()).toEqual("John");
  expect(account.getLastName()).toEqual("Doe");
  expect(account.getFullName()).toEqual(
    `${account.getFirstName()} ${account.getLastName()}`
  );
  expect(account.getEmail()).toEqual("john.doe@example.com");
  expect(account.getPassword()).not.toBeNull();
  expect(account.passwordMatches("John@123")).toBeTruthy();
  expect(account.getAvatar()).toEqual(
    `https://ui-avatars.com/api/?name=${account.getFirstName()}+${account.getLastName()}&background=random`
  );
});
