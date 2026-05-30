"use client";

// React 19: use() Advanced
// Concept: Dynamic promise creation with cache to simulate streaming data.
// In production, you'd use this with React Server Components and Next.js streaming.
// Here we show the client-side pattern: a cache map of promises keyed by ID,
// so clicking different items triggers their own Suspense boundary.
//
// Key insight: each promise is cached, so switching back to an already-loaded item
// resolves instantly (no re-fetch, no spinner). New items trigger Suspense.

import { use, Suspense, useState, useTransition } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Spin,
  Tag,
  Typography,
  Space,
} from "antd";
import { API_URLS } from "@/lib/constants";
import type { User } from "@/types/user";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Promise cache: each userId maps to one promise.
// Once created, the same promise is reused (already-resolved = instant).
const cache = new Map<number, Promise<User>>();

function fetchUser(id: number): Promise<User> {
  if (!cache.has(id)) {
    cache.set(
      id,
      fetch(`${API_URLS.jsonPlaceholder}/users/${id}`).then((r) => r.json())
    );
  }
  return cache.get(id)!;
}

// This component uses use() with a dynamic promise that changes based on userId.
// When userId changes, if the promise isn't cached yet, the component suspends.
function UserDetail({ userId }: { userId: number }) {
  const user = use(fetchUser(userId));

  return (
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
      <Descriptions.Item label="City">{user.address.city}</Descriptions.Item>
      <Descriptions.Item label="Website">{user.website}</Descriptions.Item>
    </Descriptions>
  );
}

export default function UseHookAdvancedPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadedIds, setLoadedIds] = useState<number[]>([]);

  function handleSelect(id: number) {
    // useTransition prevents the spinner from blocking the button click
    startTransition(() => {
      setSelectedId(id);
      setLoadedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    });
  }

  return (
    <div>
      <PageIntro
        title="use()"
        level="advanced"
        apiUsed="JSONPlaceholder"
        description="A promise cache combined with use() and Suspense creates a seamless data-browsing experience. Already-loaded items resolve instantly. New items trigger Suspense. useTransition keeps the navigation non-blocking."
        teaches={[
          "Promise cache: Map<id, Promise> prevents duplicate fetches",
          "Dynamic promises: use(fetchUser(id)) re-evaluates as id changes",
          "useTransition + use(): keeps UI interactive while suspending",
          "Already-resolved promises from cache: no re-suspension on revisit",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card
            title={
              <Space>
                <span>User Detail</span>
                {isPending && <Spin size="small" />}
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((id) => (
                <Button
                  key={id}
                  size="small"
                  type={selectedId === id ? "primary" : "default"}
                  onClick={() => handleSelect(id)}
                >
                  User {id}
                </Button>
              ))}
            </div>

            {/* Each time selectedId changes to an uncached ID, Suspense shows fallback */}
            <Suspense
              fallback={
                <div style={{ textAlign: "center", padding: 40 }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 12, color: "#9ca3af" }}>
                    Fetching User {selectedId}...
                  </div>
                </div>
              }
            >
              <UserDetail userId={selectedId} />
            </Suspense>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Cache State"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#7c3aed" }}>// Promise cache:</div>
              <div>
                {loadedIds.length === 0
                  ? <span style={{ color: "#6b7280" }}>No cached promises yet</span>
                  : loadedIds.map((id) => (
                    <div key={id}>
                      <span style={{ color: "#fbbf24" }}>{id}</span>
                      <span style={{ color: "#6b7280" }}> → Promise (resolved)</span>
                      {id === selectedId && <span style={{ color: "#4ade80" }}> ← viewing</span>}
                    </div>
                  ))
                }
              </div>
              <div style={{ marginTop: 12, padding: "8px 10px", background: "#161630", borderRadius: 6 }}>
                <div style={{ color: "#a5b4fc" }}>selected: <span style={{ color: "#fbbf24" }}>{selectedId}</span></div>
                <div style={{ color: "#a5b4fc" }}>cached: <span style={{ color: "#4ade80" }}>{loadedIds.length}</span></div>
                <div style={{ color: "#a5b4fc" }}>isPending: <span style={{ color: isPending ? "#f59e0b" : "#4ade80" }}>{String(isPending)}</span></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-hook" currentLevel="advanced" />
    </div>
  );
}
