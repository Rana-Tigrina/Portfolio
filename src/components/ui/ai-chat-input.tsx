"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { sound } from "@/lib/sound";

export interface PromptInputMeta {
  model: string;
  effort: "low" | "medium" | "high";
  attachments: File[];
}

export interface PromptInputProps {
  onSubmit: (message: string, meta: PromptInputMeta) => void;
  placeholder?: string;
  isLoading?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  autoFocus?: boolean;
}

export function PromptInput({
  onSubmit,
  placeholder = "Ask anything about Munawwar's work...",
  isLoading = false,
  onStop,
  disabled = false,
  className = "",
  defaultValue = "",
  autoFocus = false,
}: PromptInputProps) {
  const [text, setText] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 40), 140);
    textarea.style.height = `${nextHeight}px`;
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;

    sound.playClick(850);
    onSubmit(trimmed, {
      model: "auto",
      effort: "medium",
      attachments: [],
    });

    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-paper/95 backdrop-blur-xl border border-line focus-within:border-accent/80 focus-within:ring-2 focus-within:ring-accent/20 shadow-md transition-all ${className}`}
    >
      <div className="p-2.5 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          autoFocus={autoFocus}
          rows={1}
          className="flex-1 bg-transparent text-[13px] sm:text-sm text-ink placeholder:text-ink-soft/60 resize-none focus:outline-none font-sans leading-relaxed min-h-[40px] max-h-[140px] py-1.5 px-2 touch-manipulation"
        />

        <div className="flex items-center shrink-0 mb-0.5">
          {isLoading ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick(600);
                onStop?.();
              }}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="Stop Generation"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="p-2 rounded-xl bg-ink text-paper hover:bg-accent disabled:opacity-25 disabled:hover:bg-ink transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed active:scale-95"
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
