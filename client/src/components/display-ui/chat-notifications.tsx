import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SendIcon } from "lucide-react";
import { socket, useSocketStore } from "../socket-utils";
import { cn } from "../../utils/style-utils";

export function ChatNotifications() {
  const [currentChat, setCurrentChat] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages } = useSocketStore();

  console.log(messages);

  function handlePostMessage() {
    socket.emit("chat", {
      message: currentChat,
    });

    setCurrentChat("");
  }

  function handleScrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    // Scroll to bottom when messages change or focus state changes
    const scrollWithDelay = () => {
      // If collapsing (isFocused === false), wait for the transition to complete
      const delay = isFocused ? 0 : 310; // Match the transition duration (300ms)
      setTimeout(() => {
        handleScrollToBottom();
      }, delay);
    };

    scrollWithDelay();
  }, [messages, isFocused]);
  return (
    <div className="absolute bottom-5 left-5 w-80 p-2 space-y-2">
      <div
        className={cn(
          "bg-opacity-70 backdrop-blur-sm flex flex-col gap-2 overflow-scroll transition-all duration-300",
          isFocused ? "max-h-[400px] overflow-y-scroll" : "max-h-[120px]"
        )}
        ref={chatContainerRef}
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={cn(
              `rounded-lg text-white text-sm my-1`,
              msg.type === "join" && "bg-green-600",
              msg.type === "left" && "bg-red-600"
            )}
            initial={{ opacity: 1, display: "block" }}
            animate={
              isFocused
                ? { opacity: 1, display: "block" }
                : { opacity: 0, display: "none" }
            }
            transition={{
              duration: 1,
              delay: isFocused ? 0 : 9,
            }}
          >
            {msg.id} {msg.text}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2 items-center opacity-35 hover:opacity-100">
        <input
          placeholder="Chat..."
          className="border-black border-2 p-1 rounded-lg"
          onKeyDown={(e) =>
            e.key === "Enter" ? handlePostMessage() : e.stopPropagation()
          }
          onChange={(e) => setCurrentChat(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
