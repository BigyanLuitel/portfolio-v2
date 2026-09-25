"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
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

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, timestamp: Date.now() },
    ]);
    setInput("");
    setIsThinking(true);

    try {
      const data = await sendChatMessage(trimmed, sessionId);
      setSessionId(data.session_id);
      localStorage.setItem("chat_session_id", data.session_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, timestamp: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-accent text-accent-foreground"
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
        }}
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
            className="fixed z-50 flex flex-col overflow-hidden border shadow-xl left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-background border-border rounded-2xl"
            style={{
              bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))",
              height: "min(28rem, 70vh)",
              maxWidth: "calc(100vw - 2rem)",
            }}
          >
            <div className="flex items-center px-4 py-3 border-b border-border gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium font-heading">
                  Ask about Bigyan
                </p>
                <p className="text-xs font-body text-muted">
                  AI assistant, may make mistakes
                </p>
              </div>
            </div>

            <div
              data-lenis-prevent
              className="flex flex-col flex-1 gap-4 px-4 py-3 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]"
            >
              {messages.length === 0 && (
                <p className="mt-8 text-sm text-center font-body text-muted">
                  Ask me about Bigyan&apos;s projects, skills, or experience.
                </p>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`font-body text-sm px-3.5 py-2.5 rounded-xl max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-border/50"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose-chat">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <span className="text-[10px] font-body text-muted mt-1 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex gap-1 self-start px-3.5 py-2.5 rounded-xl bg-border/50 w-fit"
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

            <div className="flex gap-2 p-3 border-t border-border">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm bg-transparent border rounded-lg font-body border-border focus:outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isThinking}
                aria-label="Send message"
                className="flex items-center justify-center flex-shrink-0 rounded-lg w-9 h-9 bg-accent text-accent-foreground disabled:opacity-50"
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
