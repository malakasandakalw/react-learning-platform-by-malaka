"use client";

// React 19: useActionState (Advanced)
// Concept: Combining useActionState with useOptimistic for instant feedback.
// The action posts to the server. useOptimistic shows the result immediately
// in the UI while the real action runs. If it fails, the optimistic update reverts.

import { useActionState, useOptimistic, useTransition } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  List,
  Row,
  Tag,
  Typography,
  Space,
  Alert,
} from "antd";
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
      dispatch(title);          // Confirm with server
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
        <Alert type="error" message={state.error} showIcon style={{ marginBottom: 16, borderRadius: 8 }} closable />
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
              <Button type="primary" icon={<PlusOutlined />} loading={isPending} onClick={handleAdd}>
                Add
              </Button>
            </Space.Compact>

            <List
              dataSource={optimisticItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={28}
                        style={{ background: item.id < 0 ? "#f59e0b" : item.completed ? "#16a34a" : "#4f46e5" }}
                        icon={item.completed ? <CheckCircleOutlined /> : undefined}
                      >
                        {item.id < 0 ? "…" : null}
                      </Avatar>
                    }
                    title={
                      <Text style={{ textDecoration: item.completed ? "line-through" : "none", color: item.completed ? "#9ca3af" : undefined }}>
                        {item.title}
                      </Text>
                    }
                    description={
                      item.id < 0
                        ? <Tag color="orange">Saving to server…</Tag>
                        : <Tag color={item.completed ? "success" : "default"}>{item.completed ? "Done" : "Pending"}</Tag>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="State Flow"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#4ade80" }}>1. handleAdd() fires</div>
              <div style={{ color: "#4ade80" }}>2. addOptimisticItem(title)</div>
              <div style={{ color: "#4ade80" }}>   → list updates instantly</div>
              <div style={{ color: "#fbbf24" }}>3. dispatch(title)</div>
              <div style={{ color: "#fbbf24" }}>   → action runs async</div>
              <div style={{ color: "#4ade80" }}>4a. success → real item added</div>
              <div style={{ color: "#f87171" }}>4b. error → optimistic reverts</div>
              <div style={{ marginTop: 12, padding: "8px 10px", background: "#161630", borderRadius: 6 }}>
                <div>real items: <span style={{ color: "#4ade80" }}>{state.items.length}</span></div>
                <div>optimistic: <span style={{ color: "#fbbf24" }}>{optimisticItems.length}</span></div>
                <div>isPending: <span style={{ color: isPending ? "#f59e0b" : "#4ade80" }}>{String(isPending)}</span></div>
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
