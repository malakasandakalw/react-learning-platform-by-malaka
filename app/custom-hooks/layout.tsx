import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "Custom Hooks",
  description:
    "Build and reuse stateful logic with custom React hooks. Learn useFetch, useLocalStorage, useDebounce, and useIntersectionObserver through composable, real-world patterns.",
  keywords: [
    "custom hooks",
    "useFetch",
    "useLocalStorage",
    "useDebounce",
    "React composition",
    "reusable hooks",
  ],
};

export default function CustomHooksLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
