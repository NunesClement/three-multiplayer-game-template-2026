import { useEffect } from "react";
import { Character, Chat, socket, useSocketStore } from "./socket-utils";

export function SocketManager() {
  const { setCharacters, addChat } = useSocketStore();

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
      console.log({ value });
      setCharacters(value);
    }

    function onChat(value: Chat) {
      addChat(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.off("characters", onCharacters);
    socket.on("chat", onChat);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.off("chat", onChat);
    };
  }, [addChat, setCharacters]);

  return null;
}
