"use client";

// useId: Easy
// Concept: useId generates a stable, unique ID that is consistent between
// server and client renders (SSR-safe). Before useId, developers used
// Math.random() or an incrementing counter both break SSR because the
// server and client generate different IDs, causing hydration mismatches.
// useId solves this by using React's internal tree position to generate the ID.
// Primary use case: pairing <label htmlFor> with <input id> for accessibility.

import { useId } from "react";
import { Card, Col, Input, Row, Typography, Space, Select, Alert } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// A reusable form field component that needs a unique ID to link label to input.
// Without useId, we would need to pass an id prop from the parent, which is messy.
// With useId, the component is self-contained and accessibility-correct.
function LabeledInput({
  label,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  // Each instance of this component gets its own unique ID from React.
  // The ID is stable across renders and matches between server + client.
  const id = useId();
  const hintId = `${id}-hint`; // Derive related IDs from the base ID

  return (
    <div>
      {/* htmlFor links this label to the input with matching id */}
      <label
        htmlFor={id}
        style={{ display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d9d9d9",
          fontSize: 14,
          outline: "none",
        }}
      />
      {hint && (
        <p id={hintId} style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// This component shows what IDs are generated, making the concept visible
function IdInspector() {
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();

  return (
    <Card
      title="Generated IDs"
      style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
      styles={{
        header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
        body: { padding: 16 },
      }}
    >
      <div
        style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2.2, color: "#d4d4d4" }}
      >
        <div style={{ color: "#569cd6" }}>// Three useId() calls in this component:</div>
        <div>
          id1: <span style={{ color: "#ce9178" }}>&quot;{id1}&quot;</span>
        </div>
        <div>
          id2: <span style={{ color: "#ce9178" }}>&quot;{id2}&quot;</span>
        </div>
        <div>
          id3: <span style={{ color: "#ce9178" }}>&quot;{id3}&quot;</span>
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            background: "#2d2d2d",
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          <div style={{ color: "#569cd6" }}>Pattern: :r{`{componentPosition}`}:</div>
          <div style={{ color: "#6a9955" }}>Stable across server + client</div>
          <div style={{ color: "#6a9955" }}>Never use for list keys!</div>
        </div>
      </div>
    </Card>
  );
}

export default function UseIdEasyPage() {
  return (
    <div>
      <PageIntro
        title="useId"
        level="easy"
        description="useId generates a unique ID that is stable across server and client renders. Its primary purpose is accessibility: linking <label htmlFor> to <input id> without prop drilling or hydration mismatches."
        teaches={[
          "useId() returns a stable ':r0:', ':r1:' style ID",
          "Pairing htmlFor with id for accessible forms",
          "Deriving related IDs: `${id}-hint`, `${id}-error`",
          "Why Math.random() breaks SSR and how useId solves it",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Accessible Form Fields" style={{ borderRadius: 12 }}>
            <Alert
              type="info"
              showIcon
              title="Inspect the HTML: each label's htmlFor matches its input's id, linked by useId"
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
            <Space orientation="vertical" style={{ width: "100%" }} size={20}>
              {/* Each LabeledInput instance calls useId internally and all get unique IDs */}
              <LabeledInput
                label="Full Name"
                placeholder="Jane Smith"
                hint="Enter your first and last name"
              />
              <LabeledInput label="Email Address" type="email" placeholder="jane@example.com" />
              <LabeledInput
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                hint="Mix letters, numbers, and symbols"
              />
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <IdInspector />
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-id" currentLevel="easy" />
    </div>
  );
}
