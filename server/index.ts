import { Server } from "socket.io";

type AnimationName = "idle" | "walk" | "run";

interface Character {
  id: string;
  position: { x: number; y: number; z: number };
  animation: AnimationName;
}

interface Chat {
  id: string;
  text: string;
  type: "message" | "join" | "left";
  postedAt: string;
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
    postedAt: new Date().toString(),
  } satisfies Chat);

  const newCharacter: Character = {
    id: socket.id,
    position: { x: 0, y: 0, z: 0 },
    animation: "idle",
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

  socket.on("animation", ({ animation }: { animation: AnimationName }) => {
    const character = characters.find((char) => char.id === socket.id);
    if (character) {
      character.animation = animation;
      io.emit("characters", characters);
    }
  });

  socket.on("chat", (chat: { message: Chat["text"] }) => {
    console.log(chat);

    io.emit("chat", {
      id: socket.id,
      text: chat.message,
      type: "message",
      postedAt: new Date().toISOString(),
    } satisfies Chat);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "left the server ⬇");
    io.emit("chat", {
      id: socket.id,
      text: `${socket.id} left the server`,
      type: "message",
      postedAt: new Date().toISOString(),
    } satisfies Chat);

    const index = characters.findIndex((char) => char.id === socket.id);
    if (index !== -1) {
      characters.splice(index, 1);
      io.emit("characters", characters);
    }
  });
});
