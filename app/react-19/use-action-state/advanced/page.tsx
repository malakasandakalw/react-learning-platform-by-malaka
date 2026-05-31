"use client";

// React 19: useActionState (Advanced)
// Concept: Combining useActionState with useOptimistic for instant feedback.
// The action posts to the server. useOptimistic shows the result immediately
// in the UI while the real action runs. If it fails, the optimistic update reverts.

import { useActionState, useOptimistic, useTransition } from "react";
import { Avatar, Button, Card, Col, Input, List, Row, Tag, Typography, Space, Alert } from "antd";
import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { createTodo } from "@/services/jsonPlaceholder";
import type { Todo } from "@/types/post";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type TodoState = {
  items: Todo[];
  error: string | null;
  addCount: number;
};

const initial: TodoState = {
  items: [
    { id: 1, userId: 1, title: "Review pull requests", completed: true },
    { id: 2, userId: 1, title: "Write unit tests", completed: false },
    { id: 3, userId: 1, title: "Update documentation", completed: false },
  ],
  error: null,
  addCount: 0,
};

async function addTodoAction(state: TodoState, title: string): Promise<TodoState> {
  if (!title.trim()) return { ...state, error: "Title cannot be empty" };

  try {
    const created = await createTodo({ userId: 1, title, completed: false });
    return {
      items: [...state.items, created],
      error: null,
      addCount: state.addCount + 1,
    };
  } catch {
    return { ...state, error: "Failed to add todo. Rolled back." };
  }
}

let tempId = -1;

export default function UseActionStateAdvancedPage() {
  const [state, dispatch, isPending] = useActionState(addTodoAction, initial);
  const [inputValue, setInputValue] = React.useState("");

  // useOptimistic shows the new item immediately while the action runs
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    state.items,
    (current: Todo[], newTitle: string) => [
      ...current,
      { id: tempId--, userId: 1, title: newTitle, completed: false },
    ]
  );

  const [, startTransition] = useTransition();

  function handleAdd() {
    if (!inputValue.trim()) return;
    const title = inputValue.trim();
    setInputValue("");

    startTransition(async () => {
      addOptimisticItem(title); // Show immediately
      dispatch(title); // Confirm with server
    });
  }

  return (
    <div>
      <PageIntro
        title="useActionState"
        level="advanced"
        apiUsed="JSONPlaceholder"
        description="useActionState + useOptimistic is the production pattern for form actions. The optimistic update shows the result instantly. The action confirms it with the server. On failure, the optimistic item reverts automatically."
        teaches={[
          "useOptimistic shows the result before the server confirms",
          "startTransition wraps both optimistic update and dispatch together",
          "On action failure: optimistic state reverts, error appears in action state",
          "The combination = instant UX + server consistency",
        ]}
      />

      {state.error && (
        <Alert
          type="error"
          title={state.error}
          showIcon
          style={{ marginBottom: 16, borderRadius: 8 }}
          closable
        />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card
            title={`Todo List (${state.addCount} added this session)`}
            style={{ borderRadius: 12 }}
          >
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleAdd}
                placeholder="New todo..."
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                loading={isPending}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Space.Compact>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {optimisticItems.map((item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={28}
                        style={{
                          background:
                            item.id < 0 ? "#8c8c8c" : item.completed ? "#1677ff" : "#722ed1",
                        }}
                        icon={item.completed ? <CheckCircleOutlined /> : undefined}
                      >
                        {item.id < 0 ? "…" : null}
                      </Avatar>
                    }
                    title={
                      <Text
                        style={{
                          textDecoration: item.completed ? "line-through" : "none",
                          color: item.completed ? "#9ca3af" : undefined,
                        }}
                      >
                        {item.title}
                      </Text>
                    }
                    description={
                      item.id < 0 ? (
                        <Tag color="orange">Saving to server…</Tag>
                      ) : (
                        <Tag color={item.completed ? "success" : "default"}>
                          {item.completed ? "Done" : "Pending"}
                        </Tag>
                      )
                    }
                  />
                </List.Item>
              ))}
            </ul>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="State Flow"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#b5cea8" }}>1. handleAdd() fires</div>
              <div style={{ color: "#b5cea8" }}>2. addOptimisticItem(title)</div>
              <div style={{ color: "#b5cea8" }}> → list updates instantly</div>
              <div style={{ color: "#ce9178" }}>3. dispatch(title)</div>
              <div style={{ color: "#ce9178" }}> → action runs async</div>
              <div style={{ color: "#b5cea8" }}>4a. success → real item added</div>
              <div style={{ color: "#ce9178" }}>4b. error → optimistic reverts</div>
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 10px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                }}
              >
                <div>
                  real items: <span style={{ color: "#b5cea8" }}>{state.items.length}</span>
                </div>
                <div>
                  optimistic: <span style={{ color: "#ce9178" }}>{optimisticItems.length}</span>
                </div>
                <div>
                  isPending:{" "}
                  <span style={{ color: isPending ? "#ce9178" : "#b5cea8" }}>
                    {String(isPending)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-action-state" currentLevel="advanced" />
    </div>
  );
}

import React from "react";
