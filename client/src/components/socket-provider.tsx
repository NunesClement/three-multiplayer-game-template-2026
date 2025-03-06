import { PropsWithChildren, useEffect, useState } from "react";
import { Character, Chat, socket, SocketContext } from "./socket-utils";

export function SocketProvider({ children }: PropsWithChildren) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [messages, setMessages] = useState<Chat[]>([]);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello() {
      console.log("hello");
    }

    function onCharacters(value: Character[]) {
      setCharacters(value);
    }

    function onChat(value: Chat) {
      setMessages((prev) => [...prev, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("chat", onChat);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.off("chat", onChat);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ characters, messages }}>
      {children}
    </SocketContext.Provider>
  );
}
