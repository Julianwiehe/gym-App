import Link from "next/link";

const STATS = [
  { value: "142", unit: "Tage", label: "durchschnittliche Wartezeit auf einen Therapieplatz in Deutschland" },
  { value: "30%", unit: "", label: "der Deutschen leiden unter psychischen Beschwerden" },
  { value: "€5", unit: "/Mitarbeiter", label: "pro Monat – steuerlich gefördert über §20b SGB V" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Mitarbeiter schreibt", desc: "Anonym, jederzeit, auf Deutsch. Kein Formular, kein Wartezimmer, keine Scham." },
  { step: "02", title: "Begleiter antwortet", desc: "Warm, menschlich, ohne Bewertung. Hilft beim Nachdenken und Sortieren von Gedanken." },
  { step: "03", title: "Arbeitgeber investiert", desc: "Einmal einrichten, monatlich zahlen. ROI durch weniger Ausfälle, mehr Wohlbefinden." },
];

const PROBLEMS = [
  "Mitarbeiter reden nicht über Stress und Überforderung – weil niemand fragt.",
  "Externe Beratung ist teuer. Interne HR hat keine Zeit.",
  "Der nächste freie Therapieplatz: in 5 Monaten.",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight">mentara</span>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="#wie-es-funktioniert" className="hover:text-white transition-colors">Wie es funktioniert</a>
          <a href="#fuer-arbeitgeber" className="hover:text-white transition-colors">Für Arbeitgeber</a>
          <Link
            href="/chat"
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Demo testen
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-block bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          KI-Begleitung für mentales Wohlbefinden
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
          Wenn Reden hilft,<br />
          <span className="text-white/40">aber niemand zuhört.</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Mentara ist ein KI-Gesprächsbegleiter auf Deutsch – für Momente, in denen der Kopf voll ist,
          der nächste Therapieplatz Monate entfernt ist und der Mensch einfach reden möchte.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/chat"
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/90 transition-colors"
          >
            Kostenlos ausprobieren
          </Link>
          <a
            href="#fuer-arbeitgeber"
            className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-white/40 transition-colors"
          >
            Für Arbeitgeber →
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold mb-1">
                {s.value}<span className="text-white/40 text-xl ml-1">{s.unit}</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Das Problem kennt jeder Arbeitgeber.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map((p) => (
            <div key={p} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-400 text-lg font-bold">✕</span>
              </div>
              <p className="text-white/70 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="wie-es-funktioniert" className="bg-white/5 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-center">Wie Mentara funktioniert</h2>
          <p className="text-white/50 text-center mb-14 max-w-xl mx-auto">
            Kein Therapeut, kein Arzt – ein Begleiter. Warm, verfügbar, kein Urteil.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step}>
                <div className="text-6xl font-bold text-white/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Probiere es jetzt aus.</h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Keine Anmeldung. Kein Abo. Einfach schreiben und sehen wie es sich anfühlt.
          </p>
          <Link
            href="/chat"
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/90 transition-colors inline-block"
          >
            Demo öffnen →
          </Link>
        </div>
      </section>

      {/* For employers */}
      <section id="fuer-arbeitgeber" className="border-t border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs text-white/40 uppercase tracking-widest mb-4">Für Arbeitgeber</div>
              <h2 className="text-3xl font-bold mb-6 leading-tight">
                Betriebliche Gesundheitsförderung,<br />die wirklich genutzt wird.
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Mentara lässt sich als BGF-Maßnahme nach §20b SGB V einsetzen –
                steuerlich gefördert, einfach einzurichten, und dein Team nutzt es tatsächlich.
              </p>
              <ul className="space-y-3 text-white/70">
                {[
                  "€5 pro Mitarbeiter/Monat – alles inklusive",
                  "Keine IT-Integration nötig – läuft im Browser",
                  "Anonyme Nutzung – keine Daten über einzelne Mitarbeiter",
                  "Onboarding in unter 30 Minuten",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-semibold mb-6 text-lg">Interesse? Schreib uns.</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/50 block mb-1">Dein Name</label>
                  <input
                    type="text"
                    placeholder="Max Mustermann"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/50 block mb-1">Unternehmen & Mitarbeiterzahl</label>
                  <input
                    type="text"
                    placeholder="Musterfirma GmbH, ~50 Mitarbeiter"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/50 block mb-1">Deine E-Mail</label>
                  <input
                    type="email"
                    placeholder="max@musterfirma.de"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
                  />
                </div>
                <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                  Gespräch anfragen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-semibold text-white/50">mentara</span>
          <span>Kein medizinisches Produkt. Kein Ersatz für professionelle Therapie.</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
