"use client";

// useLayoutEffect: Medium
// Concept: Tooltip / popover positioning.
// A tooltip must appear near its trigger element. If you compute the position
// in useEffect, the tooltip briefly renders at (0,0) then jumps, causing a visible flicker.
// useLayoutEffect positions it before the first paint, so it appears instantly correct.
// This is exactly how every tooltip/popover library works internally.

import { useLayoutEffect, useRef, useState } from "react";
import { Card, Col, Row, Typography, Tag, Button } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type Position = { top: number; left: number };

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<Position>({ top: 0, left: 0 });

  // useLayoutEffect computes position BEFORE the tooltip becomes visible to the user.
  // If this were useEffect, you'd see the tooltip at {top:0, left:0} for one frame.
  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Position tooltip centered above the trigger
    setPos({
      top: triggerRect.top - tooltipRect.height - 8 + window.scrollY,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + window.scrollX,
    });
  }, [visible]);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          background: "#1677ff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        {children}
      </button>

      {/* Tooltip renders in a portal-like fixed position */}
      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            background: "#e6f4ff",
            color: "rgba(0,0,0,0.88)",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              background: "#e6f4ff",
              rotate: "45deg",
            }}
          />
        </div>
      )}
    </span>
  );
}

// Comparison: what useEffect would look like
function FlickerDemo() {
  const [showFlicker, setShowFlicker] = useState(false);

  return (
    <Card title="Without useLayoutEffect (simulated flicker)" style={{ borderRadius: 12 }}>
      <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
        With useEffect, position is computed AFTER paint. You see a jump from (0,0) to the correct
        position. With useLayoutEffect that jump never happens.
      </Text>

      <div
        style={{
          background: "#1e1e1e",
          border: "none",
          borderRadius: 8,
          padding: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: 2,
        }}
      >
        <div style={{ color: "#6a9955" }}>// useEffect: one frame flicker:</div>
        <div style={{ color: "#d4d4d4" }}>Frame 1: tooltip renders at top=0, left=0 👁️</div>
        <div style={{ color: "#d4d4d4" }}>Frame 2: effect runs, position computed</div>
        <div style={{ color: "#d4d4d4" }}>Frame 3: re-render at correct position</div>
        <div style={{ marginTop: 8, color: "#ce9178" }}>→ User sees a jump</div>
        <div style={{ marginTop: 8, color: "#b5cea8" }}>
          // useLayoutEffect: no flicker:
          <br />
          Frame 1: effect runs before paint
          <br />
          Frame 1: tooltip renders at correct position
          <br />→ User sees nothing wrong ✓
        </div>
      </div>
    </Card>
  );
}

export default function UseLayoutEffectMediumPage() {
  return (
    <div>
      <PageIntro
        title="useLayoutEffect"
        level="medium"
        description="Tooltip and popover positioning is the canonical use case for useLayoutEffect. The position must be computed from DOM measurements before the tooltip appears. Using useEffect here produces a one-frame flicker that is visible on fast monitors."
        teaches={[
          "Reading getBoundingClientRect() in useLayoutEffect before paint",
          "Computing derived position from two DOM elements",
          "Why this is impossible to do correctly with useEffect",
          "How every tooltip/popover library (Floating UI, Popper.js) does this internally",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Tooltip with useLayoutEffect" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 20 }}>
              Hover each button. The tooltip appears at the correct position instantly, with no
              flicker.
            </Text>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Tooltip text="This is button A: positioned above">Hover me</Tooltip>
              <Tooltip text="Short">B</Tooltip>
              <Tooltip text="This tooltip has a much longer label">Long tooltip</Tooltip>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <FlickerDemo />
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-layout-effect" currentLevel="medium" />
    </div>
  );
}
