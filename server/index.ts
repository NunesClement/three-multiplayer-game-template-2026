import { Server } from "socket.io";

interface Character {
  id: string;
  position: { x: number; y: number; z: number };
}

interface Chat {
  id: string;
  text: string;
  type: "message" | "join" | "left";
}

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

const characters: Character[] = [];

// const generateRandomHexColor = (): string => {
//   return (
//     "#" +
//     Math.floor(Math.random() * 16777215)
//       .toString(16)
//       .padStart(6, "0")
//   );
// };

io.on("connection", (socket) => {
  console.log(socket.id, "join the server ⬆");

  io.emit("chat", {
    id: socket.id,
    text: `${socket.id} join the server`,
    type: "message",
  } satisfies Chat);

  const newCharacter: Character = {
    id: socket.id,
    position: { x: 0, y: 0, z: 0 },
  };

  characters.push(newCharacter);

  socket.emit("hello");
  io.emit("characters", characters);

  socket.on("move", (position: { x: number; y: number; z: number }) => {
    const character = characters.find((char) => char.id === socket.id);
    if (character) {
      character.position = position;
      io.emit("characters", characters);
    }
  });

  socket.on("chat", (chat: { message: Chat["text"] }) => {
    console.log(chat);

    io.emit("chat", {
      id: socket.id,
      text: chat.message,
      type: "message",
    } satisfies Chat);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "left the server ⬇");
    io.emit("chat", {
      id: socket.id,
      text: `${socket.id} left the server`,
      type: "message",
    } satisfies Chat);

    const index = characters.findIndex((char) => char.id === socket.id);
    if (index !== -1) {
      characters.splice(index, 1);
      io.emit("characters", characters);
    }
  });
});
