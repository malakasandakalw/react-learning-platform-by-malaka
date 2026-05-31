"use client";

import { useState } from "react";
import { Layout, Grid } from "antd";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const { Content } = Layout;
const { useBreakpoint } = Grid;

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  // screens.md === false means "confirmed below 768px" (not undefined / SSR)
  const isMobile = screens.md === false;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
        isMobile={isMobile}
      />
      {/*
        Inner layout is a flex column that fills remaining space.
        minHeight: 100vh ensures the footer is always pushed to the bottom
        even when page content is short.
      */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 240,
          transition: "margin-left 0.2s",
          borderLeft: isMobile ? "none" : "1px solid #f0f0f0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppHeader onMobileMenuToggle={() => setMobileDrawerOpen(true)} isMobile={isMobile} />
        <Content
          style={{
            flex: 1,
            padding: isMobile ? "16px" : "32px",
            background: "#fff",
          }}
        >
          {children}
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
}
