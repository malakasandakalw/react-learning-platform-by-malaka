"use client";

// useTransition: Easy
// Concept: React normally processes all state updates with equal priority.
// useTransition lets you mark a state update as "low priority", making it a transition.
// The urgent update (button click feedback) happens immediately.
// The slow update (rendering many items) happens as a non-blocking transition.
// isPending tells you if a transition is still in progress.

import { useState, useTransition } from "react";
import { Button, Card, Col, Row, Spin, Tabs, Tag, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Simulates a slow tab render: generates 5000 items
function SlowTabContent({ tab }: { tab: string }) {
  const items = Array.from({ length: 5000 }, (_, i) => `${tab} item ${i + 1}`);
  return (
    <div style={{ height: 200, overflow: "auto" }}>
      {items.slice(0, 20).map((item, i) => (
        <div key={i} style={{ padding: "4px 0", fontSize: 12, borderBottom: "1px solid #f5f5f5" }}>
          {item}
        </div>
      ))}
      <Text type="secondary" style={{ fontSize: 11 }}>
        ...and 4,980 more items (simulated)
      </Text>
    </div>
  );
}

const TABS = ["Overview", "Analytics", "Reports", "Settings"];

export default function UseTransitionEasyPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  // startTransition wraps the slow state update.
  // isPending is true while that transition is being processed.
  const [isPending, startTransition] = useTransition();

  function handleTabChange(tab: string) {
    // The button visually switches immediately.
    // The actual tab content render is wrapped in a transition, making it non-blocking.
    startTransition(() => {
      setActiveTab(tab);
    });
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/modern-hooks/use-transition/easy/page.tsx"
        title="useTransition"
        level="easy"
        description="useTransition tells React that some state updates are less urgent. The UI stays responsive while expensive renders happen in the background. isPending lets you show a loading indicator during the transition."
        teaches={[
          "startTransition(() => setState()) marks an update as non-urgent",
          "isPending is true while React is processing the transition",
          "Without transitions, slow renders block the UI. With transitions, they do not.",
          "The UI stays interactive during a pending transition",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Tab Switcher (with useTransition)" style={{ borderRadius: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {TABS.map((tab) => (
                <Button
                  key={tab}
                  type={activeTab === tab ? "primary" : "default"}
                  onClick={() => handleTabChange(tab)}
                  // The button responds immediately. Only the content is slow
                >
                  {tab}
                </Button>
              ))}
            </div>

            {isPending ? (
              // Show this while the transition is in progress
              <div style={{ padding: 40, textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: 12, color: "#9ca3af" }}>
                  Rendering {activeTab} content...
                </div>
              </div>
            ) : (
              <SlowTabContent tab={activeTab} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Transition State"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2.2 }}>
              <div>
                <span style={{ color: "#569cd6" }}>activeTab: </span>
                <span style={{ color: "#ce9178" }}>&quot;{activeTab}&quot;</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#dcdcaa" : "#b5cea8" }}>
                  {String(isPending)}
                </span>
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                }}
              >
                <div style={{ color: "#569cd6", fontSize: 11 }}>Without useTransition:</div>
                <div style={{ color: "#ce9178", fontSize: 11 }}>UI freezes during render</div>
                <div style={{ color: "#569cd6", fontSize: 11, marginTop: 8 }}>
                  With useTransition:
                </div>
                <div style={{ color: "#b5cea8", fontSize: 11 }}>Buttons stay clickable</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-transition" currentLevel="easy" />
    </div>
  );
}
