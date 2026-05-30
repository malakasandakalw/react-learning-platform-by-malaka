"use client";

import { usePathname, useRouter } from "next/navigation";
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
    return {
      key: item.path,
      label: item.label,
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
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>
            React Learning Hub
          </span>
        )}
        {collapsed && (
          <span style={{ color: "#1677ff", fontWeight: 700, fontSize: 18 }}>R</span>
        )}
      </div>

      <Menu
        theme="dark"
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
