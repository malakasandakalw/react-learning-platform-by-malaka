"use client";

// useLayoutEffect: Easy
// Concept: useLayoutEffect fires SYNCHRONOUSLY after all DOM mutations but
// BEFORE the browser paints. This is the key difference from useEffect:
//
//   useEffect:       render → paint → effect   (user sees change first)
//   useLayoutEffect: render → effect → paint   (effect runs before user sees anything)
//
// Use it when you need to READ from or WRITE to the DOM in a way that must
// happen before the screen updates, like measuring element dimensions.
// If you use useEffect for DOM measurements, you get a visible flicker.

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  Switch,
  Typography,
  Tag,
  Statistic,
  Alert,
} from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// Demo 1: Measure a DOM element BEFORE paint
// With useLayoutEffect: no flicker, measurement is ready on first paint
// With useEffect: you would see a flash of the wrong size
function BoxMeasure({ useLayout }: { useLayout: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const hook = useLayout ? useLayoutEffect : useEffect;

  hook(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setSize({ width: Math.round(width), height: Math.round(height) });
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{
          background: useLayout ? "#eef2ff" : "#fff7ed",
          border: `2px solid ${useLayout ? "#4f46e5" : "#f59e0b"}`,
          borderRadius: 8,
          padding: 20,
          marginBottom: 12,
          resize: "both",
          overflow: "auto",
          minWidth: 150,
          minHeight: 60,
        }}
      >
        <Text style={{ fontSize: 12 }}>Resize me! (drag corner)</Text>
      </div>
      <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
        <Tag color={useLayout ? "purple" : "orange"}>
          {useLayout ? "useLayoutEffect" : "useEffect"}
        </Tag>
        <span style={{ marginLeft: 8 }}>
          {size.width} × {size.height}px
        </span>
      </div>
    </div>
  );
}

// Demo 2: Timeline visualiser showing execution order
function TimelineDemo() {
  const [log, setLog] = useState<string[]>([]);

  function runDemo() {
    const entries: string[] = [];

    // This runs BEFORE paint (synchronous)
    // We simulate with a ref trick since we can't truly show "before paint" in a demo
    entries.push("1. render() executes");
    entries.push("2. DOM is updated");
    entries.push("3. useLayoutEffect fires ← synchronous, blocks paint");
    entries.push("4. Browser paints (user sees the screen)");
    entries.push("5. useEffect fires ← async, after paint");

    setLog(entries);
  }

  return (
    <Card title="Execution Timeline" style={{ borderRadius: 12 }}>
      <button
        onClick={runDemo}
        style={{
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          cursor: "pointer",
          marginBottom: 16,
          fontSize: 13,
        }}
      >
        Show Timeline
      </button>
      {log.map((entry, i) => (
        <div
          key={i}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            padding: "6px 10px",
            marginBottom: 4,
            borderRadius: 6,
            background:
              i === 2
                ? "#eef2ff"
                : i === 4
                ? "#fff7ed"
                : "#f8f9fc",
            borderLeft: `3px solid ${
              i === 2 ? "#4f46e5" : i === 4 ? "#f59e0b" : "#e5e7eb"
            }`,
            color: i === 2 ? "#4f46e5" : i === 4 ? "#f59e0b" : "#374151",
          }}
        >
          {entry}
        </div>
      ))}
    </Card>
  );
}

export default function UseLayoutEffectEasyPage() {
  return (
    <div>
      <PageIntro
        title="useLayoutEffect"
        level="easy"
        description="useLayoutEffect is identical to useEffect but fires synchronously after DOM updates and before the browser paints. Use it when you need to read or write the DOM before the user sees anything, which avoids visible flicker."
        teaches={[
          "useLayoutEffect fires before paint; useEffect fires after paint",
          "Reading DOM measurements (getBoundingClientRect) without flicker",
          "When to use it: DOM reads/writes that affect visible layout",
          "When NOT to use it: data fetching and subscriptions. Use useEffect instead.",
        ]}
      />

      <Alert
        type="warning"
        showIcon
        message="Server rendering caveat"
        description="useLayoutEffect does not run on the server. For SSR-safe code, use useEffect for non-visual side effects and useLayoutEffect only for client-side DOM work."
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="DOM Measurement (useLayoutEffect)" style={{ borderRadius: 12 }}>
            <BoxMeasure useLayout={true} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <TimelineDemo />
        </Col>
      </Row>

      <Card
        style={{ marginTop: 24, borderRadius: 12, background: "#0f0f23", border: "none" }}
        styles={{ body: { padding: 20 } }}
      >
        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, lineHeight: 2, color: "#e2e8f0" }}>
          <div style={{ color: "#7c3aed" }}>// useEffect (most cases)</div>
          <div>useEffect({"() => { fetchData(); }"}, [])  <span style={{ color: "#6b7280" }}>← runs after paint</span></div>
          <br />
          <div style={{ color: "#7c3aed" }}>// useLayoutEffect (DOM measurement/mutation)</div>
          <div>useLayoutEffect({"() => { measureDOM(); }"}, [])  <span style={{ color: "#4ade80" }}>← runs before paint</span></div>
        </div>
      </Card>

      <LevelNavigator basePath="/hooks/use-layout-effect" currentLevel="easy" />
    </div>
  );
}
