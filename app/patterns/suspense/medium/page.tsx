"use client";

// Patterns: Suspense + React.lazy (Medium)
// Concept: Multiple lazy-loaded sections with independent Suspense boundaries.
// Each section loads its bundle independently so one loading does not block others.
// Named fallbacks give users feedback on exactly what is loading.

import { lazy, Suspense, useState } from "react";
import { Button, Card, Col, Row, Spin, Typography, Tag, Space, Tabs } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Simulated lazy sections: each has a different load delay
function createSection(name: string, color: string, delayMs: number) {
  let loaded = false;
  const promise = new Promise<void>((r) =>
    setTimeout(() => {
      loaded = true;
      r();
    }, delayMs)
  );

  return function Section() {
    if (!loaded) throw promise;
    return (
      <div
        style={{
          background: color,
          borderRadius: 8,
          padding: 24,
          textAlign: "center",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Tag color="blue">{name}: loaded ✓</Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Bundle loaded in {delayMs}ms
        </Text>
      </div>
    );
  };
}

const DashboardSection = createSection("Dashboard", "#f5f5f5", 800);
const AnalyticsSection = createSection("Analytics", "#f5f5f5", 1600);
const ReportsSection = createSection("Reports", "#f5f5f5", 2400);
const SettingsSection = createSection("Settings", "#f5f5f5", 400);

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", Component: DashboardSection, delay: 800 },
  { key: "analytics", label: "Analytics", Component: AnalyticsSection, delay: 1600 },
  { key: "reports", label: "Reports", Component: ReportsSection, delay: 2400 },
  { key: "settings", label: "Settings", Component: SettingsSection, delay: 400 },
];

function NamedFallback({ name, delay }: { name: string; delay: number }) {
  return (
    <div
      style={{
        background: "#f8f9fc",
        borderRadius: 8,
        padding: 24,
        textAlign: "center",
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Spin size="small" />
      <Text type="secondary" style={{ fontSize: 13 }}>
        Loading {name} (~{delay}ms)...
      </Text>
    </div>
  );
}

export default function SuspenseMediumPage() {
  const [started, setStarted] = useState(false);

  return (
    <div>
      <PageIntro
        sourcePath="app/patterns/suspense/medium/page.tsx"
        title="Suspense & React.lazy"
        level="medium"
        description="Multiple independent Suspense boundaries load in parallel without blocking each other. Named fallbacks tell users exactly what is loading. Faster sections appear first with no waterfall."
        teaches={[
          "Independent Suspense boundaries: each loads without waiting for others",
          "Named fallbacks: 'Loading Analytics...' is better than a generic spinner",
          "Parallel loading: all bundles download simultaneously",
          "Sections with faster loads appear first for better perceived performance",
        ]}
      />

      {!started ? (
        <Card style={{ borderRadius: 12, textAlign: "center", padding: 32 }}>
          <Text type="secondary" style={{ display: "block", marginBottom: 20, fontSize: 14 }}>
            Click to trigger all 4 sections loading simultaneously. Watch them appear as their
            bundles load, fastest first.
          </Text>
          <Button type="primary" size="large" onClick={() => setStarted(true)}>
            Load All Sections
          </Button>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {SECTIONS.map(({ key, label, Component, delay }) => (
            <Col xs={24} sm={12} key={key}>
              <Card
                title={
                  <Space>
                    <span>{label}</span>
                    <Tag style={{ fontSize: 10 }}>{delay}ms bundle</Tag>
                  </Space>
                }
                style={{ borderRadius: 12 }}
              >
                {/* Each Suspense boundary is independent */}
                <Suspense fallback={<NamedFallback name={label} delay={delay} />}>
                  <Component />
                </Suspense>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <LevelNavigator basePath="/patterns/suspense" currentLevel="medium" />
    </div>
  );
}
