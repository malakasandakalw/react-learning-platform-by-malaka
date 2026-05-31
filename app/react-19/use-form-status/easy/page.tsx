"use client";

// React 19: useFormStatus Easy
// Concept: useFormStatus reads the submission status of the PARENT <form>.
// Any component inside a <form> can call useFormStatus() to know if the form
// is currently being submitted, without any prop drilling.
//
// Returns: { pending, data, method, action }
// - pending: true while the form action is running
// - data: FormData of the current submission
// - method: "get" | "post" | etc.
//
// Rule: useFormStatus ONLY works inside a component rendered as a child of a <form>.

import { useFormStatus } from "react-dom";
import { useState } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Typography,
  Alert,
  Tag,
  Space,
} from "antd";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── SubmitButton reads the parent form's pending status ──────────────────────
// Note: this component is NOT the form. It just lives inside one.
// No props needed: useFormStatus reads the ambient form state.
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: pending ? "#9ca3af" : "#1677ff",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "10px 24px",
        fontSize: 14,
        fontWeight: 600,
        cursor: pending ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "background 0.2s",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {pending ? <LoadingOutlined spin /> : <SendOutlined />}
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

// StatusBanner reads form status too (deeper in the tree)
// Demonstrates that useFormStatus works at any nesting depth inside the form.
function StatusBanner() {
  const { pending, data } = useFormStatus();
  if (!pending) return null;

  return (
    <div
      style={{
        background: "#e6f4ff",
        border: "1px solid #91caff",
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <LoadingOutlined style={{ color: "#1677ff" }} />
      <Text style={{ fontSize: 12, color: "#1677ff" }}>
        Submitting: &quot;{data?.get("message")?.toString()?.slice(0, 30)}&quot;...
      </Text>
    </div>
  );
}

export default function UseFormStatusEasyPage() {
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1500));
    setResult(`Message sent: "${message}"`);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div>
      <PageIntro
        title="useFormStatus"
        level="easy"
        description="useFormStatus reads the parent form's pending state from inside any child component without prop drilling. The SubmitButton and StatusBanner both use it without receiving any props."
        teaches={[
          "useFormStatus() → { pending, data, method, action }",
          "Works in any component rendered inside a <form>, at any depth",
          "No props needed: reads ambient form context",
          "data: FormData of the current submission for accessing field values",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={13}>
          <Card title="Contact Form" style={{ borderRadius: 12 }}>
            {result && (
              <Alert
                type="success"
                title={result}
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
                closable
                onClose={() => setResult(null)}
              />
            )}

            {/* The form: SubmitButton and StatusBanner are children */}
            <form onSubmit={handleSubmit}>
              <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Name</label>
                  <Input name="name" placeholder="Your name" required />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Message</label>
                  <Input.TextArea name="message" rows={3} placeholder="Your message" required />
                </div>

                {/* StatusBanner reads form status with no props received */}
                <StatusBanner />

                {/* SubmitButton reads form status with no props received */}
                <SubmitButton />
              </Space>
            </form>
          </Card>
        </Col>

        <Col xs={24} lg={11}>
          <Card
            title="useFormStatus rules"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
              <div style={{ color: "#b5cea8" }}>// ✓ Works: inside a form:</div>
              <div style={{ color: "#ce9178" }}>{"<form>"}</div>
              <div style={{ color: "#ce9178", paddingLeft: 12 }}>{"<SubmitButton />"}</div>
              <div style={{ color: "#ce9178" }}>{"</form>"}</div>
              <br />
              <div style={{ color: "#6a9955" }}>// ✗ Fails: not inside a form:</div>
              <div style={{ color: "#d4d4d4" }}>{"<SubmitButton />"} <span style={{ color: "#6a9955" }}>← pending always false</span></div>
              <br />
              <div style={{ color: "#6a9955" }}>// Returns:</div>
              <div style={{ color: "#d4d4d4" }}>{"{ pending: boolean,"}</div>
              <div style={{ color: "#d4d4d4" }}>{"  data: FormData | null,"}</div>
              <div style={{ color: "#d4d4d4" }}>{"  method: string | null,"}</div>
              <div style={{ color: "#d4d4d4" }}>{"  action: fn | string | null }"}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-form-status" currentLevel="easy" />
    </div>
  );
}
