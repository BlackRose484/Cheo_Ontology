export interface Actor {
  id?: string;
  name?: string;
  gender?: "nam" | "nữ" | "khác";
}

export type ActorNames = string[];

export interface ActorGeneral extends Actor {}

export type ActorGenerals = ActorGeneral[];
