"use client";

import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const PATTERNS = [
  {
    key: "suspense",
    title: "Suspense & lazy",
    path: "/patterns/suspense",
    description:
      "Code-split components with React.lazy. Suspense boundaries show fallbacks while chunks load.",
    easy: "Lazy load a heavy component",
    medium: "Multiple lazy routes with named fallbacks",
    advanced: "Nested Suspense + error boundary composition",
  },
  {
    key: "error-boundary",
    title: "Error Boundaries",
    path: "/patterns/error-boundary",
    description:
      "Catch rendering errors and show graceful fallback UI. Every production app needs these.",
    easy: "Basic error boundary",
    medium: "Error boundary with retry",
    advanced: "Multiple boundaries + scoped recovery",
  },
  {
    key: "portals",
    title: "Portals",
    path: "/patterns/portals",
    description:
      "createPortal renders children outside the parent DOM node, which is essential for modals and tooltips.",
    easy: "Basic modal with createPortal",
    medium: "Toast notification system",
    advanced: "Tooltip with portal + smart positioning",
  },
  {
    key: "hoc",
    title: "Higher Order Components",
    path: "/patterns/hoc",
    description:
      "Functions that take a component and return an enhanced version. withLoading, withAuth, withLogger.",
    easy: "withLoading HOC",
    medium: "withAuth + withErrorBoundary",
    advanced: "Composing multiple HOCs correctly",
  },
  {
    key: "render-props",
    title: "Render Props",
    path: "/patterns/render-props",
    description:
      "Share logic via a prop that is a function. The component calls your function with its state.",
    easy: "Hover state via render prop",
    medium: "Data fetcher with render prop",
    advanced: "Mouse tracker + consumer composition",
  },
  {
    key: "compound-components",
    title: "Compound Components",
    path: "/patterns/compound-components",
    description:
      "Components designed to work together, sharing implicit state via Context. Like Ant Design's Select + Option.",
    easy: "Tabs compound component",
    medium: "Accordion with Context",
    advanced: "Flexible card with dot notation API",
  },
];

export default function PatternsIndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          React Patterns
        </Title>
        <Paragraph style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", maxWidth: 600, margin: 0 }}>
          Architectural patterns that every React developer must know. These are not hooks. they are
          design patterns that solve recurring structural problems in React applications.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {PATTERNS.map((p) => (
          <Col xs={24} sm={12} lg={8} key={p.key}>
            <Link href={`${p.path}/easy`} style={{ textDecoration: "none" }}>
              <Card hoverable style={{ height: "100%" }} styles={{ body: { padding: 20 } }}>
                <Text strong style={{ fontSize: 14, display: "block", marginBottom: 6 }}>
                  {p.title}
                </Text>
                <Paragraph style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginBottom: 14 }}>
                  {p.description}
                </Paragraph>
                <div
                  style={{
                    fontSize: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    color: "rgba(0,0,0,0.65)",
                  }}
                >
                  <span>{p.easy}</span>
                  <span>{p.medium}</span>
                  <span>{p.advanced}</span>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: "#1677ff",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Start <ArrowRightOutlined style={{ fontSize: 10 }} />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
