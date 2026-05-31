"use client";

import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const LEVELS = [
  {
    level: "easy",
    path: "/context/easy",
    title: "Theme Toggle",
    description:
      "Create a ThemeContext that provides light/dark mode across the app. Components consume it without prop drilling.",
  },
  {
    level: "medium",
    path: "/context/medium",
    title: "Auth Context",
    description:
      "A realistic authentication context with user session, login/logout, and protected UI. This is the most common real-world context pattern.",
  },
  {
    level: "advanced",
    path: "/context/advanced",
    title: "Context + useReducer",
    description:
      "Combine Context with useReducer for complex shared state. This is the pattern that Redux is built on, without the library.",
  },
];

export default function ContextIndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <Title level={1}>Context API</Title>
        <Paragraph style={{ fontSize: 15, maxWidth: 640 }}>
          Context solves the prop drilling problem of passing data through many layers of
          components. Use it for global state like themes, auth, and locale. Don&apos;t use it for
          high-frequency updates.
        </Paragraph>
      </div>
      <Row gutter={[20, 20]}>
        {LEVELS.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.level}>
            <Link href={item.path} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{ borderRadius: 12, height: "100%" }}
                styles={{ body: { padding: 24 } }}
              >
                <Title level={4} style={{ margin: "0 0 8px" }}>
                  {item.title}
                </Title>
                <Paragraph style={{ fontSize: 13, marginBottom: 16 }}>{item.description}</Paragraph>
                <div
                  style={{
                    color: "#1677ff",
                    fontWeight: 600,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Start <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
