"use client";

// Patterns: Error Boundaries (Medium)
// Concept: Error boundary with retry and reset capability.
// A production error boundary: shows error details, provides a retry button,
// tracks retry attempts, and resets by remounting via the key prop.

import { Component, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Space,
  Tag,
  Statistic,
  Alert,
} from "antd";
import {
  ReloadOutlined,
  WarningOutlined,
  BugOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type BoundaryState = {
  hasError: boolean;
  error: string;
  retries: number;
};

class RetryableErrorBoundary extends Component<
  {
    children: React.ReactNode;
    onReset: () => void;
    maxRetries?: number;
  },
  BoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: "", retries: 0 };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error) {
    // In production: send to Sentry, Datadog, etc.
    console.error("[RetryableErrorBoundary]", error.message);
  }

  handleRetry() {
    const maxRetries = this.props.maxRetries ?? 3;
    if (this.state.retries < maxRetries) {
      this.setState((s) => ({ hasError: false, error: "", retries: s.retries + 1 }));
      this.props.onReset();
    }
  }

  render() {
    const maxRetries = this.props.maxRetries ?? 3;
    const canRetry = this.state.retries < maxRetries;

    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <BugOutlined style={{ color: "#ef4444", fontSize: 18 }} />
            <Text strong style={{ color: "#7f1d1d", fontSize: 15 }}>
              Component Error
            </Text>
          </div>

          <Text style={{ fontSize: 12, color: "#991b1b", display: "block", marginBottom: 8, fontFamily: "var(--font-geist-mono)" }}>
            {this.state.error}
          </Text>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            {canRetry ? (
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={this.handleRetry}
                danger
              >
                Retry ({maxRetries - this.state.retries} left)
              </Button>
            ) : (
              <Tag color="red">Max retries ({maxRetries}) reached</Tag>
            )}
            <Text type="secondary" style={{ fontSize: 11 }}>
              Attempts: {this.state.retries}
            </Text>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Flaky component that fails randomly ─────────────────────────────────────
function FlakyDataWidget({ attemptCount }: { attemptCount: number }) {
  // Fails 60% of the time to demonstrate retry
  if (attemptCount <= 3 && Math.random() < 0.6) {
    throw new Error(`Network timeout on attempt ${attemptCount + 1}`);
  }

  return (
    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #a7f3d0",
        borderRadius: 8,
        padding: 20,
        textAlign: "center",
      }}
    >
      <CheckCircleOutlined style={{ fontSize: 24, color: "#16a34a", marginBottom: 8 }} />
      <Text strong style={{ color: "#166534", display: "block" }}>
        Data loaded successfully!
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        Succeeded on attempt {attemptCount + 1}
      </Text>
    </div>
  );
}

export default function ErrorBoundaryMediumPage() {
  const [attempt, setAttempt] = useState(0);
  const [boundaryKey, setBoundaryKey] = useState(0);

  function handleReset() {
    setAttempt((a) => a + 1);
  }

  return (
    <div>
      <PageIntro
        title="Error Boundaries"
        level="medium"
        description="A production error boundary with retry capability. The boundary tracks retry attempts, limits them to prevent infinite loops, and resets child state by updating its own key prop, which forces a complete remount."
        teaches={[
          "Retry pattern: reset state + call onReset to remount the child",
          "maxRetries: limit retries to prevent infinite failure loops",
          "componentDidCatch: the right place to log to Sentry/Datadog",
          "Remounting via key: parent changes boundary key → full child remount",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <span>Flaky Widget</span>
                <Tag style={{ fontSize: 10 }}>Fails 60% of the time</Tag>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
              This component randomly throws. Keep clicking Retry until it succeeds.
            </Text>

            <RetryableErrorBoundary
              key={boundaryKey}
              onReset={handleReset}
              maxRetries={5}
            >
              <FlakyDataWidget attemptCount={attempt} />
            </RetryableErrorBoundary>

            <Button
              size="small"
              style={{ marginTop: 16 }}
              onClick={() => { setAttempt(0); setBoundaryKey((k) => k + 1); }}
            >
              Reset Everything
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Current attempt"
              value={attempt + 1}
              valueStyle={{ color: "#4f46e5" }}
            />
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/error-boundary" currentLevel="medium" />
    </div>
  );
}
