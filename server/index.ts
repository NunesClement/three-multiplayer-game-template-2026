import { Server } from "socket.io";
import { AnimationCharacterType, Character, Chat } from "../common-interfaces";
import { createServer } from "http";

// const io = new Server({
//   cors: {
//     origin: "*",
//     //https://a-game-test.vercel.app
//     // import.meta.env.NODE_ENV === "development"
//     //   ? "http://localhost:5173"
//     //   : "http://localhost:5173",
//   },
// });

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from anywhere (adjust as needed)
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Allow both transports
});

httpServer.listen(3003, "0.0.0.0", () => {
  console.log("Socket.io server running on port 3003");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("message", (msg) => {
    console.log("Received:", msg);
    io.emit("message", msg);
  });
});
// io.listen(3003);

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
    rotation: 0,
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

  socket.on("rotation", ({ rotation }: { rotation: number }) => {
    const character = characters.find((char) => char.id === socket.id);
    if (character) {
      character.rotation = rotation;
      io.emit("characters", characters);
    }
  });

  socket.on(
    "animation",
    ({ animation }: { animation: AnimationCharacterType }) => {
      const character = characters.find((char) => char.id === socket.id);
      if (character) {
        character.animation = animation;
        io.emit("characters", characters);
      }
    }
  );

  socket.on("chat", (chat: { message: Chat["text"] }) => {
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
