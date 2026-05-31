"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Layout } from "antd";
import type { MenuProps } from "antd";
import {
  BookOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  DatabaseOutlined,
  RocketOutlined,
  ToolOutlined,
  AppstoreOutlined,
  ExperimentOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";

const { Sider } = Layout;

const LEVEL_COLORS: Record<string, string> = {
  easy: "#52c41a",
  medium: "#fa8c16",
  advanced: "#f5222d",
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  hooks: <BookOutlined />,
  "modern-hooks": <ThunderboltOutlined />,
  "react-19": <RocketOutlined />,
  "custom-hooks": <ToolOutlined />,
  context: <ApiOutlined />,
  redux: <DatabaseOutlined />,
  patterns: <AppstoreOutlined />,
  "decision-guide": <CompassOutlined />,
};

function buildMenuItems(items: NavItem[]): MenuProps["items"] {
  return items.map((item) => {
    if (item.children) {
      return {
        key: item.path,
        label: item.label,
        icon: MODULE_ICONS[item.key] ?? null,
        children: buildMenuItems(item.children),
      };
    }
    const dot = LEVEL_COLORS[item.key];
    return {
      key: item.path,
      label: dot ? (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: dot, flexShrink: 0, display: "inline-block" }} />
          {item.label}
        </span>
      ) : item.label,
    };
  });
}

function getOpenKeys(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  const openKeys: string[] = [];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    openKeys.push(current);
  }
  return openKeys;
}

type AppSidebarProps = {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
};

export default function AppSidebar({ collapsed, onCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = buildMenuItems(NAV_ITEMS);
  const openKeys = getOpenKeys(pathname);

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? 0 : "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {!collapsed && (
          <Image src="/logo.png" alt="React Learning Hub" width={160} height={40} style={{ objectFit: "contain" }} />
        )}
        {collapsed && (
          <Image src="/logo.png" alt="React Learning Hub" width={32} height={32} style={{ objectFit: "contain" }} />
        )}
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={collapsed ? [] : openKeys}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ borderRight: 0, marginTop: 8 }}
      />
    </Sider>
  );
}
