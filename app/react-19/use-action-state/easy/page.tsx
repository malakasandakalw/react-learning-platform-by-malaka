"use client";

// React 19: useActionState Easy
// Concept: useActionState manages state that is updated by an "action" function.
// It returns [state, dispatch, isPending].
// When you call dispatch(payload), the action function runs and the state updates.
// isPending is true while the action is executing with no manual loading flags.
//
// Syntax: useActionState(actionFn, initialState)
// actionFn receives (currentState, payload) and returns the next state.

import { useActionState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  Typography,
  Space,
} from "antd";
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Action function: receives current state and the dispatched payload.
// Simulates an async operation (e.g. saving to a server).
// Must return the next state (sync or async).
async function counterAction(
  currentState: { count: number; lastAction: string },
  payload: "increment" | "decrement" | "reset"
): Promise<{ count: number; lastAction: string }> {
  // Simulate a network delay (e.g. optimistic update that confirms with server)
  await new Promise((r) => setTimeout(r, 400));

  switch (payload) {
    case "increment":
      return { count: currentState.count + 1, lastAction: "incremented" };
    case "decrement":
      return { count: currentState.count - 1, lastAction: "decremented" };
    case "reset":
      return { count: 0, lastAction: "reset" };
    default:
      return currentState;
  }
}

export default function UseActionStateEasyPage() {
  // useActionState(action, initialState) → [state, dispatch, isPending]
  const [state, dispatch, isPending] = useActionState(counterAction, {
    count: 0,
    lastAction: "none",
  });

  return (
    <div>
      <PageIntro
        title="useActionState"
        level="easy"
        description="useActionState manages state driven by an action function. The action receives the current state and the dispatched value, runs async logic, and returns the next state. isPending tracks execution automatically."
        teaches={[
          "useActionState(action, initialState) → [state, dispatch, isPending]",
          "The action function: (currentState, payload) => nextState",
          "async actions: useActionState handles the pending state automatically",
          "dispatch(payload) triggers the action with that payload",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Counter (useActionState)" style={{ borderRadius: 12 }}>
            <Space direction="vertical" align="center" style={{ width: "100%" }} size={20}>
              <Statistic
                value={state.count}
                valueStyle={{ fontSize: 72, color: "#059669" }}
              />

              <Space>
                <Button
                  size="large"
                  icon={<MinusOutlined />}
                  loading={isPending}
                  onClick={() => dispatch("decrement")}
                />
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  loading={isPending}
                  onClick={() => dispatch("reset")}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  loading={isPending}
                  onClick={() => dispatch("increment")}
                />
              </Space>

              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Last action: </Text>
                <Tag color="green">{state.lastAction}</Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="useActionState anatomy"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#7c3aed" }}>// Define the action:</div>
              <div>async function action(state, payload) {"{"}</div>
              <div style={{ paddingLeft: 12, color: "#fbbf24" }}>await saveToServer();</div>
              <div style={{ paddingLeft: 12 }}>return newState;</div>
              <div>{"}"}</div>
              <br />
              <div style={{ color: "#7c3aed" }}>// In component:</div>
              <div>const [state, dispatch, isPending]</div>
              <div style={{ paddingLeft: 12 }}>= useActionState(action, initial);</div>
              <br />
              <div style={{ color: "#7c3aed" }}>// Dispatch:</div>
              <div style={{ color: "#4ade80" }}>dispatch("increment")  <span style={{ color: "#6b7280" }}>← payload</span></div>
              <div style={{ marginTop: 12, padding: "8px 10px", background: "#161630", borderRadius: 6 }}>
                <div>count: <span style={{ color: "#4ade80" }}>{state.count}</span></div>
                <div>isPending: <span style={{ color: isPending ? "#f59e0b" : "#4ade80" }}>{String(isPending)}</span></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-action-state" currentLevel="easy" />
    </div>
  );
}
