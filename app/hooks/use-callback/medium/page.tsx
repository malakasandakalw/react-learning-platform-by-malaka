/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react-hooks/immutability */
"use client";

// useCallback: Medium
// Concept: Stable callbacks passed to a list of memoized children.
// This pattern is common in real apps: a parent renders a list and passes
// each item an onDelete/onToggle callback. Without useCallback, every
// item re-renders whenever the parent's unrelated state changes.
// With useCallback (and proper deps), only the affected item re-renders.

import { memo, useCallback, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Space,
  Tag,
  Typography,
  Input,
  Empty,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type Task = { id: number; text: string; done: boolean };

// Memoized task row: will not re-render unless its own props change.
const TaskRow = memo(function TaskRow({
  task,
  onToggle,
  onDelete,
  renderCount,
}: {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  renderCount: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "#f8f9fc",
        borderRadius: 8,
        marginBottom: 6,
      }}
    >
      <Checkbox
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <Text
        style={{
          flex: 1,
          textDecoration: task.done ? "line-through" : "none",
          color: task.done ? "#9ca3af" : undefined,
        }}
      >
        {task.text}
      </Text>
      <Tag title={`${renderCount} renders`}>{renderCount}</Tag>
      <Button
        icon={<DeleteOutlined />}
        size="small"
        danger
        onClick={() => onDelete(task.id)}
      />
    </div>
  );
});

let nextId = 5;

export default function UseCallbackMediumPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn useCallback", done: false },
    { id: 2, text: "Build something with React", done: true },
    { id: 3, text: "Review pull requests", done: false },
    { id: 4, text: "Write unit tests", done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");
  const [unrelated, setUnrelated] = useState(0);
  const [renderCounts] = useState<Record<number, number>>({});

  // Track renders per task
  tasks.forEach((t) => {
    renderCounts[t.id] = (renderCounts[t.id] ?? 0) + 1;
  });

  // useCallback ensures onToggle is the same function reference between renders.
  // The functional updater (prev => ...) means we don't need 'tasks' in deps.
  // If we wrote setTasks(tasks.map(...)) we would need [tasks] as a dep, and the
  // function would change on every tasks change, defeating the purpose.
  const handleToggle = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []); // []: stable forever because we use the functional updater

  const handleDelete = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function handleAdd() {
    if (!newTaskText.trim()) return;
    setTasks((prev) => [...prev, { id: nextId++, text: newTaskText.trim(), done: false }]);
    setNewTaskText("");
  }

  return (
    <div>
      <PageIntro
        title="useCallback"
        level="medium"
        description="When rendering lists, passing stable callbacks prevents every item from re-rendering on unrelated state changes. The key insight: use the functional updater form in setState to avoid adding state to the dependency array."
        teaches={[
          "Stable callbacks for list items: only the changed item re-renders",
          "Functional updater setTasks(prev => ...) keeps deps array empty",
          "If deps array contains state, the function changes when state changes",
          "Combining React.memo (on child) + useCallback (on parent) for optimal lists",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card
            title={`Task List (${tasks.filter((t) => !t.done).length} remaining)`}
            style={{ borderRadius: 12 }}
          >
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task..."
                onPressEnter={handleAdd}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add
              </Button>
            </Space.Compact>

            {tasks.length === 0 ? (
              <Empty description="No tasks" />
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  renderCount={renderCounts[task.id] ?? 1}
                />
              ))
            )}

            <Button
              block
              style={{ marginTop: 12 }}
              onClick={() => setUnrelated((c) => c + 1)}
            >
              Unrelated state (×{unrelated}): tasks should not re-render
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Why Empty Deps Work"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none", borderRadius: 8 }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
              <div style={{ color: "#6a9955" }}>// ❌ NEEDS [tasks] in deps:</div>
              <div style={{ color: "#ce9178" }}>{"setTasks(tasks.map(...))"}</div>
              <div style={{ color: "#6a9955" }}>{"// reads 'tasks' from closure"}</div>
              <br />
              <div style={{ color: "#6a9955" }}>// ✓ Empty deps [] safe:</div>
              <div style={{ color: "#dcdcaa" }}>{"setTasks(prev => prev.map(...))"}</div>
              <div style={{ color: "#6a9955" }}>{"// 'prev' is injected by React"}</div>
              <div style={{ color: "#6a9955" }}>{"// no closure over tasks"}</div>
              <br />
              <div style={{ color: "#569cd6" }}>Result: handleToggle never</div>
              <div style={{ color: "#569cd6" }}>changes → TaskRow never</div>
              <div style={{ color: "#569cd6" }}>re-renders unnecessarily.</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-callback" currentLevel="medium" />
    </div>
  );
}
