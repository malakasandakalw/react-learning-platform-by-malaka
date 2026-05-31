"use client";

// useDeferredValue: Easy
// Concept: useDeferredValue is the "receiver side" of useTransition.
// Instead of wrapping the setter, you wrap the VALUE.
// The deferred value lags behind the real value. React renders with the old
// value first (fast) and then re-renders with the new value when it has time.
// The input stays instant; the slow part renders asynchronously.

import { useDeferredValue, useState } from "react";
import { Card, Col, Input, Row, Typography, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Intentionally slow list: generates many items just to simulate a heavy render
function SlowList({ query }: { query: string }) {
  const items = Array.from({ length: 5000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    matches: query && `Item ${i + 1}`.toLowerCase().includes(query.toLowerCase()),
  }));

  const visible = items.filter((i) => !query || i.matches);

  return (
    <div style={{ height: 300, overflowY: "auto" }}>
      {visible.slice(0, 30).map((item) => (
        <div
          key={item.id}
          style={{
            padding: "6px 10px",
            fontSize: 12,
            background: item.matches ? "#e6f4ff" : undefined,
            borderRadius: 4,
            marginBottom: 2,
          }}
        >
          {item.name}
        </div>
      ))}
      {visible.length > 30 && (
        <Text type="secondary" style={{ fontSize: 11, padding: "4px 10px", display: "block" }}>
          ...and {visible.length - 30} more
        </Text>
      )}
      {visible.length === 0 && (
        <Text type="secondary" style={{ padding: 16, display: "block" }}>
          No matches
        </Text>
      )}
    </div>
  );
}

export default function UseDeferredValueEasyPage() {
  const [query, setQuery] = useState("");

  // useDeferredValue accepts the current value and returns a deferred copy.
  // During the first render with a new query, deferredQuery still has the OLD value.
  // React re-renders with the new value in the background.
  const deferredQuery = useDeferredValue(query);

  // True when the deferred value hasn't caught up to the real value yet
  const isStale = query !== deferredQuery;

  return (
    <div>
      <PageIntro
        title="useDeferredValue"
        level="easy"
        description="useDeferredValue wraps a value, not a setter. It returns a version of the value that lags behind the real one. React renders the stale version first (fast), then updates in the background when idle."
        teaches={[
          "useDeferredValue(value) returns a deferred copy of that value",
          "Comparing query !== deferredQuery tells you if the value is stale",
          "Difference from useTransition: deferred wraps the value, transition wraps the setter",
          "Use case: when you receive a value (from props) rather than setting it yourself",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12 }}>
            <Input
              prefix={<SearchOutlined />}
              suffix={isStale ? <Spin size="small" /> : null}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter items..."
              size="large"
              style={{ marginBottom: 16 }}
            />

            {/* SlowList receives deferredQuery, the lagging value */}
            {/* It will render with the old value while the new one is pending */}
            <div style={{ opacity: isStale ? 0.7 : 1, transition: "opacity 0.2s" }}>
              <SlowList query={deferredQuery} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Value Comparison"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2.2 }}>
              <div style={{ color: "#6a9955" }}>// Real value (instant):</div>
              <div>
                <span style={{ color: "#569cd6" }}>query: </span>
                <span style={{ color: "#ce9178" }}>&quot;{query}&quot;</span>
              </div>
              <div style={{ color: "#6a9955", marginTop: 6 }}>// Deferred value (lags):</div>
              <div>
                <span style={{ color: "#569cd6" }}>deferredQuery: </span>
                <span style={{ color: "#b5cea8" }}>&quot;{deferredQuery}&quot;</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={{ color: "#569cd6" }}>isStale: </span>
                <span style={{ color: isStale ? "#dcdcaa" : "#b5cea8" }}>{String(isStale)}</span>
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                  fontSize: 11,
                }}
              >
                <div style={{ color: "#569cd6" }}>vs useTransition:</div>
                <div style={{ color: "#6a9955" }}>useTransition wraps the setter</div>
                <div style={{ color: "#6a9955" }}>useDeferredValue wraps the value</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-deferred-value" currentLevel="easy" />
    </div>
  );
}
