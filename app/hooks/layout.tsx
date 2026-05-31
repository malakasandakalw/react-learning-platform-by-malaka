import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "Core Hooks",
  description:
    "Master the fundamental React hooks: useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, and useReducer. Easy, Medium, and Advanced examples with real APIs.",
  keywords: [
    "useState",
    "useEffect",
    "useRef",
    "useMemo",
    "useCallback",
    "useReducer",
    "useLayoutEffect",
    "React hooks",
  ],
};

export default function HooksLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
