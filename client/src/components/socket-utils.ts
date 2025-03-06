import { io, Socket } from "socket.io-client";
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
  postedAt: string;
}

export interface SocketStoreType {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  chats: Chat[];
  socket: Socket;
  addChat: (chat: Chat) => void;
}

export const useSocketStore = create<SocketStoreType>()((set) => ({
  characters: [],
  setCharacters: (characters) => set({ characters }),
  chats: [],
  socket: io("http://localhost:3001"),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
}));
