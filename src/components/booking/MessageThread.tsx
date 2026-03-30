"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  createdAt: string | Date;
  sender: { email: string; characterProfile?: { name: string } | null; companyProfile?: { name: string } | null };
  senderId: string;
}

interface MessageThreadProps {
  bookingId: string;
  currentUserId: string;
  initialMessages: Message[];
}

export function MessageThread({ bookingId, currentUserId, initialMessages }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      sender: { email: "you" },
      senderId: currentUserId,
    };
    setMessages((prev) => [...prev, optimistic]);
    setContent("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: optimistic.content }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? message : m)));
      }
    } finally {
      setSending(false);
    }
  }

  function getSenderName(msg: Message) {
    return msg.sender.characterProfile?.name ?? msg.sender.companyProfile?.name ?? msg.sender.email;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-sm text-slate-700">Messages</h3>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-[10px]">
                  {getSenderName(msg).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[75%] space-y-1 ${isMine ? "items-end" : ""}`}>
                <p className={`text-xs text-slate-400 ${isMine ? "text-right" : ""}`}>
                  {isMine ? "You" : getSenderName(msg)}
                </p>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    isMine ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {msg.content}
                </div>
                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Textarea
          placeholder="Write a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
          }}
          className="min-h-[60px] resize-none"
          rows={2}
        />
        <Button type="submit" size="icon" disabled={sending || !content.trim()} className="shrink-0 self-end">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
