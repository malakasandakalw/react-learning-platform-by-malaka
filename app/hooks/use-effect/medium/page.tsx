"use client";

// useEffect: Medium
// Concept: The dependency array controls WHEN the effect re-runs.
// When a dep changes, React runs the cleanup function first (if any),
// then runs the effect again. This example shows debounced search:
// a pattern where you delay the API call until the user stops typing.
// The cleanup function cancels the previous timeout, preventing stale calls.

import { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Empty,
  Input,
  List,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { getUsers } from "@/services/jsonPlaceholder";
import type { User } from "@/types/user";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

export default function UseEffectMediumPage() {
  const [query, setQuery] = useState("");

  // debouncedQuery is the value we actually use for filtering.
  // It only updates 400ms after the user stops typing.
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Effect 1: runs once on mount to load all users.
  useEffect(() => {
    getUsers().then((data) => {
      setAllUsers(data);
      setLoading(false);
    });
  }, []);

  // Effect 2: runs every time 'query' changes.
  // It sets a 400ms timeout. If 'query' changes before the 400ms expires,
  // the cleanup function runs (clearTimeout) and cancels the pending update.
  // This means setDebouncedQuery only runs when the user pauses typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    // Cleanup function: React calls this before re-running the effect
    // and when the component unmounts.
    return () => clearTimeout(timer);

    // [query]: re-run this effect whenever 'query' changes
  }, [query]);

  // Filter is instant (no API call needed): we already have all users.
  // debouncedQuery ensures we don't filter on every keystroke.
  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div>
      <PageIntro
        title="useEffect"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="The dependency array is the most important part of useEffect. It tells React when to re-run the effect. The cleanup function lets you cancel previous operations before the next run."
        teaches={[
          "Dependency array: effect re-runs when any dep changes",
          "Cleanup function: runs before the next effect and on unmount",
          "Debouncing with setTimeout + clearTimeout in cleanup",
          "Multiple effects in one component, each with its own purpose",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="large"
              style={{ marginBottom: 20 }}
              allowClear
            />

            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : filtered.length === 0 ? (
              <Empty description="No users match your search" />
            ) : (
              <List
                dataSource={filtered}
                renderItem={(user) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: "#4f46e5" }} icon={<UserOutlined />} />}
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
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Debounce Inspector"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, lineHeight: 2.2 }}>
              <div>
                <span style={{ color: "#7c3aed" }}>query: </span>
                <span style={{ color: "#fbbf24" }}>&quot;{query}&quot;</span>
              </div>
              <div>
                <span style={{ color: "#7c3aed" }}>debouncedQuery: </span>
                <span style={{ color: "#4ade80" }}>&quot;{debouncedQuery}&quot;</span>
              </div>
              <div style={{ marginTop: 8, color: "#6b7280" }}>
                {query !== debouncedQuery
                  ? "⏳ waiting 400ms..."
                  : "✓ in sync"}
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#161630", borderRadius: 6 }}>
                <div style={{ color: "#a5b4fc", marginBottom: 4 }}>results:</div>
                <span style={{ color: "#e2e8f0" }}>{filtered.length} / {allUsers.length} users</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-effect" currentLevel="medium" />
    </div>
  );
}
