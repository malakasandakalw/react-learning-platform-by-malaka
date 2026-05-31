"use client";

// Patterns: Error Boundaries (Easy)
// Concept: Error Boundaries are class components that catch rendering errors
// in their subtree and display a fallback UI instead of crashing the whole app.
// They catch: render errors, lifecycle errors, constructor errors.
// They do NOT catch: event handlers, async code, server errors.

import { Component, useState } from "react";
import { Alert, Button, Card, Col, Row, Tag, Typography, Space } from "antd";
import { WarningOutlined, ReloadOutlined, BugOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── Basic Error Boundary ─────────────────────────────────────────────────────
// Must be a CLASS component: hooks cannot catch render errors.
class BasicErrorBoundary extends Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean; error: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  // getDerivedStateFromError: called when a child throws during rendering.
  // Return the new state to show the fallback UI.
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  // componentDidCatch: called after getDerivedStateFromError.
  // Use this for logging errors to an error reporting service.
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.name}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          showIcon
          message="Something went wrong"
          description={this.state.error}
          style={{ borderRadius: 8 }}
        />
      );
    }

    return this.props.children;
  }
}

// ─── Buggy components to trigger the boundary ────────────────────────────────
function BuggyCounter({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Counter crashed during render!");
  }
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16, textAlign: "center" }}>
      <Text type="secondary">Counter is working fine ✓</Text>
    </div>
  );
}

function BuggyProfile({ data }: { data: any }) {
  // This will throw if data is null (common real-world error)
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16 }}>
      <Text strong>{data.name}</Text>
      <Text type="secondary" style={{ display: "block" }}>
        {data.email}
      </Text>
    </div>
  );
}

export default function ErrorBoundaryEasyPage() {
  const [crash1, setCrash1] = useState(false);
  const [crash2, setCrash2] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div>
      <PageIntro
        sourcePath="app/patterns/error-boundary/easy/page.tsx"
        title="Error Boundaries"
        level="easy"
        description="Error Boundaries catch rendering errors before they crash the whole app. Without them, one buggy component brings down the entire page. With them, the error is contained and a friendly message is shown."
        teaches={[
          "Error Boundaries must be class components. No hooks equivalent exists.",
          "getDerivedStateFromError: updates state to show fallback UI",
          "componentDidCatch: logs errors to monitoring services",
          "Boundaries only catch errors in their subtree, not in event handlers",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Controlled crash demo" style={{ borderRadius: 12 }}>
            <Space orientation="vertical" style={{ width: "100%" }} size={12}>
              {/* Each component wrapped in its own boundary */}
              <div>
                <Text style={{ fontSize: 12, marginBottom: 6, display: "block" }}>
                  Counter component:
                </Text>
                <BasicErrorBoundary name="Counter" key={key}>
                  <BuggyCounter shouldCrash={crash1} />
                </BasicErrorBoundary>
                <Button
                  size="small"
                  danger={crash1}
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    setCrash1((c) => !c);
                    setKey((k) => k + 1);
                  }}
                >
                  {crash1 ? "Fix Counter" : "Crash Counter"}
                </Button>
              </div>

              <div>
                <Text style={{ fontSize: 12, marginBottom: 6, display: "block" }}>
                  Profile component (null data):
                </Text>
                <BasicErrorBoundary name="Profile" key={crash2 ? "bad" : "good"}>
                  <BuggyProfile
                    data={crash2 ? null : { name: "Jane Smith", email: "jane@example.com" }}
                  />
                </BasicErrorBoundary>
                <Button
                  size="small"
                  danger={crash2}
                  style={{ marginTop: 8 }}
                  onClick={() => setCrash2((c) => !c)}
                >
                  {crash2 ? "Fix Profile" : "Pass null data"}
                </Button>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Without vs With boundary"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
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
              <div style={{ color: "#6a9955" }}>// Without boundary:</div>
              <div style={{ color: "#d4d4d4" }}>Counter throws</div>
              <div style={{ color: "#d4d4d4" }}>→ entire React tree unmounts</div>
              <div style={{ color: "#d4d4d4" }}>→ white screen 💀</div>
              <br />
              <div style={{ color: "#6a9955" }}>// With boundary:</div>
              <div style={{ color: "#d4d4d4" }}>Counter throws</div>
              <div style={{ color: "#d4d4d4" }}>→ boundary catches it</div>
              <div style={{ color: "#d4d4d4" }}>→ shows fallback UI</div>
              <div style={{ color: "#d4d4d4" }}>→ rest of app works ✓</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/error-boundary" currentLevel="easy" />
    </div>
  );
}
