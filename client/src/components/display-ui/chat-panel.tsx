import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SendIcon } from "lucide-react";
import { useSocketStore } from "../socket-utils";
import { cn } from "../../utils/style-utils";

export function ChatPanel() {
  const [currentChat, setCurrentChat] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { chats, socket, characters } = useSocketStore();

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
  }, [chats, isFocused]);
  return (
    <div className="absolute bottom-5 left-5 w-80 p-2 space-y-2">
      <div
        className={cn(
          "bg-opacity-70 backdrop-blur-sm flex flex-col gap-2 overflow-scroll transition-all duration-300 break-words",
          isFocused ? "max-h-[400px] overflow-y-scroll" : "max-h-[120px]"
        )}
        ref={chatContainerRef}
      >
        {chats.map((chat) => (
          <motion.div
            key={`${chat.id} ${chat.postedAt.toString()}`}
            className={cn(
              `rounded-lg text-white text-sm my-1`,
              chat.type === "join" && "bg-green-600",
              chat.type === "left" && "bg-red-600"
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
            {`${new Date(chat.postedAt)
              .getHours()
              .toString()
              .padStart(2, "0")}:`}
            {new Date(chat.postedAt).getMinutes().toString().padStart(2, "0")}{" "}
            {chat.id} {chat.text}
          </motion.div>
        ))}
      </div>
      <div className="gap-2 items-center opacity-35 hover:opacity-100 hidden lg:flex">
        <input
          placeholder="Chat..."
          className="border-black border-2 p-1 rounded-lg w-full"
          onKeyDown={(e) =>
            e.key === "Enter" ? handlePostMessage() : e.stopPropagation()
          }
          onChange={(e) => setCurrentChat(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={currentChat}
        />
        <motion.button
          className="bg-gray-50/10 p-1 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePostMessage}
        >
          <SendIcon />
        </motion.button>
      </div>
      <div>debug: {socket.id}</div>
      <div className="text-xs hidden lg:block">
        position:{" "}
        {characters.map((character) => (
          <div className="flex gap-2">
            <p>{`x: ${Math.round(character.position.x)} y: ${Math.round(
              character.position.y
            )} z: ${Math.round(character.position.z)}`}</p>
            <p>{character.animation}</p>
            <p>{character.rotation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
