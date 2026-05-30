"use client";

import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HOOKS = [
  {
    name: "useState",
    path: "/hooks/use-state",
    description: "Manage local component state. The most fundamental React hook.",
    easy: "Counter & toggle",
    medium: "Controlled form with validation",
    advanced: "Multi-step form with complex state",
  },
  {
    name: "useEffect",
    path: "/hooks/use-effect",
    description: "Synchronize components with external systems. Handle side effects.",
    easy: "Fetch users on mount",
    medium: "Search with debounce & cleanup",
    advanced: "Polling with interval cleanup",
  },
  {
    name: "useRef",
    path: "/hooks/use-ref",
    description: "Access DOM elements directly or persist values without re-renders.",
    easy: "Auto-focus input on load",
    medium: "Track & display previous value",
    advanced: "Imperative handle with forwardRef",
  },
  {
    name: "useMemo",
    path: "/hooks/use-memo",
    description: "Cache expensive calculations to avoid unnecessary recomputation.",
    easy: "Memoize a heavy calculation",
    medium: "Filter a large Pokemon list",
    advanced: "Prevent child re-renders with derived state",
  },
  {
    name: "useCallback",
    path: "/hooks/use-callback",
    description: "Memoize functions to prevent unnecessary child re-renders.",
    easy: "Stable callback for child component",
    medium: "Event handler passed to a list",
    advanced: "Custom hook exposing memoized callbacks",
  },
  {
    name: "useReducer",
    path: "/hooks/use-reducer",
    description: "Manage complex state transitions with a reducer function.",
    easy: "Counter with reducer pattern",
    medium: "Form state machine",
    advanced: "Multi-step wizard with history",
  },
];

export default function HooksIndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <Title level={1}>Core React Hooks</Title>
        <Paragraph style={{ fontSize: 15, color: "#555", maxWidth: 640 }}>
          These are the hooks you will use every single day. Start with Easy to
          understand the concept, then work through Medium and Advanced to see how
          it behaves in real-world patterns.
        </Paragraph>
      </div>

      <Row gutter={[20, 20]}>
        {HOOKS.map((hook) => (
          <Col xs={24} sm={12} lg={8} key={hook.name}>
            <Link href={`${hook.path}/easy`} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{ borderRadius: 12, height: "100%" }}
                styles={{ body: { padding: 24 } }}
              >
                <Title
                  level={4}
                  style={{
                    margin: "0 0 8px",
                    fontFamily: "var(--font-geist-mono)",
                    color: "#4f46e5",
                  }}
                >
                  {hook.name}
                </Title>
                <Paragraph style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
                  {hook.description}
                </Paragraph>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  <span style={{ color: "#16a34a" }}>● Easy: {hook.easy}</span>
                  <span style={{ color: "#d97706" }}>● Medium: {hook.medium}</span>
                  <span style={{ color: "#dc2626" }}>● Advanced: {hook.advanced}</span>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    color: "#4f46e5",
                    fontWeight: 600,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Start with Easy <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
