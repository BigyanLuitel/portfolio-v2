"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { sendChatMessage } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(localStorage.getItem("chat_session_id"));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsThinking(true);

    try {
      const data = await sendChatMessage(trimmed, sessionId);
      setSessionId(data.session_id);
      localStorage.setItem("chat_session_id", data.session_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg"
        aria-label="Toggle chat"
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[28rem] bg-background border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="font-heading font-medium text-sm">
                Ask about Bigyan
              </p>
              <p className="font-body text-xs text-muted">
                AI assistant, may make mistakes
              </p>
            </div>

            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]"
            >
              {messages.length === 0 && (
                <p className="font-body text-sm text-muted text-center mt-8">
                  Ask me about Bigyan&apos;s projects, skills, or experience.
                </p>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`font-body text-sm px-3.5 py-2.5 rounded-xl max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground self-end"
                      : "bg-border/50 self-start"
                  }`}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex gap-1 px-3.5 py-2.5 rounded-xl bg-border/50 self-start w-fit"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-muted"
                    />
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 font-body text-sm bg-transparent border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isThinking}
                aria-label="Send message"
                className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-50 flex-shrink-0"
              >
                <FiSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
