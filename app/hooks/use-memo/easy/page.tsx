"use client";

// useMemo: Easy
// Concept: useMemo caches the result of an expensive calculation.
// The cached value is reused on re-renders as long as the dependencies haven't changed.
// Without useMemo, the calculation runs on EVERY render, even when unrelated state changes.
// This page proves that by showing how an unrelated state change (counter) can
// trigger an expensive calculation without memoization.

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Row,
  Statistic,
  Switch,
  Tag,
  Typography,
  Space,
} from "antd";
import { ThunderboltOutlined, ClockCircleOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Intentionally slow: simulates heavy computation (e.g. complex data transformation)
function expensiveFactorial(n: number): number {
  let result = 1;
  // Artificially slow loop to make the cost visible
  for (let i = 0; i < 1_000_000; i++) {
    if (i <= n) result = i === 0 ? 1 : result * i;
  }
  return result <= 0 ? 1 : result;
}

function formatBigNumber(n: number): string {
  if (!isFinite(n)) return "∞";
  return n.toLocaleString();
}

export default function UseMemoEasyPage() {
  const [number, setNumber] = useState(10);
  const [counter, setCounter] = useState(0);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  // WITH useMemo: result is only recomputed when 'number' changes.
  // Clicking "increment counter" does NOT recompute because counter is not a dependency.
  const memoizedResult = useMemo(() => {
    if (!useMemoEnabled) return null;
    return expensiveFactorial(number);
    // [number]: only recompute when number changes
  }, [number, useMemoEnabled]);

  // WITHOUT useMemo: runs on every render, even the counter click
  const unmemoizedResult = !useMemoEnabled ? expensiveFactorial(number) : null;

  const result = useMemoEnabled ? memoizedResult : unmemoizedResult;

  return (
    <div>
      <PageIntro
        title="useMemo"
        level="easy"
        description="useMemo caches the return value of a function between renders. Use it when a calculation is expensive and its inputs don't change on every render."
        teaches={[
          "useMemo(() => compute(a, b), [a, b]): only recomputes when a or b changes",
          "The difference between memoized and unmemoized renders",
          "Why changing unrelated state (counter) should not rerun your calculation",
          "When NOT to use useMemo: do not wrap cheap operations",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <span>Factorial Calculator</span>
                <Tag color={useMemoEnabled ? "purple" : "default"}>
                  {useMemoEnabled ? "useMemo ON" : "useMemo OFF"}
                </Tag>
              </Space>
            }
            extra={
              <Switch
                checked={useMemoEnabled}
                onChange={setUseMemoEnabled}
                checkedChildren="Memo"
                unCheckedChildren="No Memo"
              />
            }
            style={{ borderRadius: 12 }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={20}>
              <div>
                <Text>Calculate factorial of:</Text>
                <InputNumber
                  value={number}
                  min={1}
                  max={15}
                  onChange={(v) => setNumber(v ?? 1)}
                  style={{ marginLeft: 12 }}
                  size="large"
                />
              </div>

              <div style={{ background: "#f8f9fc", borderRadius: 8, padding: 20, textAlign: "center" }}>
                <ThunderboltOutlined style={{ fontSize: 24, color: "#4f46e5", marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                  {number}! =
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b", fontFamily: "var(--font-geist-mono)" }}>
                  {formatBigNumber(result ?? 0)}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  This button is unrelated to the factorial. Click it. With useMemo ON,
                  the calculation does NOT rerun. With it OFF, every click reruns the expensive loop.
                </Text>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <Button onClick={() => setCounter((c) => c + 1)}>
                    Unrelated counter: {counter}
                  </Button>
                  {!useMemoEnabled && counter > 0 && (
                    <Tag color="red" icon={<ClockCircleOutlined />}>
                      Recalculated {counter}x unnecessarily
                    </Tag>
                  )}
                  {useMemoEnabled && counter > 0 && (
                    <Tag color="green">Calculation skipped ✓</Tag>
                  )}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="useMemo Anatomy"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, lineHeight: 2 }}>
              <div style={{ color: "#7c3aed" }}>const result = useMemo(</div>
              <div style={{ paddingLeft: 16 }}>
                <span style={{ color: "#4ade80" }}>{"() => expensiveCalc(number)"}</span>
                <span style={{ color: "#e2e8f0" }}>,</span>
              </div>
              <div style={{ paddingLeft: 16, color: "#fbbf24" }}>{"[number]"}</div>
              <div style={{ color: "#7c3aed" }}>);</div>
              <div style={{ marginTop: 16, color: "#6b7280" }}>renders where memo skips:</div>
              <div>
                <span style={{ color: "#4ade80" }}>counter changes → </span>
                <span style={{ color: "#e2e8f0" }}>SKIPPED ✓</span>
              </div>
              <div style={{ color: "#6b7280" }}>renders where memo runs:</div>
              <div>
                <span style={{ color: "#fbbf24" }}>number changes → </span>
                <span style={{ color: "#e2e8f0" }}>RECALCULATED</span>
              </div>
              <div style={{ marginTop: 16, padding: "8px 12px", background: "#161630", borderRadius: 6 }}>
                <span style={{ color: "#a5b4fc" }}>current deps: </span>
                <span style={{ color: "#fbbf24" }}>number={number}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-memo" currentLevel="easy" />
    </div>
  );
}
