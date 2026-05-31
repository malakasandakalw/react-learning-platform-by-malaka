import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "React 19",
  description:
    "New hooks exclusive to React 19: use() for reading promises during render, useActionState for form action state, and useFormStatus for tracking parent form submission.",
  keywords: ["React 19", "use hook", "useActionState", "useFormStatus", "React Server Components", "React 19 hooks"],
};

export default function React19Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
