import { Connection } from "../../../account/infra/database/Connection";
import { InviteeRepository } from "../../application/repository/InviteeRepository";
import { Invitee } from "../../domain/entity/Invitee";

export class InviteeRepositoryDatabase implements InviteeRepository {
  private readonly connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async save(invitee: Invitee): Promise<void> {
    await this.connection.query(
      "INSERT INTO invitees (invitee_id, event_id, guest_id, invitee_status) VALUES ($1, $2, $3, $4)",
      [
        invitee.getInviteeId(),
        invitee.getEventId(),
        invitee.getGuestId(),
        invitee.getStatus(),
      ]
    );
  }

  async findByInviteeId(inviteeId: string): Promise<Invitee | undefined> {
    const [invitee] = await this.connection.query(
      "SELECT * FROM invitees WHERE invitee_id = $1",
      [inviteeId]
    );
    if (!invitee) return undefined;
    return Invitee.restore(
      invitee.invitee_id,
      invitee.event_id,
      invitee.guest_id,
      invitee.invitee_status
    );
  }

  async update(invitee: Invitee): Promise<void> {
    await this.connection.query(
      "UPDATE invitees SET invitee_status = $2 WHERE invitee_id = $1",
      [invitee.getInviteeId(), invitee.getStatus()]
    );
  }

  async findByGuestId(guestId: string): Promise<Invitee[]> {
    const inviteesData = await this.connection.query(
      "SELECT * FROM invitees WHERE guest_id = $1",
      [guestId]
    );
    const invitees = [];
    for (const invitee of inviteesData) {
      invitees.push(
        Invitee.restore(
          invitee.invitee_id,
          invitee.event_id,
          invitee.guest_id,
          invitee.invitee_status
        )
      );
    }
    return invitees;
  }
}
