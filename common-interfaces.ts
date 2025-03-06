export type AnimationType = "idle" | "walk" | "run";

export interface Character {
  id: string;
  position: { x: number; y: number; z: number };
  animation: AnimationType;
  rotation: number;
}

export interface Chat {
  id: string;
  text: string;
  type: "message" | "join" | "left";
  postedAt: string;
}
