"use client";

import { useState } from "react";
import { Layout } from "antd";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const { Content } = Layout;

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "margin-left 0.2s",
          borderLeft: "1px solid #f0f0f0",
        }}
      >
        <AppHeader sidebarCollapsed={collapsed} />
        <Content
          style={{
            padding: 32,
            background: "#fff",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
