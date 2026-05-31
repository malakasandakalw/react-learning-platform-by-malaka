"use client";

import { usePathname } from "next/navigation";
import { Layout, Breadcrumb, Typography } from "antd";
import Link from "next/link";
import { HomeOutlined, GithubOutlined } from "@ant-design/icons";
import LevelBadge from "@/components/shared/LevelBadge";
import type { Level } from "@/lib/constants";

const { Header } = Layout;

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
        <Link href={path} style={{ color: "inherit" }}>
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
  sidebarCollapsed: boolean;
};

export default function AppHeader({ sidebarCollapsed }: AppHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);
  const level = extractLevel(pathname);

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        transition: "margin-left 0.2s",
      }}
    >
      <Breadcrumb items={breadcrumbs} />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
