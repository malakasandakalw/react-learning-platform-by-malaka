"use client";

// Patterns: Suspense + React.lazy (Advanced)
// Concept: Nested Suspense boundaries with Error Boundary composition.
// Outer boundary catches errors. Inner boundaries handle individual section loading.
// This is the production pattern: granular fallbacks + graceful error recovery.

import { Suspense, useState, Component } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Spin,
  Typography,
  Tag,
  Space,
} from "antd";
import { ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Error Boundary (class component, required for error catching)
class ErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Lazy sections: success / slow / failing ──────────────────────────────────
function createSection(opts: { delay: number; shouldFail?: boolean }) {
  let state: "pending" | "resolved" | "rejected" = "pending";
  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (opts.shouldFail) { state = "rejected"; reject(new Error("Bundle load failed")); }
      else { state = "resolved"; resolve(); }
    }, opts.delay);
  });

  return function Section({ label, color }: { label: string; color: string }) {
    if (state === "pending") throw promise;
    if (state === "rejected") throw new Error("Failed to load " + label);
    return (
      <div style={{ background: color, borderRadius: 8, padding: 16, textAlign: "center" }}>
        <Tag color="success">{label} loaded ✓</Tag>
      </div>
    );
  };
}

const FastSection = createSection({ delay: 500 });
const SlowSection = createSection({ delay: 2000 });
const FailSection = createSection({ delay: 800, shouldFail: true });

function SectionFallback({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 16, background: "#f8f9fc", borderRadius: 8, minHeight: 60 }}>
      <Spin size="small" />
      <Text type="secondary" style={{ fontSize: 12 }}>Loading {label}...</Text>
    </div>
  );
}

function ErrorFallback({ label, onRetry }: { label: string; onRetry?: () => void }) {
  return (
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <WarningOutlined style={{ color: "#ef4444" }} />
      <Text style={{ fontSize: 12, color: "#991b1b", flex: 1 }}>{label} failed to load</Text>
      {onRetry && <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>Retry</Button>}
    </div>
  );
}

export default function SuspenseAdvancedPage() {
  const [key, setKey] = useState(0);

  return (
    <div>
      <PageIntro
        title="Suspense & React.lazy"
        level="advanced"
        description="Nested Suspense + Error Boundary composition. Each section has its own loading fallback and error recovery. The outer ErrorBoundary catches catastrophic failures while inner boundaries handle individual section errors gracefully."
        teaches={[
          "Nesting: ErrorBoundary wraps Suspense which wraps the lazy component",
          "Granular error recovery: one section failing doesn't break others",
          "Key prop to remount and retry a failed section",
          "Production pattern: error boundary + suspense boundary per critical section",
        ]}
      />

      <Alert
        type="info"
        showIcon
        message="The 'Widget C' section is intentionally set to fail. Watch how it recovers independently."
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Row gutter={[16, 16]}>
        {/* Fast section: loads in 500ms */}
        <Col xs={24} sm={8}>
          <Card title="Widget A (500ms)" style={{ borderRadius: 12 }}>
            <ErrorBoundary fallback={<ErrorFallback label="Widget A" />}>
              <Suspense fallback={<SectionFallback label="Widget A" />}>
                <FastSection label="Widget A" color="#eef2ff" />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </Col>

        {/* Slow section: loads in 2s */}
        <Col xs={24} sm={8}>
          <Card title="Widget B (2000ms)" style={{ borderRadius: 12 }}>
            <ErrorBoundary fallback={<ErrorFallback label="Widget B" />}>
              <Suspense fallback={<SectionFallback label="Widget B" />}>
                <SlowSection label="Widget B" color="#f0fdf4" />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </Col>

        {/* Failing section: 800ms then error */}
        <Col xs={24} sm={8}>
          <Card title="Widget C (fails at 800ms)" style={{ borderRadius: 12 }}>
            <ErrorBoundary
              key={key}
              fallback={
                <ErrorFallback
                  label="Widget C"
                  onRetry={() => setKey((k) => k + 1)}
                />
              }
            >
              <Suspense fallback={<SectionFallback label="Widget C" />}>
                <FailSection label="Widget C" color="#fff7ed" />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 24, borderRadius: 12, background: "#0f0f23", border: "none" }}
        styles={{ body: { padding: 16 } }}
      >
        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
          <div style={{ color: "#7c3aed" }}>// Nesting pattern per section:</div>
          <div style={{ color: "#4ade80" }}>{"<ErrorBoundary fallback={<ErrorFallback />}>"}</div>
          <div style={{ color: "#4ade80", paddingLeft: 12 }}>{"<Suspense fallback={<SectionFallback />}>"}</div>
          <div style={{ color: "#fbbf24", paddingLeft: 24 }}>{"<LazyWidget />"}</div>
          <div style={{ color: "#4ade80", paddingLeft: 12 }}>{"</Suspense>"}</div>
          <div style={{ color: "#4ade80" }}>{"</ErrorBoundary>"}</div>
        </div>
      </Card>

      <LevelNavigator basePath="/patterns/suspense" currentLevel="advanced" />
    </div>
  );
}
