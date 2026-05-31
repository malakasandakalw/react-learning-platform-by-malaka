"use client";

// Patterns: HOC (Advanced)
// Concept: HOC composition, applying multiple HOCs correctly.
// The order of HOC application matters. compose(withA, withB)(C) = withA(withB(C)).
// Also shows: when to use HOCs vs custom hooks, and the HOC-to-hook migration pattern.

import { ComponentType, useState, useEffect } from "react";
import { Card, Col, Row, Spin, Tag, Typography, Space, Alert, Button } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── Compose utility ──────────────────────────────────────────────────────────
// Applies HOCs right-to-left: compose(withA, withB, withC)(X) = withA(withB(withC(X)))
function compose<P>(...hocs: Array<(c: ComponentType<any>) => ComponentType<any>>) {
  return (Component: ComponentType<P>) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), Component as ComponentType<any>);
}

// ─── HOC collection ───────────────────────────────────────────────────────────
function withLogger<P extends object>(name: string) {
  return function (WrappedComponent: ComponentType<P>) {
    function WithLogger(props: P) {
      useEffect(() => {
        console.log(`[HOC:withLogger] ${name} mounted`);
        return () => console.log(`[HOC:withLogger] ${name} unmounted`);
      }, []);
      return <WrappedComponent {...props} />;
    }
    WithLogger.displayName = `withLogger(${name})(${WrappedComponent.name})`;
    return WithLogger;
  };
}

function withLoadingHoc<P extends object>(WrappedComponent: ComponentType<P>) {
  function WithLoading(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    if (loading)
      return (
        <div style={{ textAlign: "center", padding: 32 }}>
          <Spin />
        </div>
      );
    return <WrappedComponent {...(rest as P)} />;
  }
  WithLoading.displayName = `withLoading(${WrappedComponent.name})`;
  return WithLoading;
}

function withErrorBoundaryHoc<P extends object>(WrappedComponent: ComponentType<P>) {
  function WithError(props: P & { error?: string | null }) {
    const { error, ...rest } = props;
    if (error) return <Alert type="error" title={error} showIcon style={{ borderRadius: 8 }} />;
    return <WrappedComponent {...(rest as P)} />;
  }
  WithError.displayName = `withError(${WrappedComponent.name})`;
  return WithError;
}

function withRetry<P extends object>(
  WrappedComponent: ComponentType<P & { onRetry?: () => void }>
) {
  function WithRetry(props: P & { error?: string | null; onRetry?: () => void }) {
    const { error, onRetry, ...rest } = props;
    return (
      <div>
        <WrappedComponent {...(rest as P)} error={error} />
        {error && onRetry && (
          <Button size="small" style={{ marginTop: 8 }} onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }
  WithRetry.displayName = `withRetry(${WrappedComponent.name})`;
  return WithRetry;
}

// ─── Base component ───────────────────────────────────────────────────────────
function DataDisplay({ data }: { data: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {data.map((item, i) => (
        <Tag key={i} color="blue">
          {item}
        </Tag>
      ))}
    </div>
  );
}

// ─── Compose all HOCs ─────────────────────────────────────────────────────────
// Order: withRetry(withError(withLoading(withLogger(DataDisplay))))
// The FIRST HOC listed in compose() is the OUTERMOST wrapper.
const EnhancedDataDisplay = compose<{
  data: string[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}>(
  withRetry,
  withErrorBoundaryHoc,
  withLoadingHoc,
  withLogger("DataDisplay")
)(DataDisplay);

export default function HocAdvancedPage() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [data] = useState(["React", "TypeScript", "Next.js", "Redux", "Ant Design"]);

  function simulate(outcome: "success" | "error") {
    setState("loading");
    setTimeout(() => setState(outcome), 1500);
  }

  return (
    <div>
      <PageIntro
        title="Higher Order Components"
        level="advanced"
        description="HOC composition with a compose utility. Multiple HOCs stack in a defined order and each handles one cross-cutting concern. The order matters: outermost HOC runs first."
        teaches={[
          "compose(...hocs)(Component) applies HOCs right-to-left, like function composition",
          "Each HOC has a single responsibility: loading, error, logging, retry",
          "displayName chain: withRetry(withError(withLoading(DataDisplay)))",
          "When to migrate to custom hooks: HOCs for JSX decoration, hooks for logic reuse",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Composed HOC demo" style={{ borderRadius: 12 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button onClick={() => simulate("success")} type="primary">
                Simulate Success
              </Button>
              <Button onClick={() => simulate("error")} danger>
                Simulate Error
              </Button>
            </Space>

            <EnhancedDataDisplay
              data={data}
              loading={state === "loading"}
              error={state === "error" ? "Failed to fetch data" : null}
              onRetry={() => setState("idle")}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="HOC chain"
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
              <div style={{ color: "#6a9955" }}>// compose() result:</div>
              <div style={{ color: "#569cd6" }}>withRetry(</div>
              <div style={{ paddingLeft: 12, color: "#569cd6" }}>withError(</div>
              <div style={{ paddingLeft: 24, color: "#569cd6" }}>withLoading(</div>
              <div style={{ paddingLeft: 36, color: "#dcdcaa" }}>withLogger(</div>
              <div style={{ paddingLeft: 48, color: "#d4d4d4" }}>DataDisplay</div>
              <div style={{ paddingLeft: 36, color: "#dcdcaa" }}>)</div>
              <div style={{ paddingLeft: 24, color: "#569cd6" }}>)</div>
              <div style={{ paddingLeft: 12, color: "#569cd6" }}>)</div>
              <div style={{ color: "#569cd6" }}>)</div>
              <div
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "#252526",
                  borderRadius: 6,
                }}
              >
                <div>
                  state: <Tag style={{ fontSize: 10 }}>{state}</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/hoc" currentLevel="advanced" />
    </div>
  );
}
