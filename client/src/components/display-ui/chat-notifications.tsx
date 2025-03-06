import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SendIcon } from "lucide-react";

export function ChatNotifications() {
  const [messages, setMessages] = useState([
    { id: 1, text: "User1 joined the server", type: "join" },
    { id: 2, text: "User2 left the server", type: "leave" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-5 left-5 w-80 p-2 space-y-2">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className={`p-2 rounded-lg text-white text-sm ${
              msg.type === "join" ? "bg-green-500" : "bg-red-500"
            } bg-opacity-70 backdrop-blur-sm`}
          >
            {msg.text}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex gap-2 items-center opacity-35 hover:opacity-100">
        <input
          placeholder="Chat..."
          className="border-black border-2 p-1 rounded-lg"
        />
        <motion.button
          className="flex gap-2 bg-gray-50/10 p-1 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send <SendIcon />
        </motion.button>
      </div>
    </div>
  );
}
