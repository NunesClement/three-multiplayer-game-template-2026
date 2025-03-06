import { useEffect } from "react";
import { Character, Chat, useSocketStore } from "./socket-utils";

export function SocketManager() {
  const { setCharacters, addChat, socket } = useSocketStore();

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onCharacters(value: Character[]) {
      setCharacters(value);
    }

    function onChat(value: Chat) {
      addChat(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("characters", onCharacters);
    socket.on("chat", onChat);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("characters", onCharacters);
      socket.off("chat", onChat);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
