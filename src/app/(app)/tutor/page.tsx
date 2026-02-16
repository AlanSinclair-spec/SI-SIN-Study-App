"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/user-context";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What is the Law of Accelerating Returns and why does Kurzweil think it matters?",
  "How do Davidson and Rees-Mogg define 'megapolitical' forces?",
  "Compare how both books view the future of nation-states.",
  "What does Kurzweil predict about AI surpassing human intelligence?",
  "Explain the concept of the 'sovereign individual' and why it matters.",
  "How do both books view the declining importance of geography?",
];

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner", desc: "Simple language, more guidance" },
  { value: "intermediate", label: "Intermediate", desc: "Push for deeper connections" },
  { value: "advanced", label: "Advanced", desc: "Challenge everything" },
] as const;

export default function TutorPage() {
  const { user, loading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || isStreaming) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: content.trim(),
          difficulty,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err.error || "Something went wrong. Make sure your KIMI_API_KEY is set in .env.local" },
        ]);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add empty assistant message that we'll build up
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantContent += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
              if (data.conversationId) {
                setConversationId(data.conversationId);
              }
            } catch {
              // skip malformed SSE
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    }

    setIsStreaming(false);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        <div className="h-16 bg-muted rounded animate-pulse" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please sign in to use the AI Tutor.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">AI Socratic Tutor</h1>
            <p className="text-xs text-muted-foreground">
              Powered by Kimi — challenges you to think deeper
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            className="px-2 py-1 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              Start a conversation or pick a topic below.
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.content}
                {isStreaming && i === messages.length - 1 && msg.role === "assistant" && (
                  <span className="inline-block w-2 h-4 bg-foreground/50 animate-pulse ml-0.5" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border pt-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about the books..."
            rows={1}
            className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
