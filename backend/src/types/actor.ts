export interface Actor {
  actor?: string;
  name?: string;
  gender?: "nam" | "nữ" | "khác";
}

export interface ActorGeneral extends Actor {
  charNames?: string[];
  playTitles?: string[];
}

export type ActorGenerals = ActorGeneral[];

export interface ActorInformation extends Actor {
  plays?: string[];
  characters?: string[];
}

export interface ActorName {
  actor: string;
  name: string;
}

export type ActorNames = ActorName[];