import { PropsWithChildren, useEffect, useState } from "react";
import { Character, socket, SocketContext } from "./socket-utils";

export function SocketProvider({ children }: PropsWithChildren) {
  const [characters, setCharacters] = useState<Character[]>([]);

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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ characters }}>
      {children}
    </SocketContext.Provider>
  );
}
