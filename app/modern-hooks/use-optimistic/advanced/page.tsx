"use client";

// useOptimistic: Advanced
// Concept: Intentional rollback on failure.
// This demo lets you force a failure (30% chance) to watch the rollback happen.
// It shows the "pending → success/fail" visual transition clearly.
// This is the pattern you need for any mission-critical optimistic UI.

import { useOptimistic, useState, useTransition } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  Switch,
  List,
} from "antd";
import { HeartFilled, HeartOutlined, ReloadOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type Comment = {
  id: number;
  author: string;
  body: string;
  likes: number;
  liked: boolean;
  status: "idle" | "pending" | "failed";
};

// Simulates a flaky API
async function likeApi(id: number, forceFail: boolean): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
  if (forceFail || Math.random() < 0.3) {
    throw new Error("API failure: simulated");
  }
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    author: "Alice",
    body: "Great article on React hooks!",
    likes: 12,
    liked: false,
    status: "idle",
  },
  {
    id: 2,
    author: "Bob",
    body: "The useTransition examples are really clear.",
    likes: 8,
    liked: false,
    status: "idle",
  },
  {
    id: 3,
    author: "Carol",
    body: "I finally understand useMemo after this.",
    likes: 31,
    liked: true,
    status: "idle",
  },
  {
    id: 4,
    author: "Dave",
    body: "Would love more advanced examples!",
    likes: 5,
    liked: false,
    status: "idle",
  },
];

export default function UseOptimisticAdvancedPage() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [forceFail, setForceFail] = useState(false);
  const [failures, setFailures] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticComments, applyOptimistic] = useOptimistic(
    comments,
    (state: Comment[], update: { id: number; action: "like" | "revert" | "pending" }) => {
      return state.map((c) => {
        if (c.id !== update.id) return c;
        switch (update.action) {
          case "pending":
            return {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
              status: "pending" as const,
            };
          case "revert":
            return {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
              status: "failed" as const,
            };
          default:
            return c;
        }
      });
    }
  );

  async function handleLike(id: number) {
    setLastError(null);
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    startTransition(async () => {
      // Show optimistic "pending" state immediately
      applyOptimistic({ id, action: "pending" });

      try {
        await likeApi(id, forceFail);

        // Confirm the real state change
        setSuccesses((s) => s + 1);
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  liked: !c.liked,
                  likes: c.liked ? c.likes - 1 : c.likes + 1,
                  status: "idle",
                }
              : c
          )
        );
      } catch (err) {
        // Trigger rollback: revert the optimistic update
        setFailures((f) => f + 1);
        setLastError("Like failed. Rolled back to previous state.");

        // Mark the comment as failed (will show in UI briefly)
        setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: "failed" } : c)));

        // Reset status after showing failure
        setTimeout(() => {
          setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: "idle" } : c)));
        }, 2000);
      }
    });
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/modern-hooks/use-optimistic/advanced/page.tsx"
        title="useOptimistic"
        level="advanced"
        description="Handling rollback explicitly. When the API fails, the optimistic state reverts to the real state automatically. This demo lets you force failures to observe the rollback behavior, which is essential for production-grade optimistic UIs."
        teaches={[
          "Rollback is automatic: real state wins when the transition ends",
          "Showing 'pending' vs 'failed' status in the optimistic state",
          "The optimistic update function can model multiple visual states",
          "setTimeout to clear failure state after showing feedback",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Comments (with Rollback)"
            extra={
              <Space>
                <Text style={{ fontSize: 12 }}>Force fail:</Text>
                <Switch
                  checked={forceFail}
                  onChange={setForceFail}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            {lastError && (
              <Alert
                type="error"
                showIcon
                title={lastError}
                style={{ marginBottom: 12, borderRadius: 8 }}
                closable
                onClose={() => setLastError(null)}
              />
            )}

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {optimisticComments.map((comment) => (
                <List.Item
                  key={comment.id}
                  actions={[
                    <Button
                      key="like"
                      size="small"
                      type={comment.liked ? "primary" : "default"}
                      danger={comment.status === "failed"}
                      icon={comment.liked ? <HeartFilled /> : <HeartOutlined />}
                      loading={comment.status === "pending"}
                      onClick={() => comment.status === "idle" && handleLike(comment.id)}
                    >
                      {comment.likes}
                    </Button>,
                    comment.status === "failed" ? (
                      <Tag key="status" color="error">
                        Rolled back
                      </Tag>
                    ) : comment.status === "pending" ? (
                      <Tag key="status" color="warning">
                        Saving...
                      </Tag>
                    ) : null,
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={<Avatar>{comment.author[0]}</Avatar>}
                    title={comment.author}
                    description={comment.body}
                  />
                </List.Item>
              ))}
            </ul>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Rollback Stats"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <Row gutter={[0, 16]}>
              <Col span={12}>
                <Statistic
                  title={<span style={{ color: "#6a9955", fontSize: 11 }}>successes</span>}
                  value={successes}
                  styles={{ content: { color: "#b5cea8" } }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<span style={{ color: "#6a9955", fontSize: 11 }}>rollbacks</span>}
                  value={failures}
                  styles={{ content: { color: "#ce9178" } }}
                />
              </Col>
            </Row>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
                marginTop: 12,
              }}
            >
              <div>
                <span style={{ color: "#569cd6" }}>forceFail: </span>
                <span style={{ color: forceFail ? "#ce9178" : "#b5cea8" }}>
                  {String(forceFail)}
                </span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#dcdcaa" : "#b5cea8" }}>
                  {String(isPending)}
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                <div style={{ color: "#569cd6" }}>When fail mode ON:</div>
                <div style={{ color: "#6a9955" }}>Every like call throws</div>
                <div style={{ color: "#6a9955" }}>Optimistic state reverts</div>
                <div style={{ color: "#6a9955" }}>Real state unchanged ✓</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-optimistic" currentLevel="advanced" />
    </div>
  );
}
