"use client";

// Patterns: Render Props (Medium)
// Concept: DataFetcher with render prop to share data-fetching logic without an HOC.
// The DataFetcher handles all the async/loading/error complexity.
// The render prop function receives the data and renders whatever it wants.
// This was the primary alternative to HOCs before custom hooks existed.

import { useState, useEffect } from "react";
import { Alert, Avatar, Card, Col, List, Row, Spin, Tag, Typography, Space, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { User } from "@/types/user";
import type { Post } from "@/types/post";
import { API_URLS } from "@/lib/constants";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── Generic DataFetcher render prop component ────────────────────────────────
type DataFetcherProps<T> = {
  url: string;
  render: (props: { data: T | null; loading: boolean; error: string | null }) => React.ReactNode;
};

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  // Call the render function with internal state: consumer controls the UI
  return <>{render({ data, loading, error })}</>;
}

export default function RenderPropsMediumPage() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <PageIntro
        title="Render Props"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="DataFetcher manages all async/loading/error logic. The render prop function receives the fetched data and renders it however it wants. Two different UIs consume the same fetcher logic."
        teaches={[
          "Generic render prop component: DataFetcher<T>({ url, render })",
          "render receives { data, loading, error }: consumer does UI, fetcher does logic",
          "Same fetcher, different UIs: user list vs post list from one component",
          "Render props vs custom hooks: hooks are preferred now, but render props compose with JSX",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* First consumer: renders users as a list */}
        <Col xs={24} md={12}>
          <Card title="DataFetcher → User cards" style={{ borderRadius: 12 }}>
            <DataFetcher<User[]>
              url={`${API_URLS.jsonPlaceholder}/users`}
              render={({ data, loading, error }) => {
                if (loading)
                  return (
                    <div style={{ textAlign: "center", padding: 32 }}>
                      <Spin />
                    </div>
                  );
                if (error) return <Alert type="error" title={error} showIcon />;
                return (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {(data?.slice(0, 4) ?? []).map((user) => (
                      <List.Item key={user.id}>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={user.name}
                          description={user.email}
                        />
                      </List.Item>
                    ))}
                  </ul>
                );
              }}
            />
          </Card>
        </Col>

        {/* Second consumer: renders posts for a selected user */}
        <Col xs={24} md={12}>
          <Card
            title="DataFetcher → User posts"
            extra={
              <Select
                value={userId}
                onChange={setUserId}
                size="small"
                style={{ width: 100 }}
                options={Array.from({ length: 5 }, (_, i) => ({
                  value: i + 1,
                  label: `User ${i + 1}`,
                }))}
              />
            }
            style={{ borderRadius: 12 }}
          >
            <DataFetcher<Post[]>
              url={`${API_URLS.jsonPlaceholder}/users/${userId}/posts`}
              render={({ data, loading, error }) => {
                if (loading)
                  return (
                    <div style={{ textAlign: "center", padding: 32 }}>
                      <Spin />
                    </div>
                  );
                if (error) return <Alert type="error" title={error} showIcon />;
                return (
                  <div>
                    {data?.slice(0, 4).map((post) => (
                      <div
                        key={post.id}
                        style={{ padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}
                      >
                        <Text strong style={{ fontSize: 12 }} ellipsis>
                          {post.title}
                        </Text>
                      </div>
                    ))}
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {data?.length} posts for User {userId}
                    </Text>
                  </div>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/render-props" currentLevel="medium" />
    </div>
  );
}
