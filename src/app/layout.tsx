import type { Metadata, Viewport } from "next";
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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-rana-tigrina.vercel.app";

export const viewport: Viewport = {
  themeColor: "#161614",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Mohammad Munawwar Malook | Senior AI & GenAI Systems Engineer",
  description:
    "Production AI portfolio of Mohammad Munawwar Malook (IIT Madras). Specializing in autonomous multi-agent pipelines, deterministic RAG architectures, and HIPAA-compliant clinical NLP systems.",
  keywords: [
    "Mohammad Munawwar Malook",
    "AI Systems Engineer",
    "Senior AI Engineer",
    "GenAI Engineer",
    "Multi-Agent Systems",
    "LangGraph",
    "LangChain",
    "Deterministic RAG",
    "RAGAS",
    "Clinical NLP",
    "WhisperX",
    "LLaMA 3.2",
    "IIT Madras Data Science",
  ],
  authors: [{ name: "Mohammad Munawwar Malook", url: baseUrl }],
  creator: "Mohammad Munawwar Malook",
  publisher: "Mohammad Munawwar Malook",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mohammad Munawwar Malook | Senior AI & GenAI Systems Engineer",
    description:
      "Autonomous multi-agent architectures, deterministic RAG pipelines, and verified production benchmarks from an IIT Madras Data Science graduate.",
    url: baseUrl,
    siteName: "Mohammad Munawwar Malook — AI Engineering Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Munawwar Malook | Senior AI & GenAI Systems Engineer",
    description:
      "Architecting AI systems that reason, retrieve, and survive contact with production.",
    creator: "@Rana_Tigrina",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: "Mohammad Munawwar Malook",
        jobTitle: "Senior AI/ML & Systems Engineer",
        description:
          "Specialized in autonomous multi-agent pipelines, clinical NLP architectures, and production-grade RAG frameworks with automated evaluation harnesses.",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Indian Institute of Technology Madras (IIT Madras)",
        },
        url: baseUrl,
        sameAs: [
          "https://github.com/Rana-Tigrina",
          "https://www.linkedin.com/in/munawwar-malook/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Mohammad Munawwar Malook Portfolio",
        publisher: {
          "@id": `${baseUrl}/#person`,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
