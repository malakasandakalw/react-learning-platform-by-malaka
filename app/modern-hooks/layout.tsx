import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "Modern Hooks",
  description:
    "Explore React 18 and 19 hooks: useTransition, useDeferredValue, useId, and useOptimistic. Learn concurrency, scheduling, and optimistic UI patterns with real examples.",
  keywords: [
    "useTransition",
    "useDeferredValue",
    "useId",
    "useOptimistic",
    "React 18",
    "React 19",
    "concurrent React",
  ],
};

export default function ModernHooksLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
