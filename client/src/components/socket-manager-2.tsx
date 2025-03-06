import React, { PropsWithChildren, useEffect, useState } from "react";
import { Character, socket, SocketContext } from "./socket-utils";

export function SocketProvider2({ children }: PropsWithChildren) {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const handleCharactersUpdate = (
      newCharacters: React.SetStateAction<Character[]>
    ) => {
      setCharacters(newCharacters);
    };

    socket.on("connect", () => console.log("Connected"));
    socket.on("characters", handleCharactersUpdate);

    // Return a cleanup function that correctly performs cleanup without returning a value
    return () => {
      socket.off("connect");
      socket.off("characters", handleCharactersUpdate);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ characters }}>
      {children}
    </SocketContext.Provider>
  );
}
