import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "Decision Guide — When to use what?",
  description:
    "19 real-world React scenarios explained: Context vs Redux, useState vs useReducer, useEffect vs event handlers, useMemo vs useTransition, and more. Find the right tool for your situation.",
  keywords: [
    "React decision guide",
    "Context vs Redux",
    "useState vs useReducer",
    "when to use React hooks",
    "React best practices",
  ],
};

export default function DecisionGuideLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
