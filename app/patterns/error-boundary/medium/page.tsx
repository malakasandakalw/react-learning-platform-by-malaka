"use client";

// Patterns: Error Boundaries (Medium)
// Concept: Error boundary with retry and reset capability.
// A production error boundary: shows error details, provides a retry button,
// tracks retry attempts, and resets by remounting via the key prop.

import { Component, useState, useSyncExternalStore } from "react";
import { Button, Card, Col, Row, Typography, Space, Tag, Statistic, Alert } from "antd";
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
        <Alert
          type="error"
          showIcon
          message="Component Error"
          description={
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, marginBottom: 8 }}>
                {this.state.error}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {canRetry ? (
                  <Button size="small" icon={<ReloadOutlined />} onClick={this.handleRetry} danger>
                    Retry ({maxRetries - this.state.retries} left)
                  </Button>
                ) : (
                  <Tag color="error">Max retries ({maxRetries}) reached</Tag>
                )}
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Attempts: {this.state.retries}
                </Text>
              </div>
            </div>
          }
          style={{ borderRadius: 10 }}
        />
      );
    }

    return this.props.children;
  }
}

// ─── Flaky component that fails randomly ─────────────────────────────────────
// shouldFail is pre-computed in the parent's event handler so Math.random() never
// runs during render (React Compiler requires pure render functions).
function FlakyDataWidget({
  attemptCount,
  shouldFail,
}: {
  attemptCount: number;
  shouldFail: boolean;
}) {
  // Returns false on the server so the throw never happens during SSR prerendering,
  // where Error Boundaries don't exist to catch it.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  if (shouldFail) {
    throw new Error(`Network timeout on attempt ${attemptCount + 1}`);
  }

  return (
    <Alert
      type="success"
      showIcon
      message="Data loaded successfully!"
      description={`Succeeded on attempt ${attemptCount + 1}`}
      style={{ borderRadius: 8 }}
    />
  );
}

export default function ErrorBoundaryMediumPage() {
  const [attempt, setAttempt] = useState(0);
  const [boundaryKey, setBoundaryKey] = useState(0);
  // Start as true so the error boundary is visible immediately on load.
  // Randomised on each retry inside the event handler (Math.random in render is banned).
  const [shouldFail, setShouldFail] = useState(true);

  function handleReset() {
    setAttempt((a) => a + 1);
    setShouldFail(Math.random() < 0.6);
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/patterns/error-boundary/medium/page.tsx"
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

            <RetryableErrorBoundary key={boundaryKey} onReset={handleReset} maxRetries={5}>
              <FlakyDataWidget attemptCount={attempt} shouldFail={shouldFail} />
            </RetryableErrorBoundary>

            <Button
              size="small"
              style={{ marginTop: 16 }}
              onClick={() => {
                setAttempt(0);
                setBoundaryKey((k) => k + 1);
                setShouldFail(true);
              }}
            >
              Reset Everything
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Current attempt" value={attempt + 1} />
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/error-boundary" currentLevel="medium" />
    </div>
  );
}
