"use client";

// useState: Easy
// Concept: useState returns a state value and a setter function.
// Every time the setter is called, React re-renders the component with the new value.
// This is the simplest way to add interactivity to a component.

import { useState } from "react";
import { Button, Card, Col, Row, Space, Statistic, Switch, Tag, Typography } from "antd";
import { MinusOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Title, Text } = Typography;

// --- Counter Demo ---
// useState(0) sets the initial value to 0.
// 'count' is the current state value.
// 'setCount' is the function to update it.
function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <Card title="Counter" style={{ borderRadius: 12 }}>
      <Space orientation="vertical" align="center" style={{ width: "100%" }}>
        <Statistic value={count} styles={{ content: { fontSize: 56 } }} />
        <Space>
          <Button icon={<MinusOutlined />} onClick={() => setCount(count - 1)} size="large" />
          <Button icon={<ReloadOutlined />} onClick={() => setCount(0)} size="large">
            Reset
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCount(count + 1)}
            size="large"
          />
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Render count updates every time setCount is called
        </Text>
      </Space>
    </Card>
  );
}

// --- Toggle Demo ---
// useState(false): a boolean state is perfect for on/off switches.
// The setter can accept a callback: setIsOn(prev => !prev)
// Using the callback form is safer when the new value depends on the previous one.
function ToggleDemo() {
  const [isOn, setIsOn] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <Card title="Toggle States" style={{ borderRadius: 12 }}>
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text>Feature flag</Text>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag color={isOn ? "success" : "default"}>{isOn ? "Enabled" : "Disabled"}</Tag>
            {/* setIsOn(prev => !prev): functional update using previous state */}
            <Switch checked={isOn} onChange={() => setIsOn((prev) => !prev)} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text>Notifications</Text>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag color={notifications ? "blue" : "default"}>{notifications ? "On" : "Off"}</Tag>
            <Switch checked={notifications} onChange={() => setNotifications((prev) => !prev)} />
          </div>
        </div>
      </Space>
    </Card>
  );
}

export default function UseStateEasyPage() {
  return (
    <div>
      <PageIntro
        sourcePath="app/hooks/use-state/easy/page.tsx"
        title="useState"
        level="easy"
        description="useState is how you add memory to a component. Without it, every render starts fresh. With it, React remembers values between renders and re-renders the component whenever they change."
        teaches={[
          "How to declare state with useState(initialValue)",
          "How calling the setter triggers a re-render",
          "Using the functional update form: setState(prev => ...)",
          "Managing boolean state for toggles and flags",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <CounterDemo />
        </Col>
        <Col xs={24} md={12}>
          <ToggleDemo />
        </Col>
      </Row>

      {/* Key concept callout */}
      <Card
        style={{ marginTop: 24, borderRadius: 12, borderLeft: "3px solid #1677ff" }}
        styles={{ body: { padding: 20 } }}
      >
        <Title level={5} style={{ margin: "0 0 8px" }}>
          Key Rule
        </Title>
        <Text style={{ fontSize: 13 }}>
          Never mutate state directly (e.g. <code>count++</code>). Always call the setter. React
          compares the old and new values. If they are the same reference, it skips the re-render.
          For objects and arrays, always return a new reference.
        </Text>
      </Card>

      <LevelNavigator basePath="/hooks/use-state" currentLevel="easy" />
    </div>
  );
}
