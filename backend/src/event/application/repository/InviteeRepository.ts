import { Invitee } from "../../domain/entity/Invitee";

export interface InviteeRepository {
  save(invitee: Invitee): Promise<void>;
  findByInviteeId(inviteeId: string): Promise<Invitee | undefined>;
}
