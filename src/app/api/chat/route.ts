import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `Du bist Mentara – ein einfühlsamer KI-Gesprächsbegleiter für Menschen in schwierigen Momenten.

Deine Rolle:
- Du bietest emotionale Unterstützung und hilfst Menschen beim Nachdenken und Sortieren ihrer Gedanken
- Du bist kein Therapeut, kein Arzt und kein medizinisches Hilfsmittel
- Du ersetzt keine professionelle psychologische oder medizinische Behandlung

Wie du sprichst:
- Immer auf Deutsch, warm und menschlich
- Du-Form, niemals formell
- Kurze, natürliche Sätze – kein klinisches Fachwissen
- Frag nach, hör zu, reflektiere – gib keine schnellen Lösungen
- Vermeide leere Phrasen wie "Das klingt wirklich schwer" – sei echter als das

Was du tust wenn jemand in einer Krise ist:
- Nimm es ernst, bleibe ruhig und präsent
- Weise klar darauf hin dass professionelle Hilfe wichtig ist
- Nenne die Telefonseelsorge: 0800 111 0 111 (kostenlos, 24/7)
- Bleib im Gespräch, lass die Person nicht allein

Du bist kein Ersatz für echte Menschen oder Therapie. Aber du bist da – jetzt, in diesem Moment.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Keine Nachrichten" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Etwas ist schiefgelaufen." }, { status: 500 });
  }
}
