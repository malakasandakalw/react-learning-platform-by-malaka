"use client";

// useMemo: Advanced
// Concept: Using useMemo to stabilize object/array references passed as props.
// React's re-render model: if a parent re-renders, ALL children re-render by default.
// React.memo() makes a component skip re-renders when its props haven't changed.
// BUT: if you pass a new object/array literal as a prop every render (e.g. { ids: [1,2,3] }),
// React.memo sees a different reference even if the values are identical and re-renders anyway.
// useMemo gives you a STABLE reference that only changes when the content actually changes.

import { memo, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  Typography,
  Space,
  Divider,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

type Stats = { total: number; average: number; max: number; min: number };
type RenderLog = { id: number; reason: string; time: string };

// A memoized child that shows render counts.
// React.memo: only re-renders if its props change by reference.
const StatsPanel = memo(function StatsPanel({
  stats,
  title,
  renderCount,
}: {
  stats: Stats;
  title: string;
  renderCount: number;
}) {
  return (
    <div
      style={{
        background: "#f8f9fc",
        borderRadius: 8,
        padding: 16,
        border: "2px solid",
        borderColor: renderCount > 1 ? "#fbbf24" : "#a7f3d0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <Text strong>{title}</Text>
        <Badge
          count={renderCount}
          style={{ background: renderCount > 3 ? "#ef4444" : renderCount > 1 ? "#f59e0b" : "#16a34a" }}
          title={`Rendered ${renderCount} times`}
        />
      </div>
      <Row gutter={8}>
        <Col span={12}><Statistic title="Total" value={stats.total} valueStyle={{ fontSize: 20 }} /></Col>
        <Col span={12}><Statistic title="Average" value={stats.average} precision={1} valueStyle={{ fontSize: 20 }} /></Col>
        <Col span={12}><Statistic title="Max" value={stats.max} valueStyle={{ fontSize: 20 }} /></Col>
        <Col span={12}><Statistic title="Min" value={stats.min} valueStyle={{ fontSize: 20 }} /></Col>
      </Row>
    </div>
  );
});

export default function UseMemoAdvancedPage() {
  const [scores] = useState([88, 76, 95, 62, 100, 71, 84, 90, 58, 79]);
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  // Render counters tracked via a ref pattern, stored outside component to persist
  const renderCounts = useMemo(() => ({ memoized: 0, unmemoized: 0 }), []);

  // ❌ BAD: This creates a new object on every render.
  // Even though the values are identical, React.memo sees a new reference → re-renders.
  const unmemoizedStats: Stats = {
    total: scores.reduce((a, b) => a + b, 0),
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
    max: Math.max(...scores),
    min: Math.min(...scores),
  };
  renderCounts.unmemoized += 1;

  // ✓ GOOD: useMemo returns the SAME object reference until scores changes.
  // React.memo on StatsPanel will see the same reference → skips re-render.
  const memoizedStats = useMemo((): Stats => ({
    total: scores.reduce((a, b) => a + b, 0),
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
    max: Math.max(...scores),
    min: Math.min(...scores),
  }), [scores]); // [scores]: only recompute if the scores array changes
  renderCounts.memoized += 1;

  return (
    <div>
      <PageIntro
        title="useMemo"
        level="advanced"
        description="The most subtle use of useMemo: stabilizing object references. When you pass an object/array literal as a prop, it is a NEW reference every render. React.memo cannot skip re-renders unless the reference is stable, which is what useMemo provides."
        teaches={[
          "Object literals {} are new references on every render",
          "React.memo only works when prop references are stable",
          "useMemo gives stable references, which is the key to preventing wasted renders",
          "When useMemo is essential: expensive child components receiving object props",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Without useMemo" style={{ borderRadius: 12, borderColor: "#fbbf24" }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
              stats prop is a new object on every render → React.memo can&apos;t help
            </Text>
            <StatsPanel
              stats={unmemoizedStats}
              title="Unmemoized"
              renderCount={renderCounts.unmemoized}
            />
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <CloseCircleOutlined style={{ color: "#ef4444" }} />
              <Text style={{ fontSize: 12 }}>Re-renders on every parent render</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="With useMemo" style={{ borderRadius: 12, borderColor: "#a7f3d0" }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
              memoizedStats is the same reference until scores changes → memo works
            </Text>
            <StatsPanel
              stats={memoizedStats}
              title="Memoized"
              renderCount={renderCounts.memoized}
            />
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircleOutlined style={{ color: "#16a34a" }} />
              <Text style={{ fontSize: 12 }}>Skips re-render when scores unchanged</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24, borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Text>
            Click to trigger a parent re-render without changing scores:
          </Text>
          <Button onClick={() => setUnrelatedCount((c) => c + 1)}>
            Unrelated click #{unrelatedCount}
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Watch the badge counts. The memoized panel stays at the same count.
          </Text>
        </div>
      </Card>

      <LevelNavigator basePath="/hooks/use-memo" currentLevel="advanced" />
    </div>
  );
}
