"use client";

// useOptimistic: Medium
// Concept: Optimistic CRUD on a todo list backed by JSONPlaceholder.
// Adding and toggling todos feel instant because the UI updates before the API responds.
// The real state only updates once the API call succeeds.

import { useOptimistic, useState, useTransition } from "react";
import { Button, Card, Checkbox, Col, Input, Row, Space, Tag, Typography, Spin, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getTodosByUser, createTodo } from "@/services/jsonPlaceholder";
import type { Todo } from "@/types/post";
import { useEffect } from "react";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type OptimisticAction = { type: "add"; todo: Todo } | { type: "toggle"; id: number };

// The reducer for optimistic updates (same pattern as useReducer)
function optimisticReducer(state: Todo[], action: OptimisticAction): Todo[] {
  switch (action.type) {
    case "add":
      return [action.todo, ...state];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
  }
}

let tempIdCounter = -1; // negative IDs for optimistic items before API assigns real ID

export default function UseOptimisticMediumPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getTodosByUser(1).then((data) => {
      setTodos(data.slice(0, 10));
      setLoading(false);
    });
  }, []);

  const [optimisticTodos, applyOptimistic] = useOptimistic(todos, optimisticReducer);

  async function handleAdd() {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setNewTitle("");

    startTransition(async () => {
      // Optimistic: add a temporary todo with a temp ID immediately
      const tempTodo: Todo = { id: tempIdCounter--, userId: 1, title, completed: false };
      applyOptimistic({ type: "add", todo: tempTodo });

      // Real: create via API
      const created = await createTodo({ userId: 1, title, completed: false });

      // Replace temp todo with real one
      setTodos((prev) => [{ ...created, id: created.id }, ...prev]);
    });
  }

  async function handleToggle(id: number) {
    startTransition(async () => {
      // Optimistic: toggle immediately
      applyOptimistic({ type: "toggle", id });

      // Simulate API call (JSONPlaceholder doesn't actually persist, but we call it)
      await new Promise((r) => setTimeout(r, 600));

      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    });
  }

  return (
    <div>
      <PageIntro
        title="useOptimistic"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="Full CRUD with optimistic updates. Adding and toggling todos feel instant with no waiting for the server. The optimistic reducer mirrors the real update logic, ensuring the UI reflects the intended outcome."
        teaches={[
          "Optimistic reducer: same pattern as useReducer",
          "Temporary IDs for optimistic items (negative numbers)",
          "Replacing the temp item with the real API response",
          "Multiple concurrent optimistic updates in the same list",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Todo List (Optimistic)" style={{ borderRadius: 12 }}>
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onPressEnter={handleAdd}
                placeholder="Add a new todo..."
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add
              </Button>
            </Space.Compact>

            {loading ? (
              <div style={{ textAlign: "center", padding: 32 }}>
                <Spin />
              </div>
            ) : optimisticTodos.length === 0 ? (
              <Empty />
            ) : (
              optimisticTodos.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 4px",
                    borderBottom: "1px solid #f5f5f5",
                    opacity: todo.id < 0 ? 0.7 : 1, // temp items appear slightly faded
                  }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => todo.id > 0 && handleToggle(todo.id)}
                  />
                  <Text
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#9ca3af" : undefined,
                    }}
                  >
                    {todo.title}
                  </Text>
                  {todo.id < 0 && <Tag color="warning">Saving...</Tag>}
                  {todo.completed && <Tag color="success">Done</Tag>}
                </div>
              ))
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Optimistic State"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
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
              <div>
                <span style={{ color: "#569cd6" }}>todos (real): </span>
                <span style={{ color: "#d4d4d4" }}>{todos.length}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>optimisticTodos: </span>
                <span style={{ color: "#b5cea8" }}>{optimisticTodos.length}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#dcdcaa" : "#b5cea8" }}>
                  {String(isPending)}
                </span>
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                <div style={{ color: "#569cd6" }}>Temp items (id &lt; 0):</div>
                <div style={{ color: "#6a9955" }}>
                  {optimisticTodos.filter((t) => t.id < 0).length} pending
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-optimistic" currentLevel="medium" />
    </div>
  );
}
