import { UUID } from "../../../../src/account/domain/vo/UUID";

test.each([
  "123e4567-e89b-12d3-a456-426614174000",
  "550e8400-e29b-41d4-a716-446655440000",
  "f47ac10b-58cc-4372-a567-0e02b2c3d479",
])("Should check that it is a valid uuid", function (uuid: string) {
  expect(new UUID(uuid).getUUID()).toEqual(uuid);
});

test.each([
  "123e4567-e89b-12d3-a456-42661417400",
  "550e8400-e29b-41d4-a716-44665544000z",
  "f47ac10b-58cc-4372-a567-0e02b2c3d47",
  "d1c9f8e2-9f5f-4e0e-b634-687d9bc799g3",
  "12345-67890-abcde-fghij-klmno",
])("Should check that it is a invalid uuid", function (uuid: string) {
  expect(() => new UUID(uuid)).toThrow(new Error("Invalid UUID."));
});

test("Should be able to create a uuid", function () {
  const uuid = UUID.create();
  expect(uuid).toBeInstanceOf(UUID);
});
