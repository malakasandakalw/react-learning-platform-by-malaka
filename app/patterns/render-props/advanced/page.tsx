"use client";

// Patterns: Render Props (Advanced)
// Concept: MouseTracker tracks mouse position inside a container via addEventListener.
// Advanced: composing two render prop providers (Toggle + MouseTracker) together,
// state from both providers flows into a single render function via nesting.

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Col, Row, Switch, Tag, Typography, Space } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Paragraph } = Typography;

// ─── MouseTracker render prop component ───────────────────────────────────────
// Listens to mousemove on a ref'd container div and exposes {x, y} relative to it.
type MousePosition = { x: number; y: number };

type MouseTrackerProps = {
  render: (pos: MousePosition) => React.ReactNode;
  style?: React.CSSProperties;
};

function MouseTracker({ render, style }: MouseTrackerProps) {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [handleMove]);

  return (
    <div ref={ref} style={style}>
      {render(pos)}
    </div>
  );
}

// ─── Toggle render prop component ─────────────────────────────────────────────
type ToggleProps = {
  initialOn?: boolean;
  render: (props: { on: boolean; toggle: () => void }) => React.ReactNode;
};

function Toggle({ initialOn = false, render }: ToggleProps) {
  const [on, setOn] = useState(initialOn);
  const toggle = () => setOn((v) => !v);
  return <>{render({ on, toggle })}</>;
}

export default function RenderPropsAdvancedPage() {
  return (
    <div>
      <PageIntro
        sourcePath="app/patterns/render-props/advanced/page.tsx"
        title="Render Props"
        level="advanced"
        description="MouseTracker listens to mousemove on a container div and exposes {x, y} via render prop. Two consumers render completely different UIs from the same tracker. Advanced: composing Toggle and MouseTracker so state from both providers flows into one render function."
        teaches={[
          "MouseTracker: addEventListener on a ref'd div, coordinates relative to bounding rect",
          "Same component, two consumers: different UI rendered from identical {x, y} input",
          "Render prop composition: nesting providers like <Toggle render={({on}) => <MouseTracker render={({x,y}) => ...} />} />",
          "Limitation of nesting: callback-hell shape, which is why custom hooks became the standard",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Consumer 1: coordinate display + dot follower */}
        <Col xs={24} md={12}>
          <Card title="Consumer 1: coordinate display" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
              Move your mouse inside the box. MouseTracker calls the render prop with live{" "}
              {"{x, y}"}.
            </Text>
            <MouseTracker
              style={{
                height: 180,
                borderRadius: 8,
                background: "#f5f5f5",
                border: "2px dashed #d9d9d9",
                cursor: "crosshair",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              render={({ x, y }) => (
                <>
                  <div style={{ textAlign: "center", pointerEvents: "none" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#1677ff",
                      }}
                    >
                      ({x}, {y})
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      x, y relative to container
                    </Text>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#1677ff",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      transition: "left 0.03s, top 0.03s",
                    }}
                  />
                </>
              )}
            />
          </Card>
        </Col>

        {/* Consumer 2: same tracker, entirely different UI (color mixer) */}
        <Col xs={24} md={12}>
          <Card title="Consumer 2: color mixer" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
              Same MouseTracker component, completely different UI. Here x maps to red and y maps to
              green.
            </Text>
            <MouseTracker
              style={{
                height: 180,
                borderRadius: 8,
                border: "2px dashed #d9d9d9",
                cursor: "crosshair",
                overflow: "hidden",
              }}
              render={({ x, y }) => {
                const r = Math.min(255, Math.round((x / 380) * 255));
                const g = Math.min(255, Math.round((y / 180) * 255));
                const bg = `rgb(${r}, ${g}, 120)`;
                return (
                  <div
                    style={{
                      height: "100%",
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.04s",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: "#fff",
                          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                          fontSize: 16,
                        }}
                      >
                        {bg}
                      </div>
                      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                        Move mouse to mix colors
                      </Text>
                    </div>
                  </div>
                );
              }}
            />
          </Card>
        </Col>

        {/* Consumer 3: composed render props with Toggle wrapping MouseTracker */}
        <Col xs={24}>
          <Card
            title="Composed render props: Toggle wrapping MouseTracker"
            style={{ borderRadius: 12 }}
          >
            <Paragraph style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
              Two providers nested: <code>Toggle</code> contributes <code>on/toggle</code>, then{" "}
              <code>MouseTracker</code> contributes <code>x/y</code>. Both states flow into one
              render function. This nesting is valid but shows why hooks replaced this pattern.
            </Paragraph>

            <Toggle
              render={({ on, toggle }) => (
                <div>
                  <Space style={{ marginBottom: 12 }}>
                    <Switch checked={on} onChange={toggle} />
                    <Text style={{ fontSize: 13 }}>
                      Tracking:{" "}
                      <Tag color={on ? "success" : "default"}>{on ? "active" : "paused"}</Tag>
                    </Text>
                  </Space>

                  <MouseTracker
                    style={{
                      height: 130,
                      borderRadius: 8,
                      background: on ? "#f0f0f0" : "#f9fafb",
                      border: `2px dashed ${on ? "#d9d9d9" : "#e5e7eb"}`,
                      cursor: on ? "crosshair" : "not-allowed",
                      transition: "all 0.2s",
                      padding: 16,
                      position: "relative",
                    }}
                    render={({ x, y }) => (
                      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <Text style={{ fontSize: 12 }}>
                            Toggle state:{" "}
                            <Tag color={on ? "success" : "default"}>{on ? "on" : "off"}</Tag>
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            Mouse position: <Tag>{on ? `(${x}, ${y})` : "paused"}</Tag>
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Both providers' state in one render fn
                          </Text>
                        </div>

                        {on && (
                          <div
                            style={{
                              position: "absolute",
                              left: Math.max(120, Math.min(x, 580)),
                              top: Math.max(8, Math.min(y, 100)),
                              background: "#1677ff",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontFamily: "var(--font-mono)",
                              pointerEvents: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ({x}, {y})
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}
            />

            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "#1e1e1e",
                borderRadius: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 1.9,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#6a9955" }}>
                {"// Nesting render prop providers: each adds its state:"}
              </div>
              <div>{"<Toggle render={({ on, toggle }) => ("}</div>
              <div style={{ paddingLeft: 16 }}>{"<MouseTracker render={({ x, y }) => ("}</div>
              <div style={{ paddingLeft: 32, color: "#ce9178" }}>
                {"// on, toggle, x, y all available here"}
              </div>
              <div style={{ paddingLeft: 16 }}>{")}>"} </div>
              <div>{")} />"}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/render-props" currentLevel="advanced" />
    </div>
  );
}
