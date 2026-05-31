import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "React Patterns",
  description:
    "Architectural React patterns every developer must know: Suspense and lazy loading, Error Boundaries, Portals, Higher-Order Components, Render Props, and Compound Components.",
  keywords: [
    "React patterns",
    "Suspense",
    "Error Boundary",
    "Portals",
    "HOC",
    "Higher Order Components",
    "Render Props",
    "Compound Components",
  ],
};

export default function PatternsLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
