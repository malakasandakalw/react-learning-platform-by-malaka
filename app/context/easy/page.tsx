"use client";

// Context API: Easy
// Concept: createContext + useContext for global theme state.
// Without Context: every component between App and Button needs a 'theme' prop,
// even if it doesn't use it (prop drilling).
// With Context: ThemeProvider wraps the tree. Any component anywhere below it
// can read the theme with useContext(ThemeContext) with no props needed.
//
// The 3 steps of Context:
//   1. createContext: define the context and its shape
//   2. Provider: wrap the subtree and pass the value
//   3. useContext: read the value from any component below

import { createContext, useContext, useState } from "react";
import { Button, Card, Col, Row, Space, Tag, Typography, Alert } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// STEP 1: createContext: define the context shape and default value.
// The default value is used when a component is rendered OUTSIDE any Provider.
type Accent = "blue" | "indigo";
type ThemeContextType = { accent: Accent; toggleAccent: () => void };

const ThemeContext = createContext<ThemeContextType>({
  accent: "blue",
  toggleAccent: () => {},
});

// Custom hook: wraps useContext with a clear name and optional validation.
// Always create a custom hook for your context. It is cleaner for consumers.
function useTheme() {
  return useContext(ThemeContext);
}

// STEP 2: Provider: wraps the subtree and holds the state.
// Only ONE component owns the state; all consumers read from the same source.
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<Accent>("blue");
  const toggleAccent = () => setAccent((a) => (a === "blue" ? "indigo" : "blue"));

  return <ThemeContext.Provider value={{ accent, toggleAccent }}>{children}</ThemeContext.Provider>;
}

const ACCENT = {
  blue: { bg: "#e6f4ff", border: "#91caff", text: "#0958d9", tag: "blue" as const },
  indigo: { bg: "#f0f5ff", border: "#adc6ff", text: "#1677ff", tag: "blue" as const },
};

// STEP 3: Consumer components: use useTheme() anywhere inside the Provider.
// No props needed: these are 3 levels deep but access the same context.
function ThemedHeader() {
  const { accent, toggleAccent } = useTheme();
  const a = ACCENT[accent];
  return (
    <div
      style={{
        background: a.bg,
        border: `1px solid ${a.border}`,
        padding: "16px 20px",
        borderRadius: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text strong style={{ color: a.text }}>
        Application Header
      </Text>
      <Button size="small" onClick={toggleAccent}>
        Switch to {accent === "blue" ? "Indigo" : "Blue"}
      </Button>
    </div>
  );
}

function ThemedCard() {
  const { accent } = useTheme();
  const a = ACCENT[accent];
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${a.border}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <Text strong style={{ color: a.text, display: "block", marginBottom: 8 }}>
        Content Card
      </Text>
      <Text style={{ color: "#4b5563", fontSize: 13 }}>
        This card reads the accent from context. No accent prop was passed.
      </Text>
    </div>
  );
}

function ThemedFooter() {
  const { accent } = useTheme();
  const a = ACCENT[accent];
  return (
    <div
      style={{
        background: "#f3f4f6",
        padding: "12px 20px",
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      <Text style={{ color: "#9ca3af", fontSize: 12 }}>
        Footer · Current accent: <Tag color={a.tag}>{accent}</Tag>
      </Text>
    </div>
  );
}

// This is the OUTSIDE-PROVIDER demo: shows what happens without a Provider.
// The context falls back to its default value: { accent: "blue", toggleAccent: () => {} }
function OutsideProviderDemo() {
  const { accent } = useTheme();
  return (
    <Alert
      type="warning"
      showIcon
      title={`Outside Provider → accent defaults to: "${accent}" (from createContext default)`}
      style={{ borderRadius: 8 }}
    />
  );
}

export default function ContextEasyPage() {
  return (
    <div>
      <PageIntro
        title="Context API"
        level="easy"
        description="Context solves prop drilling. Instead of passing theme through every component, any component can read it directly with useContext, as long as it lives inside the Provider."
        teaches={[
          "Step 1: createContext(defaultValue) defines the context shape",
          "Step 2: Provider wraps the tree and holds the state",
          "Step 3: useContext(ThemeContext) reads the value from any child",
          "Custom hook useTheme(): the clean way to consume a context",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Everything inside ThemeProvider can access the theme */}
          <ThemeProvider>
            <Card title="Inside ThemeProvider" style={{ borderRadius: 12 }}>
              <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                <ThemedHeader />
                <ThemedCard />
                <ThemedFooter />
              </Space>
            </Card>
          </ThemeProvider>
        </Col>

        <Col xs={24} lg={8}>
          {/* OutsideProviderDemo is NOT wrapped in ThemeProvider */}
          <OutsideProviderDemo />

          <Card
            title="Context API Steps"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none", marginTop: 16 }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#6a9955" }}>// 1. Create</div>
              <div style={{ color: "#ce9178" }}>createContext(defaultValue)</div>
              <div style={{ color: "#6a9955", marginTop: 4 }}>// 2. Provide</div>
              <div style={{ color: "#ce9178" }}>{"<Ctx.Provider value={...}>"}</div>
              <div style={{ color: "#6a9955", marginTop: 4 }}>// 3. Consume</div>
              <div style={{ color: "#dcdcaa" }}>useContext(ThemeContext)</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/context" currentLevel="easy" />
    </div>
  );
}
