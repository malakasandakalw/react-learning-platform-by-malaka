"use client";

import { Card, Col, Row, Typography, Tag } from "antd";
import Link from "next/link";
import { ArrowRightOutlined, RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HOOKS = [
  {
    name: "use()",
    path: "/react-19/use-hook",
    description:
      "Read a Promise or Context during render. Replaces some useEffect + useState data-fetching patterns with cleaner Suspense-based code.",
    easy: "Read a promise with Suspense",
    medium: "Conditionally reading context",
    advanced: "Streaming data with use() + Suspense",
  },
  {
    name: "useActionState",
    path: "/react-19/use-action-state",
    description:
      "Manage state tied to a form action. Returns [state, dispatch, isPending]. This is the React 19 way to handle form submissions with server or client actions.",
    easy: "Counter with action state",
    medium: "Form submission with validation",
    advanced: "Async action with optimistic UI",
  },
  {
    name: "useFormStatus",
    path: "/react-19/use-form-status",
    description:
      "Read the status (pending, data, method) of the parent <form> from any child component without prop drilling.",
    easy: "Submit button with pending state",
    medium: "Full form field disabling during submit",
    advanced: "Nested components reading form status",
  },
];

export default function React19IndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Title level={1} style={{ margin: 0 }}>
            React 19 Hooks
          </Title>
          <Tag style={{ fontSize: 12, fontWeight: 600 }}>React 19.2.4</Tag>
        </div>
        <Paragraph style={{ fontSize: 15, maxWidth: 640 }}>
          These hooks are exclusive to React 19 and require no additional libraries. They represent
          a shift in how React handles async, forms, and context reading.
        </Paragraph>
      </div>

      <Row gutter={[20, 20]}>
        {HOOKS.map((hook) => (
          <Col xs={24} md={8} key={hook.name}>
            <Link href={`${hook.path}/easy`} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{ borderRadius: 12, height: "100%" }}
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <RocketOutlined />
                  <Title level={4} style={{ margin: 0, fontFamily: "var(--font-mono)" }}>
                    {hook.name}
                  </Title>
                </div>
                <Paragraph style={{ fontSize: 13, marginBottom: 16 }}>{hook.description}</Paragraph>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontSize: 12,
                    color: "rgba(0,0,0,0.65)",
                  }}
                >
                  <span>Easy: {hook.easy}</span>
                  <span>Medium: {hook.medium}</span>
                  <span>Advanced: {hook.advanced}</span>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    color: "#1677ff",
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
