"use client";

import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function CustomHooksIndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <Title level={1}>Custom Hooks</Title>
        <Paragraph style={{ fontSize: 15, color: "#555", maxWidth: 640 }}>
          Custom hooks are functions that start with <code>use</code> and call other hooks inside.
          They let you extract and share stateful logic across components. It is the most powerful
          abstraction React offers. Every real codebase has dozens of them.
        </Paragraph>
      </div>

      <Row gutter={[20, 20]}>
        {[
          {
            level: "easy",
            title: "useFetch",
            desc: "A reusable data-fetching hook that encapsulates loading, data, and error state. The pattern every team builds on day one.",
            api: "JSONPlaceholder",
          },
          {
            level: "medium",
            title: "useLocalStorage + useDebounce",
            desc: "Two utility hooks used in nearly every app. useLocalStorage persists state across page refreshes. useDebounce delays a value update.",
            api: "",
          },
          {
            level: "advanced",
            title: "useIntersectionObserver + usePagination",
            desc: "Production-grade hooks. useIntersectionObserver drives infinite scroll. usePagination manages page state with DummyJSON.",
            api: "DummyJSON",
          },
        ].map((item) => (
          <Col xs={24} md={8} key={item.level}>
            <Link href={`/custom-hooks/${item.level}`} style={{ textDecoration: "none" }}>
              <Card hoverable style={{ borderRadius: 12, height: "100%" }} styles={{ body: { padding: 24 } }}>
                <Title level={4} style={{ margin: "0 0 8px", fontFamily: "var(--font-geist-mono)", color: "#d97706" }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>{item.desc}</Paragraph>
                {item.api !== "" && (
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>API: {item.api}</div>
                )}
                <div style={{ color: "#d97706", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  Explore <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
