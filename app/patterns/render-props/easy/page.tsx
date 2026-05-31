"use client";

// Patterns: Render Props (Easy)
// Concept: A component with a render prop delegates its rendering to a function.
// Instead of rendering JSX itself, it calls props.render(state) or props.children(state).
// This lets the parent control the UI while the component controls the logic.
// Pattern: <Mouse render={(pos) => <Cursor at={pos} />} />

import { useState } from "react";
import { Card, Col, Row, Typography, Tag, Space, Switch } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── Hover render prop component ──────────────────────────────────────────────
// Controls hover state internally. Renders whatever the consumer wants.
// The consumer gets isHovered and can render anything with it.
type HoverProps = {
  children: (isHovered: boolean) => React.ReactNode;
};

function Hover({ children }: HoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "inline-block" }}
    >
      {/* children is a FUNCTION: call it with the internal state */}
      {children(isHovered)}
    </div>
  );
}

// ─── Toggle render prop component ─────────────────────────────────────────────
type ToggleRenderProps = {
  initialOn?: boolean;
  render: (props: { on: boolean; toggle: () => void }) => React.ReactNode;
};

function Toggle({ initialOn = false, render }: ToggleRenderProps) {
  const [on, setOn] = useState(initialOn);
  const toggle = () => setOn((v) => !v);
  return <>{render({ on, toggle })}</>;
}

export default function RenderPropsEasyPage() {
  return (
    <div>
      <PageIntro
        title="Render Props"
        level="easy"
        description="A render prop is a prop whose value is a function. The component calls this function with its internal state, letting the consumer control the UI while the component controls the logic."
        teaches={[
          "children as a function: {(state) => <JSX>} is the most common render prop form",
          "render prop: render={(state) => <JSX>} is the explicit named render prop form",
          "The component provides logic, the consumer provides the view",
          "Custom hooks replaced most render prop use cases, but render props still have unique advantages",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Hover with children-as-function */}
        <Col xs={24} md={12}>
          <Card title="Hover: children as function" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
              The Hover component tracks hover state. The consumer decides what to render.
            </Text>
            <Space orientation="vertical" style={{ width: "100%" }} size={12}>
              <Hover>
                {(isHovered) => (
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      background: isHovered ? "#1677ff" : "#f5f5f5",
                      color: isHovered ? "#fff" : "rgba(0,0,0,0.88)",
                      transition: "all 0.2s",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    {isHovered ? "Hovering! 🎯" : "Hover over me"}
                  </div>
                )}
              </Hover>

              <Hover>
                {(isHovered) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: isHovered ? "#1677ff" : "#d9d9d9",
                        transition: "background 0.2s",
                      }}
                    />
                    <Text>
                      Status:{" "}
                      <Tag color={isHovered ? "success" : "default"}>
                        {isHovered ? "active" : "idle"}
                      </Tag>
                    </Text>
                  </div>
                )}
              </Hover>
            </Space>
          </Card>
        </Col>

        {/* Toggle with explicit render prop */}
        <Col xs={24} md={12}>
          <Card title="Toggle: render prop" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
              The Toggle component manages on/off state. Two consumers render it differently.
            </Text>
            <Space orientation="vertical" style={{ width: "100%" }} size={16}>
              <Toggle
                render={({ on, toggle }) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Switch checked={on} onChange={toggle} />
                    <Text>
                      Feature flag:{" "}
                      <Tag color={on ? "success" : "default"}>{on ? "enabled" : "disabled"}</Tag>
                    </Text>
                  </div>
                )}
              />
              <Toggle
                initialOn={true}
                render={({ on, toggle }) => (
                  <div
                    onClick={toggle}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      background: "#ffffff",
                      cursor: "pointer",
                      textAlign: "center",
                      border: `2px solid ${on ? "#1677ff" : "#d9d9d9"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    💡 {on ? "Light is ON" : "Light is OFF"}
                  </div>
                )}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/render-props" currentLevel="easy" />
    </div>
  );
}
