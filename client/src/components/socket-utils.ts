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
  socket: io("https://vps-4838558d.vps.ovh.net"),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
}));
