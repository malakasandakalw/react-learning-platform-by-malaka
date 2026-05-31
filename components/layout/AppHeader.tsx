"use client";

import { usePathname } from "next/navigation";
import { Layout, Breadcrumb, Typography, Button } from "antd";
import Link from "next/link";
import { HomeOutlined, GithubOutlined, MenuOutlined } from "@ant-design/icons";
import LevelBadge from "@/components/shared/LevelBadge";
import type { Level } from "@/lib/constants";

const { Header } = Layout;

// Paths that have their own page.tsx and can be linked directly.
const ROOTED_PATHS = new Set([
  "/hooks",
  "/modern-hooks",
  "/react-19",
  "/custom-hooks",
  "/context",
  "/redux",
  "/patterns",
  "/decision-guide",
]);

const LEVEL_SLUGS = new Set(["easy", "medium", "advanced"]);

// Intermediate paths like /hooks/use-state have no page.tsx.
// Resolve them to their "easy" level so the breadcrumb link never 404s.
function resolveHref(path: string): string {
  if (ROOTED_PATHS.has(path)) return path;
  const slug = path.split("/").pop() ?? "";
  if (LEVEL_SLUGS.has(slug)) return path;
  return `${path}/easy`;
}

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    {
      key: "home",
      title: (
        <Link href="/">
          <HomeOutlined />
        </Link>
      ),
    },
  ];

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    path += `/${segments[i]}`;
    const label = segments[i]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const isLast = i === segments.length - 1;
    crumbs.push({
      key: path,
      title: isLast ? (
        <Typography.Text style={{ fontWeight: 500 }}>{label}</Typography.Text>
      ) : (
        <Link href={resolveHref(path)} style={{ color: "inherit" }}>
          {label}
        </Link>
      ),
    });
  }

  return crumbs;
}

function extractLevel(pathname: string): Level | null {
  const last = pathname.split("/").pop();
  if (last === "easy" || last === "medium" || last === "advanced") return last;
  return null;
}

type AppHeaderProps = {
  onMobileMenuToggle: () => void;
  isMobile: boolean;
};

export default function AppHeader({ onMobileMenuToggle, isMobile }: AppHeaderProps) {
  const pathname = usePathname();
  const allCrumbs = buildBreadcrumbs(pathname);
  // On mobile: home + last 2 segments so context is still readable (e.g. "Use State > Easy")
  // For paths with ≤ 3 crumbs total (including home) show all of them
  const breadcrumbs = isMobile
    ? allCrumbs.length <= 3
      ? allCrumbs
      : [allCrumbs[0], ...allCrumbs.slice(-2)]
    : allCrumbs;
  const level = extractLevel(pathname);

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        padding: isMobile ? "0 12px" : "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        transition: "margin-left 0.2s",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 18 }} />}
            onClick={onMobileMenuToggle}
            style={{ flexShrink: 0, padding: "0 4px" }}
          />
        )}
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16, flexShrink: 0 }}>
        {level && <LevelBadge level={level} />}
        <a
          href="https://github.com/malakasandakalw/react-learning-platform-by-malaka"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", color: "#555", fontSize: 20 }}
          title="View on GitHub"
        >
          <GithubOutlined />
        </a>
      </div>
    </Header>
  );
}
