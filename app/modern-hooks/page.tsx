"use client";

import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HOOKS = [
  {
    name: "useTransition",
    path: "/modern-hooks/use-transition",
    description: "Mark state updates as non-urgent transitions. Keeps the UI responsive while expensive renders happen.",
    easy: "Non-blocking tab switch",
    medium: "Search with isPending spinner",
    advanced: "Heavy list render staying responsive",
  },
  {
    name: "useDeferredValue",
    path: "/modern-hooks/use-deferred-value",
    description: "Defer updating a non-urgent part of the UI. The input stays fast; the slow list catches up after.",
    easy: "Deferred search input",
    medium: "Large Pokémon list with deferred filter",
    advanced: "Combining useDeferredValue with useMemo",
  },
  {
    name: "useId",
    path: "/modern-hooks/use-id",
    description: "Generate stable unique IDs for accessibility attributes (htmlFor, aria-*) that work in SSR.",
    easy: "Accessible form label/input pairing",
    medium: "Dynamic list of form instances",
    advanced: "SSR-safe ARIA relationships",
  },
  {
    name: "useOptimistic",
    path: "/modern-hooks/use-optimistic",
    description: "Show the expected result of an action immediately while the real async operation runs in the background.",
    easy: "Optimistic like button",
    medium: "Optimistic todo list CRUD",
    advanced: "Rollback on API failure",
  },
];

export default function ModernHooksIndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <Title level={1}>Modern React Hooks</Title>
        <Paragraph style={{ fontSize: 15, maxWidth: 640 }}>
          Introduced in React 18 and 19, these hooks unlock concurrent features:
          keeping your UI fast and responsive even under heavy load.
        </Paragraph>
      </div>

      <Row gutter={[20, 20]}>
        {HOOKS.map((hook) => (
          <Col xs={24} sm={12} key={hook.name}>
            <Link href={`${hook.path}/easy`} style={{ textDecoration: "none" }}>
              <Card hoverable style={{ borderRadius: 12, height: "100%" }} styles={{ body: { padding: 24 } }}>
                <Title level={4} style={{ margin: "0 0 8px", fontFamily: "var(--font-mono)" }}>
                  {hook.name}
                </Title>
                <Paragraph style={{ fontSize: 13, marginBottom: 16 }}>
                  {hook.description}
                </Paragraph>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
                  <span>Easy: {hook.easy}</span>
                  <span>Medium: {hook.medium}</span>
                  <span>Advanced: {hook.advanced}</span>
                </div>
                <div style={{ marginTop: 16, color: "#1677ff", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
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
