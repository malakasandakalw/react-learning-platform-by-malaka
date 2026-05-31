"use client";

// Patterns: Suspense + React.lazy (Advanced)
// Concept: Nested Suspense boundaries with Error Boundary composition.
// Outer boundary catches errors. Inner boundaries handle individual section loading.
// This is the production pattern: granular fallbacks + graceful error recovery.

import { Suspense, useState, Component, useSyncExternalStore } from "react";
import { Alert, Button, Card, Col, Row, Spin, Typography, Tag, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
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
      if (opts.shouldFail) {
        state = "rejected";
        reject(new Error("Bundle load failed"));
      } else {
        state = "resolved";
        resolve();
      }
    }, opts.delay);
  });

  return function Section({ label, color }: { label: string; color: string }) {
    // Guard against SSR: ErrorBoundaries don't catch server-side throws during prerendering.
    const mounted = useSyncExternalStore(
      () => () => {},
      () => true,
      () => false
    );
    if (!mounted) return null;

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 16,
        background: "#f5f5f5",
        borderRadius: 8,
        minHeight: 60,
      }}
    >
      <Spin size="small" />
      <Text type="secondary" style={{ fontSize: 12 }}>
        Loading {label}...
      </Text>
    </div>
  );
}

function ErrorFallback({ label, onRetry }: { label: string; onRetry?: () => void }) {
  return (
    <Alert
      type="error"
      showIcon
      message={`${label} failed to load`}
      action={
        onRetry && (
          <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
      style={{ borderRadius: 8 }}
    />
  );
}

export default function SuspenseAdvancedPage() {
  const [key, setKey] = useState(0);

  return (
    <div>
      <PageIntro
        sourcePath="app/patterns/suspense/advanced/page.tsx"
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
        title="The 'Widget C' section is intentionally set to fail. Watch how it recovers independently."
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Row gutter={[16, 16]}>
        {/* Fast section: loads in 500ms */}
        <Col xs={24} sm={8}>
          <Card title="Widget A (500ms)" style={{ borderRadius: 12 }}>
            <ErrorBoundary fallback={<ErrorFallback label="Widget A" />}>
              <Suspense fallback={<SectionFallback label="Widget A" />}>
                <FastSection label="Widget A" color="#f5f5f5" />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </Col>

        {/* Slow section: loads in 2s */}
        <Col xs={24} sm={8}>
          <Card title="Widget B (2000ms)" style={{ borderRadius: 12 }}>
            <ErrorBoundary fallback={<ErrorFallback label="Widget B" />}>
              <Suspense fallback={<SectionFallback label="Widget B" />}>
                <SlowSection label="Widget B" color="#f5f5f5" />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </Col>

        {/* Failing section: 800ms then error */}
        <Col xs={24} sm={8}>
          <Card title="Widget C (fails at 800ms)" style={{ borderRadius: 12 }}>
            <ErrorBoundary
              key={key}
              fallback={<ErrorFallback label="Widget C" onRetry={() => setKey((k) => k + 1)} />}
            >
              <Suspense fallback={<SectionFallback label="Widget C" />}>
                <FailSection label="Widget C" color="#f5f5f5" />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 24, borderRadius: 12, background: "#1e1e1e", border: "none" }}
        styles={{
          header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
          body: { padding: 16 },
        }}
      >
        <div
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}
        >
          <div style={{ color: "#6a9955" }}>// Nesting pattern per section:</div>
          <div style={{ color: "#569cd6" }}>{"<ErrorBoundary fallback={<ErrorFallback />}>"}</div>
          <div style={{ color: "#569cd6", paddingLeft: 12 }}>
            {"<Suspense fallback={<SectionFallback />}>"}
          </div>
          <div style={{ color: "#ce9178", paddingLeft: 24 }}>{"<LazyWidget />"}</div>
          <div style={{ color: "#569cd6", paddingLeft: 12 }}>{"</Suspense>"}</div>
          <div style={{ color: "#569cd6" }}>{"</ErrorBoundary>"}</div>
        </div>
      </Card>

      <LevelNavigator basePath="/patterns/suspense" currentLevel="advanced" />
    </div>
  );
}
