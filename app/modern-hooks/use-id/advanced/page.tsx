"use client";

// useId: Advanced
// Concept: SSR-safe ARIA relationships.
// Complex ARIA patterns (aria-describedby, aria-labelledby, aria-controls,
// aria-owns) require matching IDs between elements that may be far apart in the tree.
// useId ensures these IDs match between server and client renders.
// This example builds an accessible combobox (searchable dropdown) with full ARIA.

import { useId, useState, useRef } from "react";
import { Card, Col, Row, Tag, Typography, Alert } from "antd";
import { SearchOutlined, CheckOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

const OPTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "Redux Toolkit",
  "Tailwind CSS",
  "Node.js",
  "GraphQL",
  "REST API",
  "WebSockets",
  "Docker",
];

// A fully accessible combobox (searchable dropdown).
// ARIA relationships:
//   - input aria-controls → listbox id
//   - input aria-activedescendant → active option id
//   - each option has a stable id (built from useId + index)
// All IDs come from useId: safe in SSR, stable across re-renders.
function AccessibleCombobox({ label }: { label: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selected, setSelected] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Base ID for this combobox instance
  const id = useId();
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const getOptionId = (i: number) => `${id}-option-${i}`;

  const filtered = OPTIONS.filter(
    (o) => o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o)
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      select(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function select(option: string) {
    setSelected((prev) => [...prev, option]);
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function deselect(option: string) {
    setSelected((prev) => prev.filter((o) => o !== option));
  }

  return (
    <div>
      {/* aria-label uses the labelId, which links the label to the input */}
      <div id={labelId} style={{ fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
        {label}
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
          {selected.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => deselect(item)}
              color="blue"
              style={{ margin: 0 }}
            >
              {item}
            </Tag>
          ))}
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <SearchOutlined style={{ position: "absolute", left: 10, color: "#9ca3af" }} />
          <input
            ref={inputRef}
            role="combobox"
            aria-labelledby={labelId} // Links to the label above
            aria-controls={listboxId} // Controls the dropdown listbox
            aria-expanded={isOpen} // Tells screen readers if dropdown is open
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Search technologies..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: 8,
              border: "1px solid #d9d9d9",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        {isOpen && filtered.length > 0 && (
          <ul
            id={listboxId} // Matches the input's aria-controls
            role="listbox"
            aria-labelledby={labelId}
            aria-multiselectable="true"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              listStyle: "none",
              margin: "4px 0 0",
              padding: "4px 0",
              zIndex: 10,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {filtered.map((option, i) => (
              <li
                key={option}
                id={getOptionId(i)} // Matches input's aria-activedescendant
                role="option"
                aria-selected={activeIndex === i}
                onMouseDown={() => select(option)}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  background: activeIndex === i ? "#e6f4ff" : undefined,
                  color: activeIndex === i ? "#1677ff" : undefined,
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Text style={{ fontSize: 12, color: "#9ca3af", fontFamily: "var(--font-mono)" }}>
        listbox id: {listboxId}
      </Text>
    </div>
  );
}

export default function UseIdAdvancedPage() {
  return (
    <div>
      <PageIntro
        sourcePath="app/modern-hooks/use-id/advanced/page.tsx"
        title="useId"
        level="advanced"
        description="Complex ARIA patterns require matching IDs between elements that are far apart in the DOM tree. useId generates these IDs in a way that is guaranteed to match between server and client, preventing accessibility hydration mismatches."
        teaches={[
          "ARIA attributes (aria-controls, aria-labelledby, aria-activedescendant) need matching IDs",
          "Deriving a family of IDs from one useId base: listboxId, labelId, getOptionId(i)",
          "Why Math.random() IDs break SSR: server and client generate different values",
          "Building a fully accessible combobox with correct ARIA relationships",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Accessible Multi-Select Combobox" style={{ borderRadius: 12 }}>
            <Alert
              type="info"
              showIcon
              title="Try tabbing to this field and using arrow keys + Enter. It is fully keyboard accessible."
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
            <AccessibleCombobox label="Select Technologies" />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="ARIA ID Map"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#569cd6" }}>const id = useId();</div>
              <div style={{ color: "#6a9955" }}>// generates e.g. ":r3:"</div>
              <br />
              <div>
                labelId = <span style={{ color: "#ce9178" }}>&quot;:r3:-label&quot;</span>
              </div>
              <div>
                listboxId = <span style={{ color: "#ce9178" }}>&quot;:r3:-listbox&quot;</span>
              </div>
              <div>
                optionId(0) = <span style={{ color: "#ce9178" }}>&quot;:r3:-option-0&quot;</span>
              </div>
              <br />
              <div
                style={{
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                <div style={{ color: "#569cd6" }}>input connects:</div>
                <div style={{ color: "#6a9955" }}>aria-labelledby → labelId</div>
                <div style={{ color: "#6a9955" }}>aria-controls → listboxId</div>
                <div style={{ color: "#6a9955" }}>aria-activedescendant → optionId(activeIdx)</div>
                <div style={{ color: "#b5cea8", marginTop: 4 }}>All SSR-safe ✓</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-id" currentLevel="advanced" />
    </div>
  );
}
