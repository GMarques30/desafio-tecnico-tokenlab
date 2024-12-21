import { Email } from "../../../../src/account/domain/vo/Email";

test.each([
  "exemplo@dominio.com",
  "joao.silva123@provedor.net",
  "maria.junior@empresa.org",
  "usuario123@meu-site.co",
  "contato@empresa.br",
])("Should check that it is a valid email", function (email: string) {
  expect(new Email(email).getEmail()).toEqual(email);
});

test.each([
  "exemplo@dominio",
  "@dominio.com",
  "joao.silva@.com",
  "@empresa..com",
  "usuario@com",
])("Should check that it is a invalid email", function (email: string) {
  expect(() => new Email(email)).toThrow(new Error("Invalid email."));
});
