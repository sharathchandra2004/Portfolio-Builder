import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "folio — your work, beautifully told",
  description: "Create a portfolio that feels like you, without spending hours building it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${dmSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
