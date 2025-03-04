import { atom } from "jotai";
import { io } from "socket.io-client";

export interface Character {
  id: string;
  position: { x: number; y: number; z: number };
  animation: string;
}

// Export the socket instance
export const socket = io("http://localhost:3001");
export const charactersAtom = atom<Character[]>([]);
