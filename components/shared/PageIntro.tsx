"use client";

import { Typography, Alert, Grid, Button } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import LevelBadge from "./LevelBadge";
import ApiTag from "./ApiTag";
import type { Level } from "@/lib/constants";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const GITHUB_BASE =
  "https://github.com/malakasandakalw/react-learning-platform-by-malaka/blob/main";

type Props = {
  title: string;
  level: Level;
  description: string;
  teaches: string[];
  apiUsed?: string;
  sourcePath?: string;
};

export default function PageIntro({
  title,
  level,
  description,
  teaches,
  apiUsed,
  sourcePath,
}: Props) {
  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Title row */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? 12 : 0,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
            {title}
          </Title>
          <LevelBadge level={level} size="large" />
          {apiUsed && <ApiTag api={apiUsed} />}
        </div>

        {sourcePath && (
          <Button
            icon={<GithubOutlined />}
            href={`${GITHUB_BASE}/${sourcePath}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#24292f",
              color: "#fff",
              borderColor: "#24292f",
              fontWeight: 600,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {isMobile ? "View Source" : "View Source on GitHub"}
          </Button>
        )}
      </div>

      <Paragraph style={{ fontSize: isMobile ? 14 : 15, marginBottom: 16 }}>
        {description}
      </Paragraph>

      <Alert
        type="info"
        showIcon
        title="What you will learn"
        description={
          <ul style={{ margin: "4px 0 0 0", paddingLeft: 20 }}>
            {teaches.map((item, i) => (
              <li key={i} style={{ marginBottom: 2, fontSize: 13 }}>
                {item}
              </li>
            ))}
          </ul>
        }
        style={{ marginBottom: 12 }}
      />

      <Alert
        type="warning"
        showIcon
        title="Reading the source code is not optional"
        description={
          <span style={{ fontSize: 13, lineHeight: 1.7 }}>
            The demo above shows <em>what</em> this concept does. As a developer, you learn by
            reading <em>how</em> it is built.{" "}
            {sourcePath ? (
              <>
                Open{" "}
                <a href={`${GITHUB_BASE}/${sourcePath}`} target="_blank" rel="noopener noreferrer">
                  <Text code style={{ fontSize: 12 }}>
                    {sourcePath}
                  </Text>
                </a>{" "}
                and read every line before moving on.
              </>
            ) : (
              <>
                Open{" "}
                <Text code style={{ fontSize: 12 }}>
                  app/[section]/[hook]/[level]/page.tsx
                </Text>{" "}
                and read every line before moving on.
              </>
            )}
          </span>
        }
      />
    </div>
  );
}
