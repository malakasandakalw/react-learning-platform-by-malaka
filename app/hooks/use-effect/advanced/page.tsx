/* eslint-disable react-hooks/refs */
"use client";

// useEffect: Advanced
// Concept: Polling, fetching data on a fixed interval to simulate a live feed.
// The effect sets up a setInterval on mount and MUST clear it on unmount.
// If you forget the cleanup, the interval keeps running even after the component
// unmounts, firing setPost on an unmounted component, which causes a memory leak.
//
// This also shows: effect depends on a user-controlled value (interval speed),
// so when the user changes the speed, the old interval is cleaned up and a new one starts.

import { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Statistic,
  Tag,
  Typography,
  Badge,
  Divider,
  Space,
} from "antd";
import { SyncOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { getPost } from "@/services/jsonPlaceholder";
import type { Post } from "@/types/post";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Paragraph } = Typography;

const SPEEDS = [
  { label: "Slow (5s)", value: 5000 },
  { label: "Normal (3s)", value: 3000 },
  { label: "Fast (1.5s)", value: 1500 },
];

export default function UseEffectAdvancedPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [postId, setPostId] = useState(1);
  const [intervalMs, setIntervalMs] = useState(3000);
  const [running, setRunning] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // useRef to track how many intervals have been set up (for the inspector panel).
  // useRef does NOT cause re-renders when changed, making it perfect for diagnostics.
  const intervalRef = useRef(0);

  // This effect re-runs when intervalMs or running changes.
  // Each time it re-runs:
  //   1. The cleanup function clears the previous interval
  //   2. A new interval is set with the updated speed
  // When the component unmounts, the cleanup runs one final time.
  useEffect(() => {
    if (!running) return; // no interval if paused

    intervalRef.current += 1;

    const id = setInterval(async () => {
      const nextId = (postId % 100) + 1; // cycle through posts 1-100
      setLoading(true);
      const data = await getPost(nextId);
      setPost(data);
      setPostId(nextId);
      setFetchCount((c) => c + 1);
      setLoading(false);
    }, intervalMs);

    // CRITICAL: cleanup clears the interval before the next run or on unmount.
    // Without this, old intervals stack up and fire simultaneously.
    return () => clearInterval(id);

    // [intervalMs, running, postId]: re-run when any of these change
  }, [intervalMs, running, postId]);

  return (
    <div>
      <PageIntro
        title="useEffect"
        level="advanced"
        apiUsed="JSONPlaceholder"
        description="Polling with setInterval demonstrates why cleanup is critical. Without cleanup, unmounted components continue running intervals, which is a classic memory leak. Cleanup also lets you safely restart effects when dependencies change."
        teaches={[
          "Why cleanup functions are mandatory for intervals and subscriptions",
          "How changing a dependency cleanly swaps out the old effect",
          "The 'return () => cleanup()' pattern for resource disposal",
          "Combining useEffect with useRef for non-reactive side data",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Badge status={running ? "processing" : "default"} />
                <span>Live Post Feed</span>
                {loading && <SyncOutlined spin />}
              </div>
            }
            extra={
              <Space>
                <Select
                  value={intervalMs}
                  onChange={setIntervalMs}
                  options={SPEEDS}
                  style={{ width: 130 }}
                  size="small"
                />
                <Button
                  size="small"
                  type={running ? "default" : "primary"}
                  icon={running ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={() => setRunning((r) => !r)}
                >
                  {running ? "Pause" : "Resume"}
                </Button>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            {post ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Tag color="blue">Post #{post.id}</Tag>
                  <Tag color="default">User #{post.userId}</Tag>
                </div>
                <Text strong style={{ fontSize: 15 }}>
                  {post.title}
                </Text>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  {post.body}
                </Paragraph>
              </div>
            ) : (
              <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
                Starting feed...
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Effect Inspector"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <Row gutter={[0, 0]}>
              <Col span={12}>
                <Statistic
                  title={<span style={{ color: "#6a9955", fontSize: 11 }}>fetches</span>}
                  value={fetchCount}
                  styles={{ content: { color: "#d4d4d4", fontSize: 28 } }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<span style={{ color: "#6a9955", fontSize: 11 }}>intervals created</span>}
                  value={intervalRef.current}
                  styles={{ content: { color: "#d4d4d4", fontSize: 28 } }}
                />
              </Col>
            </Row>
            <Divider style={{ borderColor: "#333", margin: "12px 0" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2 }}>
              <div>
                <span style={{ color: "#569cd6" }}>status: </span>
                <span style={{ color: "#d4d4d4" }}>
                  {running ? "● running" : "● paused"}
                </span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>interval: </span>
                <span style={{ color: "#b5cea8" }}>{intervalMs}ms</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>current post: </span>
                <span style={{ color: "#d4d4d4" }}>#{postId}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-effect" currentLevel="advanced" />
    </div>
  );
}
