export interface Actor {
  actor?: string;
  name?: string;
  gender?: "nam" | "nữ" | "khác";
}

export type ActorNames = string[];

export interface ActorGeneral extends Actor {
  charNames?: string[];
  playTitles?: string[];
}

export type ActorGenerals = ActorGeneral[];
