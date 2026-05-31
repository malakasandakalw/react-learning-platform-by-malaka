"use client";

// useOptimistic: Easy
// Concept: Show the expected result of an action IMMEDIATELY, before the server confirms.
// When a user clicks "like", we instantly show the liked state, then the API call runs.
// If the API succeeds, the real state matches. If it fails, we rollback.
// This makes the UI feel instant even with slow network connections.

import { useOptimistic, useState, useTransition } from "react";
import {
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  Avatar,
} from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type Post = { id: number; title: string; likes: number; liked: boolean };

// Simulates a slow API call (1 second delay)
async function toggleLikeApi(postId: number, liked: boolean): Promise<void> {
  await new Promise((r) => setTimeout(r, 1000));
  // Uncomment to simulate a failure:
  // if (Math.random() < 0.3) throw new Error("Server error");
}

export default function UseOptimisticEasyPage() {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: "Building with React hooks", likes: 24, liked: false },
    { id: 2, title: "The power of TypeScript", likes: 18, liked: false },
    { id: 3, title: "Next.js App Router deep dive", likes: 41, liked: true },
    { id: 4, title: "Redux Toolkit best practices", likes: 15, liked: false },
  ]);

  // useOptimistic(realState, updateFn)
  // - optimisticPosts is a version of posts with pending optimistic updates applied
  // - addOptimisticLike is the function to trigger an optimistic update
  // - When the transition completes, React reconciles back to the real posts state
  const [optimisticPosts, addOptimisticLike] = useOptimistic(
    posts,
    (currentPosts: Post[], postId: number) =>
      currentPosts.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
  );

  const [isPending, startTransition] = useTransition();

  async function handleLike(postId: number) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    startTransition(async () => {
      // 1. Apply optimistic update IMMEDIATELY so the user sees the result right away
      addOptimisticLike(postId);

      try {
        // 2. Call the real API in the background
        await toggleLikeApi(postId, !post.liked);

        // 3. API succeeded: update the real state to match
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
              : p
          )
        );
      } catch {
        // 4. API failed: optimistic state automatically rolls back to real posts
        // because useOptimistic is tied to the posts state
      }
    });
  }

  return (
    <div>
      <PageIntro
        title="useOptimistic"
        level="easy"
        description="useOptimistic lets you show an expected result immediately, before the server confirms. The UI feels instant. If the server fails, the state rolls back automatically."
        teaches={[
          "useOptimistic(realState, updateFn): apply temporary optimistic updates",
          "The optimistic state is shown immediately; the real state catches up after",
          "If the async operation fails, React rolls back to the real state",
          "Must be wrapped in a transition (startTransition or async action)",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Posts Feed" style={{ borderRadius: 12 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {optimisticPosts.map((post) => (
                <List.Item
                  key={post.id}
                  actions={[
                    <Button
                      key="like"
                      type={post.liked ? "primary" : "default"}
                      icon={post.liked ? <HeartFilled /> : <HeartOutlined />}
                      onClick={() => handleLike(post.id)}
                      size="small"
                    >
                      {post.likes}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar>{post.id}</Avatar>}
                    title={post.title}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>Post #{post.id}</Text>}
                  />
                </List.Item>
              ))}
            </ul>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Optimistic Flow"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
              <div style={{ color: "#b5cea8" }}>1. User clicks like</div>
              <div style={{ color: "#b5cea8" }}>2. addOptimisticLike(id)</div>
              <div style={{ color: "#b5cea8" }}>   → UI updates instantly ✓</div>
              <div style={{ color: "#dcdcaa" }}>3. API call runs (1s)</div>
              <div style={{ color: "#b5cea8" }}>4a. Success → setPosts()</div>
              <div style={{ color: "#ce9178" }}>4b. Failure → rollback</div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#2d2d2d", borderRadius: 6 }}>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#dcdcaa" : "#b5cea8" }}>{String(isPending)}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-optimistic" currentLevel="easy" />
    </div>
  );
}
