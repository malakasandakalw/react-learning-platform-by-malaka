"use client";

import { Typography, Grid } from "antd";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function AppFooter() {
  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  return (
    <footer
      style={{
        borderTop: "1px solid #f0f0f0",
        background: "#fafafa",
        padding: isMobile ? "14px 16px" : "14px 32px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          © 2026 React Learning Hub · Developed by{" "}
          <a
            href="https://www.linkedin.com/in/malakasandakal/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1677ff", textDecoration: "none" }}
          >
            Malaka Sandakal
          </a>
          {" · "}For educational use only
        </Text>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="https://github.com/malakasandakalw"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "rgba(0,0,0,0.55)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <GithubOutlined /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/malakasandakal/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "rgba(0,0,0,0.55)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <LinkedinOutlined /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
