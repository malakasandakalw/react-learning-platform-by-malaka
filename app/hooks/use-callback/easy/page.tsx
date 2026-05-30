"use client";

// useCallback: Easy
// Concept: useCallback memoizes a FUNCTION (not a value like useMemo).
// Every render creates a new function instance. If you pass a function as a prop
// to a React.memo child, that child re-renders even if nothing logically changed
// because the function reference is new. useCallback gives you the SAME function
// reference across renders, making React.memo effective.

import { memo, useCallback, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// A child component that shows how often it re-renders.
// React.memo means it SHOULD only re-render when its props change.
// But if the onIncrement prop is a new function every render, it re-renders anyway.
const CounterButton = memo(function CounterButton({
  label,
  onClick,
  renderCount,
}: {
  label: string;
  onClick: () => void;
  renderCount: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#f8f9fc",
        borderRadius: 8,
        padding: "12px 16px",
        border: "2px solid",
        borderColor: renderCount > 2 ? "#fbbf24" : "#a7f3d0",
      }}
    >
      <Text>{label}</Text>
      <Space>
        <Badge
          count={renderCount}
          title={`Rendered ${renderCount} times`}
          style={{ background: renderCount > 4 ? "#ef4444" : renderCount > 2 ? "#f59e0b" : "#16a34a" }}
        />
        <Button icon={<PlusOutlined />} onClick={onClick} size="small" type="primary" />
      </Space>
    </div>
  );
});

export default function UseCallbackEasyPage() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [unrelated, setUnrelated] = useState(0);
  const [callbackEnabled, setCallbackEnabled] = useState(true);

  // Track renders in a ref-like way using a module-level variable for simplicity
  const [renderCountA, setRenderCountA] = useState(0);
  const [renderCountB, setRenderCountB] = useState(0);

  // ❌ Without useCallback: new function every render → child re-renders every time
  const handleIncrementAUnmemo = () => {
    setCountA((c) => c + 1);
    setRenderCountA((c) => c + 1);
  };

  // ✓ With useCallback: same function reference unless countA changes
  const handleIncrementAMemo = useCallback(() => {
    setCountA((c) => c + 1);
    setRenderCountA((c) => c + 1);
  }, []); // []: function never changes because we use the functional updater form

  const handleIncrementB = useCallback(() => {
    setCountB((c) => c + 1);
    setRenderCountB((c) => c + 1);
  }, []);

  const handleIncrementA = callbackEnabled ? handleIncrementAMemo : handleIncrementAUnmemo;

  return (
    <div>
      <PageIntro
        title="useCallback"
        level="easy"
        description="useCallback memoizes a function. Without it, every render creates a new function instance, which breaks React.memo optimization on child components that receive functions as props."
        teaches={[
          "Functions are objects: every render creates a NEW function instance",
          "React.memo skips re-renders only when props are the same reference",
          "useCallback(() => fn(), [deps]) returns the same function reference",
          "Why the functional updater form (prev => prev + 1) allows empty deps []",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            title="Child Render Counter"
            extra={
              <Space>
                <Text style={{ fontSize: 12 }}>useCallback:</Text>
                <Switch
                  checked={callbackEnabled}
                  onChange={setCallbackEnabled}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Each badge shows how many times that child component re-rendered.
                Click "Unrelated state". With useCallback ON, buttons should not re-render.
              </Text>

              <CounterButton
                label={`Counter A: ${countA}`}
                onClick={handleIncrementA}
                renderCount={renderCountA}
              />
              <CounterButton
                label={`Counter B: ${countB}`}
                onClick={handleIncrementB}
                renderCount={renderCountB}
              />

              <Button
                block
                style={{ marginTop: 8 }}
                onClick={() => setUnrelated((c) => c + 1)}
              >
                Unrelated state change (×{unrelated}): should NOT re-render children
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Function Identity"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, lineHeight: 2 }}>
              <div style={{ color: "#6b7280" }}>// Every render:</div>
              <div style={{ color: "#f87171" }}>const fn = {"() => {}"}</div>
              <div style={{ color: "#f87171" }}>fn === fn? <span style={{ color: "#e2e8f0" }}>false ❌</span></div>
              <br />
              <div style={{ color: "#6b7280" }}>// With useCallback:</div>
              <div style={{ color: "#4ade80" }}>const fn = useCallback({"() => {}"}, [])</div>
              <div style={{ color: "#4ade80" }}>fn === fn? <span style={{ color: "#e2e8f0" }}>true ✓</span></div>
              <br />
              <div style={{ color: "#6b7280" }}>// Because:</div>
              <div style={{ color: "#e2e8f0" }}>useCallback ON: <Tag color="green" style={{ fontSize: 10 }}>{callbackEnabled ? "stable ref" : "new ref"}</Tag></div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-callback" currentLevel="easy" />
    </div>
  );
}
