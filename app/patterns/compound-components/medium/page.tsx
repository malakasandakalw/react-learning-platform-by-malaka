"use client";

// Patterns: Compound Components (Medium)
// Concept: Accordion where the root controls which item is open.
// Default: exclusive mode, opening one item closes the others.
// Toggle multi prop: any number of items can be open simultaneously.
// AccordionItem reads openItems (a Set) from Context and never receives siblings as props.

import { createContext, useContext, useState } from "react";
import { Card, Col, Row, Switch, Typography } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Paragraph } = Typography;

// ─── Accordion Context ─────────────────────────────────────────────────────────
type AccordionContextValue = {
  openItems: Set<string>;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item must be used inside <Accordion>");
  return ctx;
}

// ─── Accordion root ────────────────────────────────────────────────────────────
function AccordionRoot({
  children,
  multi = false,
}: {
  children: React.ReactNode;
  multi?: boolean;
}) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multi) next.clear(); // exclusive: close all others first
        next.add(id);
      }
      return next;
    });
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </AccordionContext.Provider>
  );
}

// ─── AccordionItem sub-component ──────────────────────────────────────────────
function AccordionItem({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const { openItems, toggle } = useAccordionContext();
  const isOpen = openItems.has(id);

  return (
    <div
      style={{
        border: `1.5px solid ${isOpen ? "#1677ff" : "#f0f0f0"}`,
        borderRadius: 8,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => toggle(id)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: isOpen ? "#e6f4ff" : "#fafafa",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: isOpen ? 600 : 400,
          color: isOpen ? "#1677ff" : "rgba(0,0,0,0.88)",
          fontSize: 14,
          transition: "all 0.2s",
        }}
      >
        {title}
        {isOpen ? (
          <UpOutlined style={{ fontSize: 11 }} />
        ) : (
          <DownOutlined style={{ fontSize: 11 }} />
        )}
      </button>
      {isOpen && (
        <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Dot notation API ─────────────────────────────────────────────────────────
const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });

export default function CompoundComponentsMediumPage() {
  const [multi, setMulti] = useState(false);

  return (
    <div>
      <PageIntro
        title="Compound Components"
        level="medium"
        description="Accordion coordinates which items are open via a Set<string> in Context. The root handles exclusive-vs-multi logic in one place. AccordionItem just calls toggle(id) and checks openItems.has(id). No item knows about its siblings."
        teaches={[
          "Context carries Set<string> for open items with O(1) has() check per item",
          "Exclusive mode: toggle() calls next.clear() before adding the new id",
          "Multi mode: same toggle() body, skip clear(). Zero changes needed in AccordionItem.",
          "AccordionItem is fully self-contained and never receives sibling state as props",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={15}>
          <Card
            title="Accordion compound component"
            extra={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 13 }}>Multi-open</Text>
                <Switch size="small" checked={multi} onChange={setMulti} />
              </div>
            }
            style={{ borderRadius: 12 }}
          >
            <Accordion multi={multi}>
              <Accordion.Item id="what" title="What are Compound Components?">
                <Paragraph style={{ margin: 0, fontSize: 13 }}>
                  Components designed to work together, sharing implicit state via Context.
                  Like native HTML. A <code>{"<select>"}</code> knows about its{" "}
                  <code>{"<option>"}</code>s without you wiring them up.
                </Paragraph>
              </Accordion.Item>
              <Accordion.Item id="when" title="When should I use this pattern?">
                <Paragraph style={{ margin: 0, fontSize: 13 }}>
                  When building reusable UI components that need flexible composition,
                  design systems, component libraries, shared UI kits. The consumer
                  decides structure; the compound component handles coordination.
                </Paragraph>
              </Accordion.Item>
              <Accordion.Item id="vs-props" title="vs. Prop Drilling">
                <Paragraph style={{ margin: 0, fontSize: 13 }}>
                  Without this pattern you&apos;d pass <code>activeItem</code> and{" "}
                  <code>onItemChange</code> to every child. Context eliminates that
                  wiring. Sub-components are fully self-contained.
                </Paragraph>
              </Accordion.Item>
              <Accordion.Item id="vs-hooks" title="vs. Custom Hooks">
                <Paragraph style={{ margin: 0, fontSize: 13 }}>
                  Custom hooks share logic. Compound components share both logic{" "}
                  <em>and</em> structure. Use compound components for UI building blocks
                  where the relationship between parts matters.
                </Paragraph>
              </Accordion.Item>
            </Accordion>
          </Card>
        </Col>

        <Col xs={24} md={9}>
          <Card title="How toggle() works" style={{ borderRadius: 12, height: "100%" }}>
            <div
              style={{
                background: "#1e1e1e",
                borderRadius: 8,
                padding: 14,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 1.8,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#dcdcaa" }}>{"function toggle(id) {"}</div>
              <div style={{ paddingLeft: 12 }}>{"const next = new Set(prev);"}</div>
              <div style={{ paddingLeft: 12, color: "#569cd6" }}>
                {"if (next.has(id)) {"}
              </div>
              <div style={{ paddingLeft: 24 }}>{"next.delete(id);"}</div>
              <div style={{ paddingLeft: 12, color: "#569cd6" }}>
                {"} else {"}
              </div>
              <div style={{ paddingLeft: 24, color: "#6a9955" }}>
                {"// exclusive mode:"}
              </div>
              <div style={{ paddingLeft: 24 }}>
                {"if (!multi) next.clear();"}
              </div>
              <div style={{ paddingLeft: 24 }}>{"next.add(id);"}</div>
              <div style={{ paddingLeft: 12, color: "#569cd6" }}>{"}"}</div>
              <div style={{ color: "#dcdcaa" }}>{"}"}</div>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#555" }}>
              <Text style={{ fontSize: 12 }}>
                Mode now: <strong>{multi ? "multi (any open)" : "exclusive (one at a time)"}</strong>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/compound-components" currentLevel="medium" />
    </div>
  );
}
