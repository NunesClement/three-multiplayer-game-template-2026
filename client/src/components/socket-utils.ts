import { io } from "socket.io-client";
import { create } from "zustand";

export interface Character {
  id: string;
  position: { x: number; y: number; z: number };
  animation: "idle" | "walk" | "run";
}

export interface Chat {
  id: string;
  text: string;
  type: "message" | "join" | "left";
}

// Export the socket instance
export const socket = io("http://localhost:3001");

export interface SocketStoreType {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  messages: Chat[];
  addMessage: (chat: Chat) => void;
}

export const useSocketStore = create<SocketStoreType>()((set) => ({
  characters: [],
  setCharacters: (characters) => set({ characters }),
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
