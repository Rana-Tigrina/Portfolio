import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohammad Munawwar Malook | AI & GenAI Systems Engineer",
  description:
    "Portfolio of Mohammad Munawwar Malook — AI Engineer & Applied Researcher (IIT Madras). Autonomous multi-agent systems, clinical NLP, and production RAG pipelines.",
  keywords: [
    "AI Engineer",
    "GenAI",
    "Multi-Agent Systems",
    "RAG",
    "Clinical NLP",
    "IIT Madras",
    "LangGraph",
    "LangChain",
    "Mohammad Munawwar Malook",
  ],
  authors: [{ name: "Mohammad Munawwar Malook" }],
  creator: "Mohammad Munawwar Malook",
  metadataBase: new URL("https://munawwar.dev"),
  openGraph: {
    title: "Mohammad Munawwar Malook | AI Systems Engineer",
    description: "Architecting AI systems that reason, retrieve, and survive contact with production.",
    url: "https://munawwar.dev",
    siteName: "Mohammad Munawwar Malook Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Munawwar Malook | AI Systems Engineer",
    description: "Architecting AI systems that reason, retrieve, and survive contact with production.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased bg-paper text-ink transition-colors duration-200">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:rounded-token font-mono text-xs shadow-md"
        >
          Skip to content
        </a>
        <div id="content">{children}</div>
      </body>
    </html>
  );
}
