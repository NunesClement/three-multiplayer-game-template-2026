import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { Character, Chat } from "../../../common-interfaces";

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
  socket: io(
    import.meta.env.PROD ? "http://217.182.61.210" : "http://localhost:3001"
  ),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
}));
