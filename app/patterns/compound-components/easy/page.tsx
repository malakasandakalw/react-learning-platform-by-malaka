"use client";

// Patterns: Compound Components (Easy)
// Concept: Tabs compound component where Header, Tab buttons, and Panels
// share implicit state via Context instead of threading activeTab as props.
// Pattern: Object.assign(Root, { List, Tab, Panel }) to expose dot notation API.

import { createContext, useContext, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Paragraph } = Typography;

// ─── Tabs Context ──────────────────────────────────────────────────────────────
type TabsContextValue = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.Tab and Tabs.Panel must be used inside <Tabs>");
  return ctx;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TabsRoot({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
  );
}

function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", borderBottom: "2px solid #f0f0f0", marginBottom: 16 }}>
      {children}
    </div>
  );
}

function TabButton({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: "8px 20px",
        border: "none",
        background: "none",
        borderBottom: `2px solid ${isActive ? "#1677ff" : "transparent"}`,
        marginBottom: -2,
        cursor: "pointer",
        fontWeight: isActive ? 600 : 400,
        color: isActive ? "#1677ff" : "rgba(0,0,0,0.65)",
        transition: "all 0.15s",
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab } = useTabsContext();
  if (activeTab !== id) return null;
  return <div>{children}</div>;
}

// ─── Dot notation API ─────────────────────────────────────────────────────────
// Object.assign attaches sub-components as static properties on TabsRoot.
// Consumers write <Tabs.Tab id="x"> instead of importing Tab separately.
const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabButton,
  Panel: TabPanel,
});

export default function CompoundComponentsEasyPage() {
  return (
    <div>
      <PageIntro
        sourcePath="app/patterns/compound-components/easy/page.tsx"
        title="Compound Components"
        level="easy"
        description="Tabs is the classic compound component. Tabs.List, Tabs.Tab, and Tabs.Panel all share the active-tab state via Context with no activeTab or onChange props threaded between them. The parent just provides the initial state."
        teaches={[
          "createContext + Provider: Tabs root owns state, sub-components consume it",
          "useTabsContext() throws if used outside <Tabs>, which enforces correct composition",
          "Tabs.Panel returns null when id !== activeTab so no visibility prop is needed",
          "Object.assign(Root, { Tab, Panel }) gives consumers the dot notation API",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={15}>
          <Card title="Tabs compound component" style={{ borderRadius: 12 }}>
            <Tabs defaultTab="overview">
              <Tabs.List>
                <Tabs.Tab id="overview">Overview</Tabs.Tab>
                <Tabs.Tab id="details">Details</Tabs.Tab>
                <Tabs.Tab id="code">Usage</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel id="overview">
                <Paragraph style={{ margin: 0, fontSize: 13 }}>
                  This is the <strong>Overview</strong> panel. The Tabs root owns{" "}
                  <code>activeTab</code> state. Neither Tab buttons nor Panels receive it as a prop.
                  They all read it from Context.
                </Paragraph>
              </Tabs.Panel>

              <Tabs.Panel id="details">
                <Paragraph style={{ margin: 0, fontSize: 13 }}>
                  This is the <strong>Details</strong> panel. <code>Tabs.Panel</code> calls{" "}
                  <code>useTabsContext()</code> and returns <code>null</code> when its{" "}
                  <code>id</code> doesn&apos;t match <code>activeTab</code>. No conditional
                  rendering in the consumer needed.
                </Paragraph>
              </Tabs.Panel>

              <Tabs.Panel id="code">
                <div
                  style={{
                    background: "#1e1e1e",
                    borderRadius: 8,
                    padding: 16,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    lineHeight: 1.8,
                    color: "#d4d4d4",
                  }}
                >
                  <div style={{ color: "#6a9955" }}>{"// Consumer writes:"}</div>
                  <div>{'<Tabs defaultTab="overview">'}</div>
                  <div style={{ paddingLeft: 16 }}>{"<Tabs.List>"}</div>
                  <div style={{ paddingLeft: 32 }}>
                    {'<Tabs.Tab id="overview">Overview</Tabs.Tab>'}
                  </div>
                  <div style={{ paddingLeft: 32 }}>
                    {'<Tabs.Tab id="details">Details</Tabs.Tab>'}
                  </div>
                  <div style={{ paddingLeft: 16 }}>{"</Tabs.List>"}</div>
                  <div style={{ paddingLeft: 16, color: "#ce9178" }}>
                    {'<Tabs.Panel id="overview">...</Tabs.Panel>'}
                  </div>
                  <div style={{ paddingLeft: 16, color: "#ce9178" }}>
                    {'<Tabs.Panel id="details">...</Tabs.Panel>'}
                  </div>
                  <div>{"</Tabs>"}</div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} md={9}>
          <Card title="Context flow" style={{ borderRadius: 12, height: "100%" }}>
            <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: 8 }}>
                <Text strong style={{ color: "rgba(0,0,0,0.88)" }}>
                  TabsRoot: Provider
                </Text>
                <br />
                <Text style={{ fontSize: 12 }}>
                  State: <code>activeTab</code>, <code>setActiveTab</code>
                </Text>
              </div>
              <div style={{ paddingLeft: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ padding: "8px 12px", background: "#f5f5f5", borderRadius: 8 }}>
                  <Text strong style={{ color: "rgba(0,0,0,0.88)" }}>
                    Tabs.Tab
                  </Text>
                  <br />
                  <Text style={{ fontSize: 12 }}>
                    Reads <code>activeTab</code>, calls <code>setActiveTab</code> on click
                  </Text>
                </div>
                <div style={{ padding: "8px 12px", background: "#f5f5f5", borderRadius: 8 }}>
                  <Text strong style={{ color: "rgba(0,0,0,0.88)" }}>
                    Tabs.Panel
                  </Text>
                  <br />
                  <Text style={{ fontSize: 12 }}>
                    Returns <code>null</code> if <code>id !== activeTab</code>
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/compound-components" currentLevel="easy" />
    </div>
  );
}
