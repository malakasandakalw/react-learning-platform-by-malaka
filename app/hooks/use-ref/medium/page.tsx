"use client";

// useRef: Medium
// Concept: useRef as a value store, not just for DOM elements.
// ref.current can hold ANY mutable value that persists across renders
// WITHOUT causing re-renders when changed. This is the key distinction from useState.
//
// Pattern shown: tracking the previous value of a state variable.
// After each render, we sync ref.current with the latest value.
// On the NEXT render, ref.current still holds the OLD value so we can compare.

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Row,
  Slider,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Custom hook usePrevious: the classic use case for ref-as-value-store.
// This hook is used so often it became a community convention.
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  // useEffect runs AFTER the render.
  // So during the render, ref.current still holds the OLD value.
  // After the render, we update it to the new value for next time.
  useEffect(() => {
    ref.current = value;
  }, [value]); // runs after every render where value changed

  return ref.current; // returns OLD value during this render
}

function StockTracker() {
  const [price, setPrice] = useState(142.5);
  const previousPrice = usePrevious(price);

  const diff = previousPrice !== undefined ? price - previousPrice : 0;
  const trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";

  function randomMove() {
    setPrice((p) => Math.max(1, +(p + (Math.random() - 0.48) * 10).toFixed(2)));
  }

  return (
    <Card title="Stock Price Tracker" style={{ borderRadius: 12 }}>
      <Space orientation="vertical" style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Current Price"
              value={price}
              prefix="$"
              precision={2}
              styles={{
                content: {
                  color: trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "#374151",
                },
              }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Previous Price"
              value={previousPrice ?? "N/A"}
              prefix={previousPrice ? "$" : ""}
              precision={2}
              styles={{ content: { color: "#9ca3af" } }}
            />
          </Col>
        </Row>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text>Change:</Text>
          {trend === "up" && (
            <Tag color="success" icon={<ArrowUpOutlined />}>
              +${diff.toFixed(2)}
            </Tag>
          )}
          {trend === "down" && (
            <Tag color="error" icon={<ArrowDownOutlined />}>
              ${diff.toFixed(2)}
            </Tag>
          )}
          {trend === "flat" && <Tag icon={<MinusOutlined />}>No change</Tag>}
        </div>

        <Button type="primary" onClick={randomMove} block>
          Simulate price movement
        </Button>
      </Space>
    </Card>
  );
}

// Second demo: ref to store render count
// renderCount.current increments on every render, but because it's a ref
// and not state, incrementing it does NOT cause another render (no infinite loop).
function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // This runs on every render and we can safely mutate ref.current here
  // because it won't trigger another render.
  renderCount.current += 1;

  return (
    <Card title="Render Count vs State Count" style={{ borderRadius: 12 }}>
      <Space orientation="vertical" style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="State value" value={count} />
          </Col>
          <Col span={12}>
            <Statistic title="Total renders" value={renderCount.current} />
          </Col>
        </Row>

        <Slider value={count} min={0} max={20} onChange={setCount} />

        <Text type="secondary" style={{ fontSize: 12 }}>
          Moving the slider changes state → triggers re-render → renderCount increments. renderCount
          itself never causes a re-render.
        </Text>
      </Space>
    </Card>
  );
}

export default function UseRefMediumPage() {
  return (
    <div>
      <PageIntro
        title="useRef"
        level="medium"
        description="useRef is not just for DOM elements. It is a general-purpose mutable container that survives re-renders. Unlike state, mutating ref.current is instant, synchronous, and does not schedule a re-render."
        teaches={[
          "useRef as a value store: persists across renders without causing re-renders",
          "The usePrevious pattern: useEffect syncs ref AFTER render",
          "Tracking render counts without creating infinite loops",
          "When NOT to use ref: if the value affects the UI, use state",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <StockTracker />
        </Col>
        <Col xs={24} md={12}>
          <RenderCounter />
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-ref" currentLevel="medium" />
    </div>
  );
}
