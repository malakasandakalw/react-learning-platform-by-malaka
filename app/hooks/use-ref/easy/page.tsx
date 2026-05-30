"use client";

// useRef: Easy
// Concept: useRef gives you a mutable container that persists across renders.
// ref.current = the actual DOM node.
// Calling ref.current.focus() imperatively focuses the input with no state needed.
// This is the "escape hatch" from React's declarative model for direct DOM access.

import { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { SearchOutlined, AudioOutlined, FormOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// Demo 1: Focus an input imperatively
// ref.current will be the DOM <input> element once the component mounts.
function FocusDemo() {
  const inputRef = useRef<InputRef>(null);
  const [focused, setFocused] = useState(false);

  function handleFocus() {
    // inputRef.current is the Ant Design InputRef. Calling .focus() focuses the DOM input.
    // This is IMPOSSIBLE to do with state alone. Refs are the right tool here.
    inputRef.current?.focus();
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
  }

  return (
    <Card title="Focus on Command" style={{ borderRadius: 12 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          ref={inputRef}
          prefix={<SearchOutlined />}
          placeholder="I'll be focused when you click the button..."
          onBlur={handleBlur}
          onFocus={() => setFocused(true)}
          style={{ borderColor: focused ? "#4f46e5" : undefined }}
        />
        <Button type="primary" onClick={handleFocus} block>
          Focus the input
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {focused ? "✓ Input is focused" : "Input is blurred"}
        </Text>
      </Space>
    </Card>
  );
}

// Demo 2: Scroll to an element
// Refs also work on any DOM element, not just inputs.
function ScrollDemo() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [items] = useState(Array.from({ length: 15 }, (_, i) => `Log entry #${i + 1}`));

  function scrollToBottom() {
    // scrollIntoView is a native DOM method accessed via ref.current
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Card title="Scroll to Element" style={{ borderRadius: 12 }}>
      <div
        style={{
          height: 200,
          overflowY: "auto",
          background: "#f8f9fc",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 12,
          fontSize: 12,
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ padding: "4px 0", borderBottom: "1px solid #f0f0f0" }}>
            {item}
          </div>
        ))}
        {/* This div is our scroll target, attached via ref */}
        <div ref={bottomRef} />
      </div>
      <Button icon={<AudioOutlined />} onClick={scrollToBottom} block>
        Scroll to bottom
      </Button>
    </Card>
  );
}

export default function UseRefEasyPage() {
  return (
    <div>
      <PageIntro
        title="useRef"
        level="easy"
        description="useRef gives you direct access to a DOM element. Unlike state, changing ref.current does not trigger a re-render. Use refs when you need to call DOM methods imperatively (focus, scroll, play/pause, measure size)."
        teaches={[
          "useRef returns an object: { current: null }. The current property is assigned when the element mounts.",
          "Attaching a ref to a JSX element with the ref prop",
          "Calling native DOM methods via ref.current",
          "The key difference: refs don't trigger re-renders, state does",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <FocusDemo />
        </Col>
        <Col xs={24} md={12}>
          <ScrollDemo />
        </Col>
      </Row>

      <Card
        style={{ marginTop: 24, borderRadius: 12, background: "#f5f3ff", border: "1px solid #ddd6fe" }}
        styles={{ body: { padding: 20 } }}
      >
        <Title level={5} style={{ margin: "0 0 8px", color: "#7c3aed" }}>
          When to use ref vs state
        </Title>
        <Text style={{ fontSize: 13 }}>
          If the value affects what the user sees on screen, use <code>useState</code>.
          If you just need to <em>do something</em> to a DOM element without changing the UI, use <code>useRef</code>.
          A focused input doesn&apos;t need to store &quot;isFocused&quot; in state unless you want to change the UI based on it.
        </Text>
      </Card>

      <LevelNavigator basePath="/hooks/use-ref" currentLevel="easy" />
    </div>
  );
}
