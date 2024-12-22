import { Period } from "../../../../src/event/domain/vo/Period";

test("Should be possible to create a valid period", function () {
  const startedAt = "2025-12-21T00:00:00";
  const finishedAt = "2025-12-22T00:00:00";
  const period = new Period(startedAt, finishedAt);
  expect(period.getStartedAt()).toEqual(new Date(startedAt));
  expect(period.getFinishedAt()).toEqual(new Date(finishedAt));
});

test("Should throw an error when the start date is greater than the finish date", function () {
  const startedAt = "2025-12-21T00:00:00";
  const finishedAt = "2025-12-20T00:00:00";
  expect(() => new Period(startedAt, finishedAt)).toThrow(
    new Error("The start date cannot be after the finish date.")
  );
});

test("Should throw an error when the start date is a date in the past", function () {
  const startedAt = "2023-12-22T00:00:00";
  const finished = "2025-12-23T00:00:00";
  expect(() => new Period(startedAt, finished)).toThrow(
    new Error("The provided start date must not be in the past.")
  );
});

test("Should throw an error when the start date is empty", function () {
  const startedAt = "";
  const finishedAt = "2025-12-23T00:00:00";
  expect(() => new Period(startedAt, finishedAt)).toThrow(
    new Error("Invalid date.")
  );
});

test("Should throw an error when the finished date is empty", function () {
  const startedAt = "2025-12-23T00:00:00";
  const finishedAt = "";
  expect(() => new Period(startedAt, finishedAt)).toThrow(
    new Error("Invalid date.")
  );
});

test("Should throw an error when the started date and finished date are empty", function () {
  const startedAt = "";
  const finishedAt = "";
  expect(() => new Period(startedAt, finishedAt)).toThrow(
    new Error("Invalid date.")
  );
});
