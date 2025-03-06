import { useState } from "react";
import { motion } from "motion/react";
import { SendIcon } from "lucide-react";
import { chatAtom, socket } from "../socket-utils";
import { useAtom } from "jotai";
import { cn } from "../../utils/style-utils";

export function ChatNotifications() {
  const [currentChat, setCurrentChat] = useState("");
  const [messages] = useAtom(chatAtom);

  console.log(messages);

  function handlePostMessage() {
    socket.emit("chat", {
      message: currentChat,
    });

    setCurrentChat("");
  }

  return (
    <div className="absolute bottom-5 left-5 w-80 p-2 space-y-2">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          // initial={{ opacity: 0, y: 10 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: -10 }}
          // transition={{ duration: 0.5 }}
          className={cn(
            `p-2 rounded-lg text-white text-sm ${
              (msg.type === "join" && "bg-green-600",
              msg.type === "left" && "bg-red-600")
            } bg-opacity-70 backdrop-blur-sm`
          )}
        >
          {msg.text}
        </motion.div>
      ))}
      <div className="flex gap-2 items-center opacity-35 hover:opacity-100">
        <input
          placeholder="Chat..."
          className="border-black border-2 p-1 rounded-lg"
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => setCurrentChat(e.target.value)}
          value={currentChat}
        />
        <motion.button
          className="flex gap-2 bg-gray-50/10 p-1 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePostMessage}
        >
          Send <SendIcon />
        </motion.button>
      </div>
    </div>
  );
}
