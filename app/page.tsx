"use client";

import { Card, Col, Divider, Grid, Row, Typography, Space } from "antd";
import {
  BookOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
  GithubOutlined,
  LinkedinOutlined,
  RocketOutlined,
  ToolOutlined,
  AppstoreOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const { Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const MODULES = [
  {
    key: "hooks",
    title: "Core Hooks",
    path: "/hooks",
    icon: <BookOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "Master the fundamental React hooks every developer must know. From managing state and side effects to refs and performance optimization.",
    topics: [
      "useState",
      "useEffect",
      "useLayoutEffect",
      "useRef",
      "useMemo",
      "useCallback",
      "useReducer",
    ],
    count: 21,
  },
  {
    key: "modern-hooks",
    title: "Modern Hooks",
    path: "/modern-hooks",
    icon: <ThunderboltOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "Explore the latest hooks introduced in React 18 and 19. Handle concurrent features, transitions, and optimistic updates.",
    topics: ["useTransition", "useDeferredValue", "useId", "useOptimistic"],
    count: 12,
  },
  {
    key: "context",
    title: "Context API",
    path: "/context",
    icon: <ApiOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "Share state across components without prop drilling. Learn to design context correctly and compose it with reducers for complex scenarios.",
    topics: ["createContext", "useContext", "Context + Reducer", "Multi-context patterns"],
    count: 3,
  },
  {
    key: "redux",
    title: "Redux Toolkit",
    path: "/redux",
    icon: <DatabaseOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "Manage complex global state with Redux Toolkit. Covers slices, async thunks, typed hooks, and RTK Query for data fetching.",
    topics: ["createSlice", "createAsyncThunk", "RTK Query", "Multiple slices"],
    count: 3,
  },
  {
    key: "react-19",
    title: "React 19",
    path: "/react-19",
    icon: <RocketOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "New hooks exclusive to React 19. use() reads promises during render, useActionState manages form action state, useFormStatus tracks parent form submission.",
    topics: ["use()", "useActionState", "useFormStatus"],
    count: 9,
  },
  {
    key: "custom-hooks",
    title: "Custom Hooks",
    path: "/custom-hooks",
    icon: <ToolOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "Extract and reuse stateful logic across components. Custom hooks are the most powerful abstraction in React and every real app uses them.",
    topics: ["useFetch", "useLocalStorage", "useDebounce", "useIntersectionObserver"],
    count: 3,
  },
  {
    key: "patterns",
    title: "Patterns",
    path: "/patterns",
    icon: <AppstoreOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    description:
      "Architectural patterns every React developer must know. Suspense, Error Boundaries, Portals, HOC, Render Props, and Compound Components.",
    topics: [
      "Suspense + lazy",
      "Error Boundaries",
      "Portals",
      "HOC",
      "Render Props",
      "Compound Components",
    ],
    count: 18,
  },
];

export default function HomePage() {
  const screens = useBreakpoint();
  const isMobile = screens.sm === false;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "32px 16px" : "60px 40px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: isMobile ? 32 : 48 }}>
          <Image
            src="/logo.png"
            alt="React Learning Hub by Malaka"
            width={260}
            height={72}
            style={{
              width: isMobile ? 180 : 260,
              height: "auto",
              objectFit: "contain",
              objectPosition: "left",
              marginBottom: 16,
              display: "block",
            }}
            priority
          />
          <Paragraph
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "rgba(0,0,0,0.65)",
              maxWidth: 560,
              margin: 0,
            }}
          >
            A structured, code-first learning platform for modern React development. Each concept is
            broken into Easy, Medium, and Advanced examples, all backed by real APIs.
          </Paragraph>
        </div>

        {/* Decision Guide: prominent link */}
        <Link
          href="/decision-guide"
          style={{ textDecoration: "none", display: "block", marginBottom: 32 }}
        >
          <Card
            hoverable
            style={{ borderColor: "#1677ff", background: "#e6f4ff" }}
            styles={{ body: { padding: "14px 16px" } }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
                <CompassOutlined
                  style={{ fontSize: 20, color: "#1677ff", flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ minWidth: 0 }}>
                  <Text strong style={{ fontSize: 14, color: "#1677ff", display: "block" }}>
                    When to use what? Decision Guide
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
                    Context vs Redux · useRef vs useState · useEffect vs event handler · useMemo vs
                    useTransition · 19 common situations explained
                  </Text>
                </div>
              </div>
              <ArrowRightOutlined
                style={{ color: "#1677ff", fontSize: 14, flexShrink: 0, marginTop: 3 }}
              />
            </div>
          </Card>
        </Link>

        {/* Module grid */}
        <Row gutter={[16, 16]}>
          {MODULES.map((mod) => (
            <Col xs={24} sm={12} lg={12} key={mod.key}>
              <Link href={mod.path} style={{ textDecoration: "none" }}>
                <Card hoverable style={{ height: "100%" }} styles={{ body: { padding: 20 } }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    {mod.icon}
                    <Text strong style={{ fontSize: 15 }}>
                      {mod.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: "auto" }}>
                      {mod.count} examples
                    </Text>
                  </div>
                  <Paragraph
                    style={{
                      fontSize: 12,
                      color: "rgba(0,0,0,0.65)",
                      marginBottom: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {mod.description}
                  </Paragraph>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {mod.topics.map((topic) => (
                      <span
                        key={topic}
                        style={{
                          background: "#f5f5f5",
                          border: "1px solid #d9d9d9",
                          borderRadius: 4,
                          padding: "1px 8px",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: "rgba(0,0,0,0.65)",
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 12,
                      color: "#1677ff",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontWeight: 600,
                    }}
                  >
                    Start learning <ArrowRightOutlined style={{ fontSize: 10 }} />
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: "48px 0 32px" }} />

        {/* Footer */}
        <Row gutter={[32, 24]} align="top">
          <Col xs={24} md={12}>
            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
              Developed by Malaka Sandakal
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "rgba(0,0,0,0.65)",
                lineHeight: 1.7,
                display: "block",
                marginBottom: 12,
              }}
            >
              Built for educational purposes, to help frontend development teams understand React
              hooks, Context, and Redux Toolkit through clean, readable, real-world code examples.
            </Text>
            <Space size={8}>
              <a
                href="https://github.com/malakasandakalw"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "rgba(0,0,0,0.65)",
                  textDecoration: "none",
                }}
              >
                <GithubOutlined /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/malakasandakal/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "rgba(0,0,0,0.65)",
                  textDecoration: "none",
                }}
              >
                <LinkedinOutlined /> LinkedIn
              </a>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Text strong style={{ fontSize: 13, display: "block", marginBottom: 10 }}>
              Public APIs used in examples
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "JSONPlaceholder", desc: "Users, Posts, Todos" },
                { name: "PokéAPI", desc: "Pokémon list & search" },
                { name: "DummyJSON", desc: "Products & Cart" },
              ].map((api) => (
                <Text key={api.name} style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
                  <Text strong style={{ fontSize: 12 }}>
                    {api.name}
                  </Text>
                  : {api.desc}
                </Text>
              ))}
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © 2026 React Learning Hub by Malaka · Developed by{" "}
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
        </div>
      </div>
    </div>
  );
}
