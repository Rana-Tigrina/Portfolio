"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "@/lib/sound";
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Square,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  Check,
  Bot,
  User,
  ArrowUpRight,
  Terminal,
  Zap,
  WifiOff,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  {
    label: "Why Hire Munawwar?",
    prompt: "Why should we hire Munawwar? What sets his engineering track record apart?",
  },
  {
    label: "Healthcare Claims Audit",
    prompt: "Can you explain how your LangGraph Healthcare Claims Audit multi-agent pipeline works?",
  },
  {
    label: "Jan Elaaj Diagnostic AI",
    prompt: "What did you build at Jan Elaaj with BioClinicalBERT and clinical dialogue?",
  },
  {
    label: "Teletherapy Research",
    prompt: "Tell me about your published teletherapy paper using gaze tracking and facial expressions.",
  },
  {
    label: "RAG & Observability",
    prompt: "How did you set up automated CI/CD gating and evaluation with RAGAS, LangSmith, and Langfuse?",
  },
];

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Track online/offline status
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, scrollToBottom]);

  // Global event listener for custom dispatch or Ctrl+J / Cmd+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        sound.playClick(850);
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        sound.playClick(600);
        setIsOpen(false);
      }
    };

    const handleCustomOpen = (e: CustomEvent<{ query?: string }>) => {
      sound.playClick(850);
      setIsOpen(true);
      if (e.detail?.query) {
        setTimeout(() => {
          sendMessage(e.detail.query);
        }, 150);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(
      "open-portfolio-chat",
      handleCustomOpen as unknown as EventListener
    );

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(
        "open-portfolio-chat",
        handleCustomOpen as unknown as EventListener
      );
    };
  }, [isOpen]);

  const toggleOpen = () => {
    sound.playClick(isOpen ? 650 : 900);
    setIsOpen(!isOpen);
  };

  const handleClear = () => {
    sound.playClick(600);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    sound.playSuccess();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle internal anchor jumps from markdown links (e.g. #work)
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      sound.playClick(850);
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const query = (overrideText || input).trim();
    if (!query || isLoading) return;

    sound.playClick(820);
    setInput("");

    // Check client-side internet connectivity
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const userMessage: Message = {
        id: "msg-" + Date.now(),
        role: "user",
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const offlineAssistantMessage: Message = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: "You appear to be offline. Please check your internet connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMessage, offlineAssistantMessage]);
      return;
    }

    const userMessage: Message = {
      id: "msg-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    const assistantId = "msg-" + (Date.now() + 1);
    const initialAssistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...nextMessages, initialAssistantMessage]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No readable stream in response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let lineBuffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split("\n");
        // Keep the last incomplete line fragment in the buffer
        lineBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr === "[DONE]") {
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              accumulated += parsed.content;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === assistantId ? { ...msg, content: accumulated } : msg))
              );
            } else if (parsed.error) {
              accumulated += `\n\n*[Notice: ${parsed.error}]*`;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === assistantId ? { ...msg, content: accumulated } : msg))
              );
            }
          } catch {
            // Buffer split across chunks, ignore partial JSON
          }
        }
      }

      // Process any remaining tail in lineBuffer
      if (lineBuffer.trim().startsWith("data: ")) {
        const jsonStr = lineBuffer.trim().slice(6).trim();
        if (jsonStr && jsonStr !== "[DONE]") {
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              accumulated += parsed.content;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === assistantId ? { ...msg, content: accumulated } : msg))
              );
            }
          } catch {
            // Ignore trailing malformed text
          }
        }
      }

      // Safety: Never leave an empty message bubble if stream finished with no content
      if (!accumulated.trim()) {
        const fallback =
          "Apologies, no output was received from the inference runtime. Please check your internet connection and try clicking Retry.";
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fallback } : msg))
        );
      } else {
        sound.playChime();
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        const errorMsg = (err as Error)?.message || "Failed to generate response";
        const isNetworkErr =
          errorMsg.toLowerCase().includes("fetch") ||
          errorMsg.toLowerCase().includes("network") ||
          errorMsg.toLowerCase().includes("connection");

        const displayNotice = isNetworkErr
          ? "Network connection issue: Unable to reach the inference service. Please check your internet connection and retry."
          : `Apologies, I ran into an issue connecting to the neural inference service (${errorMsg}). Please try again shortly.`;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: msg.content || displayNotice,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    sound.playClick(600);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper to parse inline tokens (links, bold, italic, code) while stripping stray formatting marks
  const parseInline = (text: string): React.ReactNode[] => {
    // Matches [label](#anchor), ***bolditalic***, **bold**, *italic*, `code`
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|(?<!\*)\*(?!\*)[^*]+(?<!\*)\*(?!\*)|`[^`]+`)/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        // Plain text segment - clean up any stray asterisks or stray hashes
        const plainText = text.substring(lastIdx, match.index).replace(/\*+/g, "").replace(/^#+\s*/, "");
        if (plainText) parts.push(plainText);
      }

      const token = match[0];
      if (token.startsWith("[") && token.includes("](")) {
        const labelMatch = token.match(/\[([^\]]+)\]/);
        const hrefMatch = token.match(/\(([^)]+)\)/);
        const label = labelMatch ? labelMatch[1] : token;
        const href = hrefMatch ? hrefMatch[1] : "#";
        parts.push(
          <a
            key={`l-${match.index}`}
            href={href}
            onClick={(e) => handleAnchorClick(e, href)}
            className="inline-flex items-center gap-0.5 text-accent hover:underline font-medium cursor-pointer"
          >
            <span>{label}</span>
            {href.startsWith("#") ? <ArrowUpRight className="w-3 h-3 inline" /> : null}
          </a>
        );
      } else if (token.startsWith("***") && token.endsWith("***")) {
        parts.push(
          <strong key={`bi-${match.index}`} className="font-bold italic text-ink">
            {token.slice(3, -3)}
          </strong>
        );
      } else if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={`b-${match.index}`} className="font-semibold text-ink">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={`i-${match.index}`} className="italic text-ink font-medium">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={`c-${match.index}`}
            className="px-1 py-0.5 bg-paper border border-line rounded-token font-mono text-[11px] text-accent"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      lastIdx = match.index + token.length;
    }

    if (lastIdx < text.length) {
      const remaining = text.substring(lastIdx).replace(/\*+/g, "").replace(/^#+\s*/, "");
      if (remaining) parts.push(remaining);
    }

    return parts.length > 0 ? parts : [text.replace(/\*+/g, "").replace(/^#+\s*/, "")];
  };

  // Robust Markdown renderer tailored for editorial code, clean headers, and lists
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = "";

    lines.forEach((rawLine, index) => {
      // 1. Code blocks start/end
      if (rawLine.trim().startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div
              key={`code-${index}`}
              className="my-2 p-2.5 bg-paper rounded-token border border-line font-mono text-[11px] overflow-x-auto text-ink"
            >
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-line/40 text-[10px] text-ink-soft">
                <span>{codeBlockLang || "code"}</span>
              </div>
              <pre className="whitespace-pre">{codeBlockContent.join("\n")}</pre>
            </div>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeBlockLang = rawLine.trim().replace("```", "");
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(rawLine);
        return;
      }

      const cleanLine = rawLine.trim();

      // 2. Empty line spacing
      if (!cleanLine) {
        elements.push(<div key={`sp-${index}`} className="h-1.5" />);
        return;
      }

      // 3. Horizontal rules
      if (cleanLine === "---" || cleanLine === "***" || cleanLine === "___") {
        elements.push(<hr key={`hr-${index}`} className="my-2 border-line/60" />);
        return;
      }

      // 4. Headings (#, ##, ###, ####) - Strip hashes and render as stylish editorial header
      if (/^#{1,6}\s+/.test(cleanLine)) {
        const headingText = cleanLine.replace(/^#{1,6}\s+/, "");
        elements.push(
          <div
            key={`h-${index}`}
            className="font-mono font-bold text-xs text-accent mt-2.5 mb-1 tracking-tight flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span>{parseInline(headingText)}</span>
          </div>
        );
        return;
      }

      // 5. Bullet lists (- item, * item, + item, • item) - Strip prefix and render clean bullet
      if (/^[-*+•]\s+/.test(cleanLine)) {
        const bulletText = cleanLine.replace(/^[-*+•]\s+/, "");
        elements.push(
          <div key={`li-${index}`} className="flex items-start gap-2 text-xs leading-relaxed my-0.5 pl-1">
            <span className="text-accent mt-1 text-[9px] flex-shrink-0">✦</span>
            <div className="flex-1">{parseInline(bulletText)}</div>
          </div>
        );
        return;
      }

      // 6. Numbered lists (1. item, 2. item)
      if (/^\d+\.\s+/.test(cleanLine)) {
        const numMatch = cleanLine.match(/^(\d+)\.\s+(.*)$/);
        const num = numMatch ? numMatch[1] : "1";
        const itemText = numMatch ? numMatch[2] : cleanLine;
        elements.push(
          <div key={`num-${index}`} className="flex items-start gap-2 text-xs leading-relaxed my-0.5 pl-1">
            <span className="font-mono text-[10px] text-accent font-semibold flex-shrink-0 mt-0.5">{num}.</span>
            <div className="flex-1">{parseInline(itemText)}</div>
          </div>
        );
        return;
      }

      // 7. Blockquotes (> quote)
      if (cleanLine.startsWith(">")) {
        const quoteText = cleanLine.replace(/^>\s*/, "");
        elements.push(
          <div key={`q-${index}`} className="border-l-2 border-accent pl-2.5 py-0.5 my-1 text-xs italic text-ink-soft">
            {parseInline(quoteText)}
          </div>
        );
        return;
      }

      // 8. Regular paragraph
      elements.push(
        <p key={`p-${index}`} className="text-xs leading-relaxed my-0.5">
          {parseInline(cleanLine)}
        </p>
      );
    });

    return elements;
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-2.5 bg-paper border border-line rounded-token shadow-xl hover:border-accent hover:shadow-2xl transition-all cursor-pointer select-none"
          title="Open Munawwar AI Portfolio Copilot (Ctrl+J or ⌘J)"
          aria-label="Open Munawwar AI Portfolio Copilot"
        >
          {/* Animated pulsing indicator */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 rounded-full bg-accent animate-ping opacity-75" />
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>

          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs font-semibold text-ink group-hover:text-accent transition-colors">
              Copilot
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 bg-paper-2 border border-line rounded-token text-accent font-medium">
              Live
            </span>
          </div>

          <kbd className="hidden md:inline-block font-mono text-[9px] text-ink-soft/70 px-1 py-0.5 bg-paper-2 border border-line rounded-token">
            ⌘J
          </kbd>
        </motion.button>
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className={`fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-20 w-auto sm:w-[440px] h-[82vh] sm:h-[600px] max-h-[85vh] bg-paper border border-line rounded-token shadow-2xl flex flex-col overflow-hidden overscroll-contain transition-all duration-200 ${
              isExpanded
                ? "sm:w-[680px] sm:h-[780px] max-h-[88vh]"
                : ""
            }`}
            role="dialog"
            aria-label="Mohammad Munawwar Malook Portfolio Copilot"
          >
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-line bg-paper-2/70 select-none">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-token bg-accent-soft text-accent">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold tracking-tight text-ink">
                      MUNAWWAR COPILOT
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-accent animate-pulse" : "bg-amber-500"}`} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-soft">
                    <span>Architecture Intelligence</span>
                    <span>·</span>
                    <span className={`flex items-center gap-0.5 ${isOnline ? "text-accent" : "text-amber-500"}`}>
                      {isOnline ? (
                        <>
                          <Zap className="w-2.5 h-2.5" /> Active
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-2.5 h-2.5" /> Offline
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-token transition-colors cursor-pointer"
                    title="Clear Conversation"
                    aria-label="Clear Conversation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick(750);
                    setIsExpanded(!isExpanded);
                  }}
                  className="hidden sm:inline-flex p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-token transition-colors cursor-pointer"
                  title={isExpanded ? "Collapse view" : "Expand view"}
                  aria-label="Toggle Expand"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    sound.playClick(600);
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-ink-soft hover:text-ink hover:bg-paper rounded-token transition-colors cursor-pointer"
                  title="Close (Esc)"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Offline Network Warning Banner */}
            {!isOnline && (
              <div className="px-3.5 py-1.5 bg-amber-500/10 border-b border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-mono flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 animate-pulse flex-shrink-0" />
                  <span>Internet connection offline</span>
                </div>
                <span className="text-[10px] opacity-80">Reconnecting...</span>
              </div>
            )}

            {/* Conversation Messages Container */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 font-sans text-ink"
            >
              {messages.length === 0 ? (
                <div className="py-6 flex flex-col items-center text-center space-y-4 animate-fade-in">
                  <div className="w-10 h-10 rounded-token bg-accent-soft border border-accent/30 flex items-center justify-center text-accent">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 max-w-sm">
                    <h3 className="font-mono text-sm font-semibold text-ink">
                      Ask anything about Munawwar&apos;s work
                    </h3>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Trained on Munawwar&apos;s verified master resume and engineering architectures. Powered by custom low-latency neural inference.
                    </p>
                  </div>

                  {/* Guardrail badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-paper-2 border border-line rounded-token text-[10px] font-mono text-ink-soft">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Domain-Guarded: Mohammad Munawwar Malook Portfolio</span>
                  </div>

                  {/* Starter prompt chips */}
                  <div className="w-full pt-3 space-y-1.5 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft block mb-1">
                      Suggested Inquiries
                    </span>
                    {STARTER_PROMPTS.map((starter, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(starter.prompt)}
                        className="w-full flex items-center justify-between p-2 text-xs font-mono text-ink bg-paper-2 hover:bg-accent-soft hover:text-accent border border-line rounded-token transition-all text-left cursor-pointer group"
                      >
                        <span className="truncate pr-2">{starter.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-ink-soft group-hover:text-accent transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const displayContent = isUser
                    ? msg.content
                    : msg.content.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").trimStart();

                  // Find previous user query to allow 1-click retry if interrupted
                  const previousUserMsg = !isUser
                    ? messages.slice(0, idx).reverse().find((m) => m.role === "user")?.content
                    : undefined;

                  const isBlankAssistant = !isUser && !displayContent.trim() && !isLoading;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-token bg-accent-soft border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[85%] rounded-token px-3.5 py-2.5 text-xs ${
                          isUser
                            ? "bg-ink text-paper"
                            : "bg-paper-2 border border-line text-ink"
                        }`}
                      >
                        {isBlankAssistant ? (
                          <div className="space-y-2 py-0.5">
                            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>Response interrupted or connection lost</span>
                            </div>
                            <p className="text-xs text-ink-soft leading-relaxed">
                              No response was received from the inference runtime. Please check your network and click below to retry.
                            </p>
                            {previousUserMsg && (
                              <button
                                onClick={() => sendMessage(previousUserMsg)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 bg-paper border border-line hover:border-accent text-accent rounded-token text-xs font-mono transition-colors cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Retry question</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">{renderMarkdown(displayContent)}</div>
                        )}

                        {/* Blinking streaming indicator if still responding and empty */}
                        {!isUser && isLoading && !displayContent && (
                          <div className="flex items-center gap-1 py-1 text-ink-soft">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-150" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-300" />
                          </div>
                        )}

                        {/* Blinking cursor while content is still streaming */}
                        {!isUser && isLoading && displayContent && (
                          <span className="inline-block w-1.5 h-3 bg-accent animate-pulse ml-0.5 align-middle" />
                        )}

                        {/* Copy button for assistant responses */}
                        {!isUser && displayContent && (
                          <div className="mt-2 pt-1 border-t border-line/40 flex items-center justify-between text-[10px] font-mono text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>{msg.timestamp}</span>
                            <button
                              onClick={() => copyToClipboard(displayContent, msg.id)}
                              className="flex items-center gap-1 hover:text-ink cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-accent" />
                                  <span className="text-accent">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded-token bg-paper-2 border border-line flex items-center justify-center text-ink-soft flex-shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-line bg-paper-2/40">
              <div className="relative flex items-end gap-2 bg-paper border border-line rounded-token focus-within:border-accent transition-colors p-2 shadow-inner">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Munawwar's projects, systems, or research..."
                  rows={1}
                  className="flex-1 max-h-24 min-h-[36px] bg-transparent text-[13px] sm:text-xs text-ink placeholder:text-ink-soft/70 resize-none focus:outline-none py-1.5 px-1 font-sans touch-manipulation"
                />

                {isLoading ? (
                  <button
                    onClick={handleStop}
                    className="p-2 rounded-token bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer flex-shrink-0"
                    title="Stop Generating"
                    aria-label="Stop Generating"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className="p-2 rounded-token bg-ink text-paper hover:bg-accent disabled:opacity-30 disabled:hover:bg-ink transition-colors cursor-pointer flex-shrink-0"
                    title="Send message (Enter)"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Hint Footer */}
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-ink-soft px-1">
                <span>Enter to send · Shift+Enter for new line</span>
                <span className="text-accent font-medium">Neural Inference Runtime</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
