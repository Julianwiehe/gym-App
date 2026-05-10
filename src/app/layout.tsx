import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mentara — KI-Begleitung für mentales Wohlbefinden",
  description:
    "Mentara ist ein KI-Gesprächsbegleiter auf Deutsch – für Momente, in denen der Kopf voll ist und der Mensch einfach reden möchte.",
  openGraph: {
    title: "Mentara — KI-Begleitung für mentales Wohlbefinden",
    description: "Dein persönlicher KI-Begleiter für schwierige Momente.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
