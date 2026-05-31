"use client";

// useEffect: Easy
// Concept: useEffect runs after the component renders.
// The empty dependency array [] means "run once after the first render", equivalent to componentDidMount.
// This is the standard pattern for fetching data when a page loads.

import { useEffect, useState } from "react";
import { Avatar, Card, Col, List, Row, Spin, Tag, Typography, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUsers } from "@/services/jsonPlaceholder";
import type { User } from "@/types/user";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

export default function UseEffectEasyPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect with empty deps []: runs exactly once after the initial render.
  // This is where you trigger side effects that only need to happen on mount.
  // The function inside useEffect cannot be async directly, so we define an
  // async function inside and call it immediately.
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        setError("Failed to load users from JSONPlaceholder");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
    // []: no dependencies. This effect will never re-run after mount.
  }, []);

  return (
    <div>
      <PageIntro
        sourcePath="app/hooks/use-effect/easy/page.tsx"
        title="useEffect"
        level="easy"
        apiUsed="JSONPlaceholder"
        description="useEffect lets you synchronize a component with something outside React, such as an API, a timer, or a subscription. This example fetches a list of users when the component first mounts."
        teaches={[
          "useEffect runs after the render is committed to the DOM",
          "Empty dependency array [] means 'run once on mount'",
          "How to handle async operations inside useEffect",
          "The loading → data/error state pattern",
        ]}
      />

      {error && (
        <Alert type="error" title={error} showIcon style={{ marginBottom: 24, borderRadius: 8 }} />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title={`Users from JSONPlaceholder (${users.length})`} style={{ borderRadius: 12 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 48 }}>
                <Spin size="large" />
                <div style={{ marginTop: 12, color: "#9ca3af" }}>Fetching from API...</div>
              </div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {users.map((user) => (
                  <List.Item key={user.id}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={user.name}
                      description={
                        <span>
                          <Text type="secondary">{user.email}</Text>
                          {" · "}
                          <Tag>{user.address.city}</Tag>
                        </span>
                      }
                    />
                  </List.Item>
                ))}
              </ul>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Effect Timeline"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2 }}>
              <div style={{ color: "#d4d4d4" }}>1. Component renders</div>
              <div style={{ color: "#d4d4d4" }}>2. DOM is updated</div>
              <div style={{ color: "#b5cea8" }}>3. useEffect fires ← here</div>
              <div style={{ color: "#dcdcaa" }}>4. fetch() called</div>
              <div style={{ color: "#dcdcaa" }}>5. setUsers() called</div>
              <div style={{ color: "#d4d4d4" }}>6. Re-render with data</div>
              <div style={{ color: "#d4d4d4", marginTop: 12 }}>
                <span style={{ color: "#569cd6" }}>deps: </span>[] = never re-runs
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: "8px 12px",
                  background: "#252526",
                  borderRadius: 6,
                }}
              >
                <div style={{ color: "#569cd6" }}>fetch status:</div>
                <div>
                  {loading ? (
                    <span style={{ color: "#ce9178" }}>● loading</span>
                  ) : error ? (
                    <span style={{ color: "#ce9178" }}>● error</span>
                  ) : (
                    <span style={{ color: "#b5cea8" }}>● {users.length} users loaded</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-effect" currentLevel="easy" />
    </div>
  );
}
