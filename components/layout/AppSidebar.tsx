"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Layout, Drawer, Button } from "antd";
import type { MenuProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  BookOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  DatabaseOutlined,
  RocketOutlined,
  ToolOutlined,
  AppstoreOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { LEVEL_DOT_COLORS } from "@/lib/constants";

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
    const dot = LEVEL_DOT_COLORS[item.key as keyof typeof LEVEL_DOT_COLORS];
    return {
      key: item.path,
      label: dot ? (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: dot,
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          {item.label}
        </span>
      ) : (
        item.label
      ),
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
  mobileOpen: boolean;
  onMobileClose: () => void;
  isMobile: boolean;
};

export default function AppSidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
  isMobile,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = buildMenuItems(NAV_ITEMS);
  const openKeys = getOpenKeys(pathname);

  function handleNavigate(key: string) {
    router.push(key);
    if (isMobile) onMobileClose();
  }

  // Collapsed desktop: constrain by width so the icon stays within the narrow sider.
  // Expanded / mobile: constrain by height so the full logo text is clearly readable,
  // and width scales naturally from the image's real aspect ratio.
  const isCollapsedDesktop = !isMobile && collapsed;

  const logoSection = (
    <div
      style={{
        maxWidth: isMobile ? "100%" : 180,
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "space-between" : collapsed ? "center" : "flex-start",
        padding: isMobile ? "4px 10px 4px 16px" : collapsed ? "4px 16px" : "4px 20px",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0,
        marginLeft: isMobile ? "" : "auto",
        marginRight: isMobile ? "" : "auto",
      }}
    >
      <Image
        src="/logo.png"
        alt="React Learning Hub"
        width={160}
        height={40}
        style={
          isCollapsedDesktop
            ? { width: 40, height: "auto", display: "block" }
            : isMobile
              ? { height: 55, width: "auto", display: "block" }
              : { width: "100%", height: "auto", display: "block" }
        }
      />
      {isMobile && (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onMobileClose}
          style={{ fontSize: 16, flexShrink: 0 }}
        />
      )}
    </div>
  );

  const menuSection = (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[pathname]}
      defaultOpenKeys={collapsed ? [] : openKeys}
      items={menuItems}
      onClick={({ key }) => handleNavigate(key)}
      style={{ borderRight: 0, marginTop: 8 }}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        open={mobileOpen}
        onClose={onMobileClose}
        placement="left"
        closable={false}
        styles={{
          wrapper: { width: 260 },
          body: { padding: 0, display: "flex", flexDirection: "column" },
        }}
      >
        {logoSection}
        <div style={{ overflowY: "auto", flex: 1 }}>{menuSection}</div>
      </Drawer>
    );
  }

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      style={{
        overflow: "hidden",
        height: "100vh",
        position: "fixed",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* flex column so logo stays pinned and menu scrolls independently */}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {logoSection}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>{menuSection}</div>
      </div>
    </Sider>
  );
}
