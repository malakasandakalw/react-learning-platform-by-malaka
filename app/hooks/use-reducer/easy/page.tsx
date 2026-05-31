"use client";

// useReducer: Easy
// Concept: useReducer is an alternative to useState for more structured state updates.
// Instead of calling setX(newValue) directly, you dispatch an action object.
// A pure reducer function receives (currentState, action) and returns the next state.
// This enforces a clear contract: state only changes through known, named actions.
// Redux is built on exactly this pattern.

import { useReducer } from "react";
import { Button, Card, Col, Row, Space, Statistic, Tag, Typography } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// 1. Define your state shape
type State = {
  count: number;
  step: number;
  history: number[];
};

// 2. Define all possible actions as a discriminated union
// This makes your reducer exhaustive: TypeScript will warn you if you miss a case.
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET_STEP"; payload: number }
  | { type: "UNDO" };

const initialState: State = {
  count: 0,
  step: 1,
  history: [],
};

// 3. Write the reducer: pure function, no side effects
// (state, action) => newState
// The switch on action.type exhaustively handles every action.
function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count],
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - state.step,
        history: [...state.history, state.count],
      };
    case "RESET":
      return initialState;
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "UNDO": {
      const prev = state.history[state.history.length - 1];
      if (prev === undefined) return state;
      return {
        ...state,
        count: prev,
        history: state.history.slice(0, -1),
      };
    }
    default:
      return state;
  }
}

const STEP_OPTIONS = [1, 5, 10, 25];

export default function UseReducerEasyPage() {
  // 4. useReducer(reducer, initialState): returns [state, dispatch]
  // dispatch(action) → reducer(currentState, action) → newState → re-render
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <PageIntro
        sourcePath="app/hooks/use-reducer/easy/page.tsx"
        title="useReducer"
        level="easy"
        description="useReducer separates HOW state changes from WHEN it changes. You dispatch named actions; the reducer decides the next state. This makes state transitions explicit, testable, and easy to follow."
        teaches={[
          "useReducer(reducer, initialState) returns [state, dispatch]",
          "dispatch({ type: 'ACTION' }) sends an action to the reducer",
          "Reducer: pure function (state, action) => newState",
          "Discriminated union types make actions type-safe and exhaustive",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card style={{ borderRadius: 12 }}>
            <Space orientation="vertical" align="center" style={{ width: "100%" }} size={20}>
              <Statistic value={state.count} styles={{ content: { fontSize: 72 } }} />

              <Space>
                <Button
                  size="large"
                  icon={<MinusOutlined />}
                  onClick={() => dispatch({ type: "DECREMENT" })}
                />
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={() => dispatch({ type: "RESET" })}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => dispatch({ type: "INCREMENT" })}
                />
              </Space>

              <Space wrap>
                <Button
                  size="small"
                  disabled={state.history.length === 0}
                  onClick={() => dispatch({ type: "UNDO" })}
                >
                  ↩ Undo
                </Button>
              </Space>

              <div style={{ width: "100%" }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Step size:
                </Text>
                <Space style={{ marginLeft: 8 }}>
                  {STEP_OPTIONS.map((s) => (
                    <Tag
                      key={s}
                      style={{ cursor: "pointer", fontWeight: state.step === s ? 700 : 400 }}
                      color={state.step === s ? "blue" : "default"}
                      onClick={() => dispatch({ type: "SET_STEP", payload: s })}
                    >
                      {s}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Dispatch Log"
            style={{ background: "#1e1e1e", border: "none", borderRadius: 8 }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2 }}>
              <div>
                <span style={{ color: "#569cd6" }}>state.count: </span>
                <span style={{ color: "#b5cea8" }}>{state.count}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>state.step: </span>
                <span style={{ color: "#ce9178" }}>{state.step}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>history: </span>
                <span style={{ color: "#d4d4d4" }}>
                  [{state.history.slice(-5).join(", ")}
                  {state.history.length > 5 ? "..." : ""}]
                </span>
              </div>
              <div style={{ marginTop: 12, color: "#6a9955", fontSize: 11 }}>
                Dispatch an action to see the state update
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-reducer" currentLevel="easy" />
    </div>
  );
}
