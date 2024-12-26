import { InviteeRepository } from "../../../../src/event/application/repository/InviteeRepository";
import { GetInvitees } from "../../../../src/event/application/usecase/GetInvitees";
import { Invitee } from "../../../../src/event/domain/entity/Invitee";
import { InviteeRepositoryMemory } from "../../infra/repository/InviteeRepositoryMemory";

let inviteeRepository: InviteeRepository;
let sut: GetInvitees;
let guestId: string;

beforeEach(async () => {
  inviteeRepository = new InviteeRepositoryMemory();
  sut = new GetInvitees(inviteeRepository);
  guestId = crypto.randomUUID();
  await inviteeRepository.save(Invitee.create(crypto.randomUUID(), guestId));
  await inviteeRepository.save(Invitee.create(crypto.randomUUID(), guestId));
  await inviteeRepository.save(
    Invitee.create(crypto.randomUUID(), crypto.randomUUID())
  );
});

test("Should be able to get all the pending invitations", async function () {
  const input = {
    guestId,
  };
  const { invitees } = await sut.execute(input);
  expect(invitees).toHaveLength(2);
  expect(invitees).toEqual(
    expect.objectContaining([
      {
        inviteeId: expect.any(String),
        eventId: expect.any(String),
        guestId,
        inviteeStatus: "PENDING",
      },
      {
        inviteeId: expect.any(String),
        eventId: expect.any(String),
        guestId,
        inviteeStatus: "PENDING",
      },
    ])
  );
});

test("Should return an empty array if there are no invitations", async function () {
  const input = {
    guestId: crypto.randomUUID(),
  };
  const { invitees } = await sut.execute(input);
  expect(invitees).toHaveLength(0);
  expect(invitees).toEqual([]);
});
