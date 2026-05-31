"use client";

// useRef: Advanced
// Concept: forwardRef + useImperativeHandle
// By default, you cannot put a ref on a custom component, only on DOM elements.
// forwardRef lets a parent pass a ref into a child component.
// useImperativeHandle lets the child control what the parent can do with that ref.
// exposing only specific methods instead of the raw DOM node.
// This is the pattern used by UI libraries (like Ant Design itself) internally.

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Alert, Button, Card, Col, Input, Row, Space, Typography, InputRef } from "antd";
import { ClearOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// The methods we expose to the parent via the ref.
// Notice: we do NOT expose the raw DOM node, only what the parent needs.
type SmartInputHandle = {
  focus: () => void;
  clear: () => void;
  validate: () => boolean;
  getValue: () => string;
};

type SmartInputProps = {
  placeholder?: string;
  required?: boolean;
  label?: string;
};

// forwardRef wraps the component so it can receive a ref from its parent.
// useImperativeHandle defines what that ref exposes.
const SmartInput = forwardRef<SmartInputHandle, SmartInputProps>(function SmartInput(
  { placeholder, required, label },
  ref
) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const inputRef = useRef<InputRef>(null);

  // useImperativeHandle: define exactly what the parent can do.
  // The parent gets a SmartInputHandle object, not the raw DOM input.
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      setValue("");
      setStatus("");
    },
    validate() {
      if (required && !value.trim()) {
        setStatus("error");
        return false;
      }
      setStatus("");
      return true;
    },
    getValue() {
      return value;
    },
  }));

  return (
    <div>
      {label && <Text style={{ display: "block", marginBottom: 4 }}>{label}</Text>}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (status) setStatus("");
        }}
        placeholder={placeholder}
        status={status}
        suffix={
          status === "error" ? (
            <ExclamationCircleOutlined style={{ color: "#ef4444" }} />
          ) : value ? (
            <CheckOutlined style={{ color: "#16a34a" }} />
          ) : null
        }
      />
      {status === "error" && (
        <Text type="danger" style={{ fontSize: 12 }}>
          This field is required
        </Text>
      )}
    </div>
  );
});

SmartInput.displayName = "SmartInput";

// Parent component: drives child components using imperative methods via refs.
function FormWithImperativeHandles() {
  const nameRef = useRef<SmartInputHandle>(null);
  const emailRef = useRef<SmartInputHandle>(null);
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null);
  const [score, setScore] = useState(0);

  function handleSubmit() {
    // Calling child methods imperatively via refs
    const nameValid = nameRef.current?.validate() ?? false;
    const emailValid = emailRef.current?.validate() ?? false;

    if (nameValid && emailValid) {
      setSubmitted({
        name: nameRef.current!.getValue(),
        email: emailRef.current!.getValue(),
      });
      setScore(100);
    } else {
      setScore(0);
      // Focus the first invalid field
      if (!nameValid) nameRef.current?.focus();
      else emailRef.current?.focus();
    }
  }

  function handleClearAll() {
    nameRef.current?.clear();
    emailRef.current?.clear();
    setSubmitted(null);
    setScore(0);
  }

  return (
    <Card title="Form with Imperative Handles" style={{ borderRadius: 12 }}>
      <Space orientation="vertical" style={{ width: "100%" }} size={16}>
        {/* SmartInput receives a ref, possible only because it uses forwardRef */}
        <SmartInput ref={nameRef} label="Full Name" placeholder="Enter your name" required />
        <SmartInput ref={emailRef} label="Email" placeholder="Enter your email" required />

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button type="primary" onClick={handleSubmit} style={{ flex: 1 }}>
            Submit
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleClearAll}>
            Clear All
          </Button>
        </div>

        {submitted && (
          <Alert
            type="success"
            showIcon
            message="Submitted successfully!"
            description={`Name: ${submitted.name} · Email: ${submitted.email}`}
          />
        )}
      </Space>
    </Card>
  );
}

export default function UseRefAdvancedPage() {
  return (
    <div>
      <PageIntro
        title="useRef"
        level="advanced"
        description="forwardRef and useImperativeHandle give you controlled imperative APIs for custom components. Instead of exposing the raw DOM node, you define exactly which methods the parent is allowed to call, creating a clean and safe imperative interface."
        teaches={[
          "forwardRef: allows a custom component to accept a ref prop from its parent",
          "useImperativeHandle: controls what the parent can do with that ref",
          "Exposing a typed handle (focus, clear, validate) instead of raw DOM",
          "When imperative APIs are the right design: form libraries, animation, media players",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <FormWithImperativeHandles />
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title="How forwardRef Works"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 1.8,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#6a9955" }}>// without forwardRef:</div>
              <div style={{ color: "#ce9178" }}>{"<SmartInput ref={ref} />"}</div>
              <div style={{ color: "#6a9955" }}>// ❌ Warning: ref not forwarded</div>
              <br />
              <div style={{ color: "#6a9955" }}>// with forwardRef:</div>
              <div style={{ color: "#dcdcaa" }}>{"forwardRef((props, ref) => {"}</div>
              <div style={{ paddingLeft: 16, color: "#dcdcaa" }}>
                {"useImperativeHandle(ref, () => ({"}
              </div>
              <div style={{ paddingLeft: 32, color: "#569cd6" }}>
                {"focus: () => inputRef.current?.focus(),"}
              </div>
              <div style={{ paddingLeft: 32, color: "#569cd6" }}>{"validate: () => boolean,"}</div>
              <div style={{ paddingLeft: 16, color: "#dcdcaa" }}>{"}));"}</div>
              <div style={{ color: "#dcdcaa" }}>{"})"}</div>
              <br />
              <div style={{ color: "#6a9955" }}>// parent sees:</div>
              <div style={{ color: "#d4d4d4" }}>{"ref.current.focus()"}</div>
              <div style={{ color: "#d4d4d4" }}>{"ref.current.validate()"}</div>
              <div style={{ color: "#d4d4d4" }}>{"ref.current.clear()"}</div>
              <div style={{ color: "#6a9955", marginTop: 8 }}>
                {"// NOT ref.current.style etc."}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-ref" currentLevel="advanced" />
    </div>
  );
}
