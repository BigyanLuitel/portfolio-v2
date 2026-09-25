"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiMessageCircle, FiX, FiSend, FiRefreshCw } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  failed?: boolean;
}

const SUGGESTIONS = [
  "What are Bigyan's projects?",
  "What are his main skills?",
  "Tell me about his experience",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const wasNearBottomRef = useRef(true);

  useEffect(() => {
    setSessionId(localStorage.getItem("chat_session_id"));
  }, []);

  // Track whether user is scrolled near the bottom, so we only
  // auto-scroll when it won't yank them away from something they're reading.
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    wasNearBottomRef.current = distanceFromBottom < 80;
  };

  useEffect(() => {
    if (wasNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (isOpen) {
      // New message arrived while user was scrolled up — don't force-scroll.
    }
  }, [messages, isThinking, isOpen]);

  // Unread indicator: flag when an assistant message lands while closed.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && !isOpen) {
      setHasUnread(true);
    }
  }, [messages, isOpen]);

  // Autofocus input when the panel opens; clear unread badge.
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      const t = setTimeout(() => textareaRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape closes; click outside closes.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Lock background scroll on mobile while chat is open.
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Auto-grow the textarea up to a max height.
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  const dispatchMessage = async (text: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: Date.now() },
    ]);
    setIsThinking(true);
    setLastFailedText(null);
    wasNearBottomRef.current = true;

    try {
      const data = await sendChatMessage(text, sessionId);
      setSessionId(data.session_id);
      localStorage.setItem("chat_session_id", data.session_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, timestamp: Date.now() },
      ]);
    } catch {
      setLastFailedText(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
          timestamp: Date.now(),
          failed: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    setInput("");
    dispatchMessage(trimmed);
  };

  const handleRetry = () => {
    if (lastFailedText && !isThinking) {
      dispatchMessage(lastFailedText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <motion.button
        ref={toggleButtonRef}
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-accent text-accent-foreground"
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
        {hasUnread && !isOpen && (
          <span className="absolute w-3 h-3 bg-red-500 rounded-full top-1 right-1 ring-2 ring-background" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-widget-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 flex flex-col overflow-hidden border shadow-xl left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-background border-border rounded-2xl"
            style={{
              bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))",
              height: "min(28rem, 70dvh)",
              maxWidth: "calc(100vw - 2rem)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p
                    id="chat-widget-title"
                    className="text-sm font-medium font-heading"
                  >
                    Ask about Bigyan
                  </p>
                  <p className="text-xs font-body text-muted">
                    AI assistant, may make mistakes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-border/50 text-muted"
              >
                <FiX size={16} />
              </button>
            </div>

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              data-lenis-prevent
              aria-live="polite"
              className="flex flex-col flex-1 gap-4 px-4 py-3 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center gap-3 mt-8">
                  <p className="text-sm text-center font-body text-muted">
                    Ask me about Bigyan&apos;s projects, skills, or experience.
                  </p>
                  <div className="flex flex-col w-full gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => dispatchMessage(s)}
                        className="px-3 py-2 text-sm text-left transition-colors border rounded-lg font-body border-border hover:bg-border/40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
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
                        : msg.failed
                          ? "bg-red-500/10 text-red-500 border border-red-500/30"
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
                  {msg.failed && (
                    <button
                      onClick={handleRetry}
                      disabled={isThinking}
                      className="flex items-center gap-1 mt-1 text-xs font-body text-muted hover:text-foreground disabled:opacity-50"
                    >
                      <FiRefreshCw size={11} /> Try again
                    </button>
                  )}
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

            <div className="flex items-end gap-2 p-3 border-t border-border">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                aria-label="Type your message"
                className="flex-1 text-[16px] leading-normal bg-transparent border rounded-lg resize-none font-body border-border px-3 py-2 focus:outline-none focus:border-accent transition-colors max-h-[120px]"
              />
              <button
                onClick={handleSend}
                disabled={isThinking || !input.trim()}
                aria-label="Send message"
                className="flex items-center justify-center flex-shrink-0 rounded-lg w-9 h-9 bg-accent text-accent-foreground disabled:opacity-40 transition-opacity"
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
