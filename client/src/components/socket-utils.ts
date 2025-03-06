import { atom } from "jotai";
import { createContext, useContext } from "react";
import { io } from "socket.io-client";

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
export const charactersAtom = atom<Character[]>([]);
export const chatAtom = atom<Chat[]>([]);

export interface SocketContextType {
  characters: Character[];
  messages: Chat[];
}

export const SocketContext = createContext<SocketContextType>({
  characters: [],
  messages: [],
});

export const useSocket = () => useContext(SocketContext);
