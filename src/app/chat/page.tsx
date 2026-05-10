"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "Ich bin gerade total überwältigt von der Arbeit.",
  "Ich weiß nicht mehr was ich wirklich will.",
  "Ich fühle mich seit Wochen leer und antriebslos.",
  "Ich streite mich ständig mit meinem Partner.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStarted(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, etwas ist schiefgelaufen. Versuch es nochmal." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-white/80 transition-colors">
          mentara
        </Link>
        <span className="text-xs text-white/30 hidden md:block">
          Kein medizinisches Produkt · Kein Ersatz für Therapie
        </span>
        <div className="w-20" />
      </header>

      {/* Chat area */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
        {!started ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-8">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl">
              ◎
            </div>
            <h1 className="text-2xl font-bold mb-3">Hallo, ich bin Mentara.</h1>
            <p className="text-white/50 max-w-md leading-relaxed mb-10">
              Du musst nichts erklären, dich nicht rechtfertigen und nichts perfekt formulieren.
              Schreib einfach was dich gerade beschäftigt.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-6 pb-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs mr-3 mt-1 flex-shrink-0">
                    ◎
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-white/10 text-white rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs mr-3 mt-1">
                  ◎
                </div>
                <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex gap-3 items-end bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus-within:border-white/30 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Schreib was dich beschäftigt..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-white/30 resize-none focus:outline-none text-sm leading-relaxed max-h-32"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="text-white/50 hover:text-white disabled:opacity-30 transition-colors flex-shrink-0 pb-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-center text-white/20 text-xs mt-3">
            Mentara ist kein Ersatz für professionelle Hilfe.
            Bei Krisen: <span className="text-white/40">Telefonseelsorge 0800 111 0 111</span> (kostenlos, 24/7)
          </p>
        </div>
      </main>
    </div>
  );
}
