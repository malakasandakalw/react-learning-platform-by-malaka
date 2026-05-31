"use client";

// Redux Toolkit: Easy
// Concept: The basics of RTK.
// createSlice generates action creators and reducers in one go.
// The store is configured with configureStore.
// Components read state with useAppSelector and trigger changes with useAppDispatch.
// This is the minimal Redux Toolkit setup with everything you need to get started.

import { Button, Card, Col, Row, Select, Space, Statistic, Tag, Typography, Divider } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  increment,
  decrement,
  reset,
  setStep,
  incrementByAmount,
} from "@/store/slices/counterSlice";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

const STEP_OPTIONS = [
  { value: 1, label: "Step: 1" },
  { value: 5, label: "Step: 5" },
  { value: 10, label: "Step: 10" },
  { value: 25, label: "Step: 25" },
];

export default function ReduxEasyPage() {
  // useAppSelector: reads a slice of the Redux store.
  // The selector function receives the ENTIRE RootState and picks what we need.
  const count = useAppSelector((state) => state.counter.value);
  const step = useAppSelector((state) => state.counter.step);

  // useAppDispatch: returns the dispatch function to send actions to the store.
  const dispatch = useAppDispatch();

  return (
    <div>
      <PageIntro
        title="Redux Toolkit"
        level="easy"
        description="Redux Toolkit removes the boilerplate. createSlice generates your action creators and reducer together. useAppSelector reads from the store. useAppDispatch sends actions. That's the entire API you need for most use cases."
        teaches={[
          "createSlice generates action creators + reducer in one place",
          "useAppSelector((state) => state.slice.value): reads from store",
          "useAppDispatch(): returns the dispatch function",
          "Actions are dispatched as objects: dispatch(increment())",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={13}>
          <Card title="Counter (Redux Store)" style={{ borderRadius: 12 }}>
            <Space orientation="vertical" align="center" style={{ width: "100%" }} size={20}>
              <Statistic value={count} styles={{ content: { fontSize: 72 } }} />

              <Space>
                <Button
                  size="large"
                  icon={<MinusOutlined />}
                  // dispatch(action()): sends the action to the Redux store
                  onClick={() => dispatch(decrement())}
                />
                <Button size="large" icon={<ReloadOutlined />} onClick={() => dispatch(reset())}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => dispatch(increment())}
                />
              </Space>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Step size:
                </Text>
                <Select
                  value={step}
                  onChange={(val) => dispatch(setStep(val))}
                  options={STEP_OPTIONS}
                  size="small"
                  style={{ width: 100 }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {[10, 25, 50, -10].map((amount) => (
                  <Button
                    key={amount}
                    size="small"
                    icon={<ThunderboltOutlined />}
                    onClick={() => dispatch(incrementByAmount(amount))}
                  >
                    {amount > 0 ? `+${amount}` : amount}
                  </Button>
                ))}
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={11}>
          <Card
            title="Redux Store Inspector"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#6a9955" }}>// store.getState()</div>
              <div style={{ color: "#d4d4d4" }}>{"{"}</div>
              <div style={{ paddingLeft: 16 }}>
                <span style={{ color: "#569cd6" }}>counter:</span>
                <span style={{ color: "#d4d4d4" }}>{" {"}</span>
              </div>
              <div style={{ paddingLeft: 32 }}>
                <span style={{ color: "#d4d4d4" }}>value: </span>
                <span style={{ color: "#b5cea8" }}>{count}</span>
              </div>
              <div style={{ paddingLeft: 32 }}>
                <span style={{ color: "#d4d4d4" }}>step: </span>
                <span style={{ color: "#b5cea8" }}>{step}</span>
              </div>
              <div style={{ paddingLeft: 16, color: "#d4d4d4" }}>{"}"}</div>
              <div style={{ color: "#d4d4d4" }}>{"}"}</div>
              <Divider style={{ borderColor: "#333", margin: "12px 0" }} />
              <div style={{ color: "#6a9955" }}>// Available actions:</div>
              {[
                "increment()",
                "decrement()",
                "reset()",
                `setStep(${step})`,
                `incrementByAmount(n)`,
              ].map((a) => (
                <div key={a}>
                  <Tag color="blue" style={{ fontSize: 10, margin: "1px 0" }}>
                    {a}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/redux" currentLevel="easy" />
    </div>
  );
}
