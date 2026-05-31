import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "Context API",
  description:
    "Share state across React components without prop drilling. Learn createContext, useContext, Context with useReducer, and multi-context patterns through progressive examples.",
  keywords: [
    "Context API",
    "useContext",
    "createContext",
    "React state management",
    "prop drilling",
  ],
};

export default function ContextLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
