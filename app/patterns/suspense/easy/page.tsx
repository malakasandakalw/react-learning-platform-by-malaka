"use client";

// Patterns: Suspense + React.lazy (Easy)
// Concept: React.lazy loads a component's JS bundle on demand.
// Without lazy: ALL components are bundled together and the initial load is slow.
// With lazy: heavy components only load when first needed, which gives a faster initial load.
// <Suspense> wraps the lazy component and shows a fallback while the bundle loads.

import { lazy, Suspense, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Typography,
  Tag,
  Space,
  Alert,
} from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── Heavy component defined inline for this demo ─────────────────────────────
// In real apps this would be: const HeavyChart = lazy(() => import('./HeavyChart'))
// React.lazy only accepts default exports.
// The dynamic import() is what triggers the code split at build time.

function HeavyComponentContent() {
  const items = Array.from({ length: 100 }, (_, i) => ({
    label: `Data point ${i + 1}`,
    value: Math.floor(Math.random() * 100),
  }));

  return (
    <div>
      <Tag color="blue" style={{ marginBottom: 12 }}>Heavy Component Loaded ✓</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
        {items.slice(0, 20).map((item, i) => (
          <div
            key={i}
            style={{
              background: `hsl(${(item.value * 2) + 200}, 60%, 80%)`,
              borderRadius: 4,
              padding: "6px 4px",
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {item.value}
          </div>
        ))}
      </div>
      <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 8 }}>
        20 of {items.length} data points rendered
      </Text>
    </div>
  );
}

// Simulate React.lazy by wrapping in a promise that delays
function createLazyComponent(delayMs: number) {
  let resolved = false;
  const promise = new Promise<void>((r) => setTimeout(() => { resolved = true; r(); }, delayMs));

  return function LazyWrapper() {
    if (!resolved) throw promise; // Suspense protocol: throw a promise
    return <HeavyComponentContent />;
  };
}

const LazyHeavyComponent = createLazyComponent(1500);

// Real React.lazy usage (shown in the code panel):
// const HeavyChart = lazy(() => import("@/components/HeavyChart"))

export default function SuspenseEasyPage() {
  const [show, setShow] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  function handleLoad() {
    setShow(true);
    setLoadCount((c) => c + 1);
  }

  return (
    <div>
      <PageIntro
        title="Suspense & React.lazy"
        level="easy"
        description="React.lazy defers loading a component's code bundle until it is first needed. Suspense shows a fallback while it loads. This is code splitting, the most impactful performance technique for large React apps."
        teaches={[
          "React.lazy(() => import('./Component')) creates a lazily loaded component",
          "<Suspense fallback={...}> shows the fallback while the lazy component loads",
          "The bundle only downloads when the component is first rendered",
          "Only works with default exports from the lazy-loaded module",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card title="Lazy Loaded Component" style={{ borderRadius: 12 }}>
            {!show ? (
              <div style={{ textAlign: "center", padding: 32 }}>
                <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                  The HeavyComponent bundle has NOT been loaded yet.
                </Text>
                <Button type="primary" size="large" onClick={handleLoad}>
                  Load HeavyComponent
                </Button>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 12, color: "rgba(0,0,0,0.65)", fontSize: 12 }}>
                      Downloading component bundle... (simulated 1.5s)
                    </div>
                  </div>
                }
              >
                <LazyHeavyComponent />
              </Suspense>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="How React.lazy works"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
              <div style={{ color: "#6a9955" }}>// Define lazy component:</div>
              <div>const Chart = lazy(</div>
              <div style={{ paddingLeft: 12, color: "#ce9178" }}>{"() => import('./Chart')"}</div>
              <div>);</div>
              <br />
              <div style={{ color: "#6a9955" }}>// Use with Suspense:</div>
              <div style={{ color: "#569cd6" }}>{"<Suspense fallback={<Spin />}>"}</div>
              <div style={{ color: "#569cd6", paddingLeft: 12 }}>{"<Chart />"}</div>
              <div style={{ color: "#569cd6" }}>{"</Suspense>"}</div>
              <div style={{ marginTop: 12, padding: "8px 10px", background: "#252526", borderRadius: 6 }}>
                <div>loaded: <span style={{ color: show ? "#b5cea8" : "#ce9178" }}>{String(show)}</span></div>
                <div>load attempts: <span style={{ color: "#b5cea8" }}>{loadCount}</span></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/suspense" currentLevel="easy" />
    </div>
  );
}
