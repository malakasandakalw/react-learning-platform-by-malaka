import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

export const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://react-learning-hub-by-malaka.netlify.app";

const description =
  "A structured, code-first learning platform for modern React. Master hooks, Context API, Redux Toolkit, and React 19 through Easy, Medium, and Advanced real-API examples.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "React Learning Hub by Malaka",
    template: "%s | React Learning Hub",
  },
  description,
  keywords: [
    "React",
    "React hooks",
    "useState",
    "useEffect",
    "useReducer",
    "useMemo",
    "useCallback",
    "useRef",
    "useContext",
    "Context API",
    "Redux Toolkit",
    "React 19",
    "useOptimistic",
    "useTransition",
    "useDeferredValue",
    "custom hooks",
    "React patterns",
    "frontend learning",
    "JavaScript",
  ],
  authors: [{ name: "Malaka Sandakal", url: "https://www.linkedin.com/in/malakasandakal/" }],
  creator: "Malaka Sandakal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "React Learning Hub",
    title: "React Learning Hub by Malaka",
    description,
    images: [{ url: "/logo.png", width: 260, height: 72, alt: "React Learning Hub by Malaka" }],
  },
  twitter: {
    card: "summary",
    title: "React Learning Hub by Malaka",
    description,
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
