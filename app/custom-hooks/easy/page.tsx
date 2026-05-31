/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// Custom Hooks: Easy
// Concept: useFetch, the first custom hook every team builds.
// A custom hook is just a function that calls other hooks.
// Rules: it must start with "use", and it can call useState/useEffect/etc.
// By extracting the fetch pattern into useFetch, any component can fetch data
// with a single line, without re-implementing loading/error state each time.

import { useState, useEffect } from "react";
import { Alert, Avatar, Card, Col, Input, List, Row, Select, Spin, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { User } from "@/types/user";
import type { Post } from "@/types/post";
import { API_URLS } from "@/lib/constants";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── THE CUSTOM HOOK ──────────────────────────────────────────────────────────
// useFetch<T> is a generic hook that works for ANY endpoint.
// It encapsulates the loading/data/error pattern in one reusable place.
// Every component that needs data calls useFetch, with no copy-pasting of useEffect.
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset when URL changes
    setData(null);
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    // Cleanup: cancel in-flight request when url changes or component unmounts
    return () => controller.abort();
  }, [url]); // Re-fetch whenever the URL changes

  return { data, loading, error };
}
// ─────────────────────────────────────────────────────────────────────────────

type EndpointKey = "users" | "posts";

const ENDPOINTS: Record<EndpointKey, string> = {
  users: `${API_URLS.jsonPlaceholder}/users`,
  posts: `${API_URLS.jsonPlaceholder}/posts`,
};

export default function CustomHooksEasyPage() {
  const [endpoint, setEndpoint] = useState<EndpointKey>("users");

  // ONE LINE to fetch data: all the loading/error logic is inside useFetch
  const { data, loading, error } = useFetch<User[] | Post[]>(ENDPOINTS[endpoint]);

  return (
    <div>
      <PageIntro
        title="Custom Hooks"
        level="easy"
        apiUsed="JSONPlaceholder"
        description="A custom hook is a function starting with 'use' that calls other hooks. useFetch encapsulates the fetch + loading + error pattern once, so every component can use it in a single line."
        teaches={[
          "Custom hook = function that calls other hooks, starts with 'use'",
          "Generic hooks with TypeScript: useFetch<T>(url: string)",
          "Cleanup inside custom hooks: the hook owns its own cleanup",
          "One hook, many consumers: this is the key value of extraction",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card
            title="useFetch demo"
            extra={
              <Select
                value={endpoint}
                onChange={(v) => setEndpoint(v as EndpointKey)}
                options={[
                  { value: "users", label: "Users endpoint" },
                  { value: "posts", label: "Posts endpoint" },
                ]}
                size="small"
                style={{ width: 160 }}
              />
            }
            style={{ borderRadius: 12 }}
          >
            {error && (
              <Alert
                type="error"
                title={error}
                showIcon
                style={{ marginBottom: 12, borderRadius: 8 }}
              />
            )}
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {((data as any[])?.slice(0, 8) ?? []).map((item: any, i: number) => (
                  <List.Item key={item.id ?? i}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.name ?? item.title}
                      description={item.email ?? item.body?.slice(0, 60) + "..."}
                    />
                  </List.Item>
                ))}
              </ul>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="useFetch source"
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
                lineHeight: 1.9,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#dcdcaa" }}>
                function useFetch{"<T>"}(url) {"{"}
              </div>
              <div style={{ paddingLeft: 12, color: "#d4d4d4" }}>const [data, setData]</div>
              <div style={{ paddingLeft: 20, color: "#ce9178" }}>
                = useState{"<T | null>"} (null);
              </div>
              <div style={{ paddingLeft: 12, color: "#d4d4d4" }}>const [loading, setLoading]</div>
              <div style={{ paddingLeft: 20, color: "#ce9178" }}>= useState(true);</div>
              <div style={{ paddingLeft: 12, color: "#d4d4d4" }}>const [error, setError]</div>
              <div style={{ paddingLeft: 20, color: "#ce9178" }}>= useState(null);</div>
              <br />
              <div style={{ paddingLeft: 12, color: "#dcdcaa" }}>
                useEffect(() ={">"} {"{"}
              </div>
              <div style={{ paddingLeft: 24, color: "#dcdcaa" }}>fetch(url).then(setData)</div>
              <div style={{ paddingLeft: 12, color: "#dcdcaa" }}>{" }, [url]);"}</div>
              <br />
              <div style={{ paddingLeft: 12, color: "#d4d4d4" }}>
                return {"{ data, loading, error }"};
              </div>
              <div style={{ color: "#dcdcaa" }}>{"}"}</div>
              <br />
              <div style={{ color: "#6a9955" }}>// Usage: ONE line:</div>
              <div style={{ color: "#d4d4d4" }}>const {"{ data }"} = useFetch(url);</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/custom-hooks" currentLevel="easy" />
    </div>
  );
}
