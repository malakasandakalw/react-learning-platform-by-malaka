"use client";

// useTransition: Advanced
// Concept: Multiple concurrent transitions and transition priority.
// When you have several expensive operations, each can be wrapped in its own
// startTransition. React can batch and prioritize them.
// This example shows a data dashboard where filter, sort, and grouping
// each trigger expensive re-renders, all wrapped as transitions.
// The user can keep changing controls without waiting for each one to finish.

import { useState, useTransition, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
  Space,
  Statistic,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { getPosts } from "@/services/jsonPlaceholder";
import type { Post } from "@/types/post";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type SortField = "id" | "userId" | "title";
type SortOrder = "asc" | "desc";

export default function UseTransitionAdvancedPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<number | "all">("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [processedData, setProcessedData] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();
  const [transitionCount, setTransitionCount] = useState(0);

  useEffect(() => {
    getPosts().then((data) => {
      setAllPosts(data);
      setProcessedData(data);
    });
  }, []);

  // Each control change wraps in a transition so the controls respond instantly
  function handleUserFilter(val: number | "all") {
    setUserId(val);
    startTransition(() => {
      setTransitionCount((c) => c + 1);
      const filtered = val === "all" ? allPosts : allPosts.filter((p) => p.userId === val);
      setProcessedData(sortPosts(filtered, sortField, sortOrder));
    });
  }

  function handleSortField(field: SortField) {
    setSortField(field);
    startTransition(() => {
      setTransitionCount((c) => c + 1);
      const filtered = userId === "all" ? allPosts : allPosts.filter((p) => p.userId === userId);
      setProcessedData(sortPosts(filtered, field, sortOrder));
    });
  }

  function handleSortOrder(order: SortOrder) {
    setSortOrder(order);
    startTransition(() => {
      setTransitionCount((c) => c + 1);
      const filtered = userId === "all" ? allPosts : allPosts.filter((p) => p.userId === userId);
      setProcessedData(sortPosts(filtered, sortField, order));
    });
  }

  const columns: ColumnsType<Post> = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "User", dataIndex: "userId", width: 70, render: (v) => <Tag color="blue">#{v}</Tag> },
    { title: "Title", dataIndex: "title", ellipsis: true },
  ];

  return (
    <div>
      <PageIntro
        title="useTransition"
        level="advanced"
        apiUsed="JSONPlaceholder"
        description="Multiple transitions running concurrently. Each control (filter, sort field, sort order) triggers its own transition. React batches and prioritizes them, keeping the controls instantly responsive regardless of how fast you click."
        teaches={[
          "Multiple startTransition calls can be active simultaneously",
          "React interrupts lower-priority transitions for urgent updates",
          "Controls stay responsive even when previous transitions are still running",
          "transitionCount shows how many times the expensive update ran",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={17}>
          <Card
            title="Posts Dashboard"
            extra={
              isPending ? (
                <>
                  <Spin size="small" />{" "}
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>
                    Updating...
                  </Text>
                </>
              ) : null
            }
            style={{ borderRadius: 12 }}
          >
            <Space style={{ marginBottom: 16 }} wrap>
              <Select
                value={userId}
                onChange={handleUserFilter}
                style={{ width: 130 }}
                options={[
                  { value: "all", label: "All Users" },
                  ...Array.from({ length: 10 }, (_, i) => ({
                    value: i + 1,
                    label: `User ${i + 1}`,
                  })),
                ]}
              />
              <Select
                value={sortField}
                onChange={handleSortField}
                style={{ width: 120 }}
                options={[
                  { value: "id", label: "Sort by ID" },
                  { value: "userId", label: "Sort by User" },
                  { value: "title", label: "Sort by Title" },
                ]}
              />
              <Select
                value={sortOrder}
                onChange={handleSortOrder}
                style={{ width: 110 }}
                options={[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ]}
              />
            </Space>

            <Table
              dataSource={processedData}
              columns={columns}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              loading={isPending}
            />
          </Card>
        </Col>

        <Col xs={24} lg={7}>
          <Card
            title="Transition Stats"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <Statistic
              title={<span style={{ color: "#6a9955", fontSize: 11 }}>transitions fired</span>}
              value={transitionCount}
              styles={{ content: { color: "#b5cea8" } }}
            />
            <div
              style={{
                marginTop: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div>
                <span style={{ color: "#569cd6" }}>userId: </span>
                <span style={{ color: "#ce9178" }}>{String(userId)}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>sort: </span>
                <span style={{ color: "#d4d4d4" }}>
                  {sortField} {sortOrder}
                </span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>showing: </span>
                <span style={{ color: "#b5cea8" }}>{processedData.length} posts</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#dcdcaa" : "#b5cea8" }}>
                  {String(isPending)}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-transition" currentLevel="advanced" />
    </div>
  );
}

function sortPosts(posts: Post[], field: SortField, order: SortOrder): Post[] {
  return [...posts].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    const cmp =
      typeof aVal === "string"
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number);
    return order === "asc" ? cmp : -cmp;
  });
}
