export type AnimationCharacterType = "idle" | "walk" | "run" | "jump";

export interface Character {
  id: string;
  position: { x: number; y: number; z: number };
  animation: AnimationCharacterType;
  rotation: number;
}

export interface Chat {
  id: string;
  text: string;
  type: "message" | "join" | "left";
  postedAt: string;
}
