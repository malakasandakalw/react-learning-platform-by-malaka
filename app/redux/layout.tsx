import type { Metadata } from "next";
import SectionLayout from "@/components/layout/SectionLayout";

export const metadata: Metadata = {
  title: "Redux Toolkit",
  description:
    "Manage global state with Redux Toolkit. Learn createSlice, createAsyncThunk, typed hooks, and RTK Query through hands-on examples backed by real APIs.",
  keywords: ["Redux Toolkit", "createSlice", "createAsyncThunk", "RTK Query", "Redux", "global state management"],
};

export default function ReduxLayout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
