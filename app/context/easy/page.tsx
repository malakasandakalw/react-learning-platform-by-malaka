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
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Switch,
  Tag,
  Typography,
  Alert,
} from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// STEP 1: createContext: define the context shape and default value.
// The default value is used when a component is rendered OUTSIDE any Provider.
type Theme = "light" | "dark";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Custom hook: wraps useContext with a clear name and optional validation.
// Always create a custom hook for your context. It is cleaner for consumers.
function useTheme() {
  return useContext(ThemeContext);
}

// STEP 2: Provider: wraps the subtree and holds the state.
// Only ONE component owns the state; all consumers read from the same source.
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// STEP 3: Consumer components: use useTheme() anywhere inside the Provider.
// No props needed: these are 3 levels deep but access the same context.
function ThemedHeader() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      style={{
        background: theme === "dark" ? "#1e1b4b" : "#eef2ff",
        padding: "16px 20px",
        borderRadius: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text strong style={{ color: theme === "dark" ? "#e0e7ff" : "#1e1b4b" }}>
        Application Header
      </Text>
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
      />
    </div>
  );
}

function ThemedCard() {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme === "dark" ? "#161630" : "#fff",
        border: `1px solid ${theme === "dark" ? "#312e81" : "#e5e7eb"}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <Text strong style={{ color: theme === "dark" ? "#a5b4fc" : "#374151", display: "block", marginBottom: 8 }}>
        Content Card
      </Text>
      <Text style={{ color: theme === "dark" ? "#6b7280" : "#4b5563", fontSize: 13 }}>
        This card reads the theme from context. No theme prop was passed.
      </Text>
    </div>
  );
}

function ThemedFooter() {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme === "dark" ? "#0f0f23" : "#f3f4f6",
        padding: "12px 20px",
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      <Text style={{ color: theme === "dark" ? "#6b7280" : "#9ca3af", fontSize: 12 }}>
        Footer · Current theme: <Tag color={theme === "dark" ? "purple" : "blue"}>{theme}</Tag>
      </Text>
    </div>
  );
}

// This is the OUTSIDE-PROVIDER demo: shows what happens without a Provider.
// The context falls back to its default value: { theme: "light", toggleTheme: () => {} }
function OutsideProviderDemo() {
  const { theme } = useTheme();
  return (
    <Alert
      type="warning"
      showIcon
      message={`Outside Provider → theme defaults to: "${theme}" (from createContext default)`}
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
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
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
            style={{ borderRadius: 12, background: "#0f0f23", border: "none", marginTop: 16 }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#7c3aed" }}>// 1. Create</div>
              <div style={{ color: "#6b7280" }}>createContext(defaultValue)</div>
              <div style={{ color: "#7c3aed", marginTop: 4 }}>// 2. Provide</div>
              <div style={{ color: "#6b7280" }}>{"<Ctx.Provider value={...}>"}</div>
              <div style={{ color: "#7c3aed", marginTop: 4 }}>// 3. Consume</div>
              <div style={{ color: "#4ade80" }}>useContext(ThemeContext)</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/context" currentLevel="easy" />
    </div>
  );
}
