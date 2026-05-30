"use client";

// React 19: useFormStatus Medium
// Concept: Disabling ALL form fields during submission.
// A reusable <FormField> component reads useFormStatus to disable itself
// while the form is pending. Every field gets this behavior automatically.
// no disabled prop needs to be passed from the parent form.

import { useFormStatus } from "react-dom";
import { useState } from "react";
import {
  Alert,
  Card,
  Col,
  Row,
  Typography,
  Space,
  Tag,
  Select,
  Result,
  Button,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Reusable field that auto-disables during form submission
function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={pending}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d9d9d9",
          fontSize: 13,
          outline: "none",
          background: pending ? "#f5f5f5" : "#fff",
          color: pending ? "#9ca3af" : "#374151",
          transition: "all 0.2s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function FormSelect({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  const { pending } = useFormStatus();
  const [value, setValue] = useState("");

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</label>
      <Select
        style={{ width: "100%" }}
        disabled={pending}
        options={options}
        value={value || undefined}
        onChange={setValue}
        placeholder="Select..."
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        padding: "10px 0",
        background: pending ? "#6b7280" : "#059669",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: pending ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {pending && <LoadingOutlined />}
      {pending ? "Registering..." : "Register"}
    </button>
  );
}

function PendingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.6)",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <LoadingOutlined style={{ fontSize: 24, color: "#059669" }} />
        <div style={{ marginTop: 8, color: "#059669", fontWeight: 600 }}>Processing...</div>
      </div>
    </div>
  );
}

export default function UseFormStatusMediumPage() {
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 2000));
    setDone(true);
  }

  if (done) {
    return (
      <div>
        <PageIntro
          title="useFormStatus"
          level="medium"
          description="A reusable FormField component reads useFormStatus to disable itself during submission. No disabled prop is needed from the parent."
          teaches={[
            "Reusable form components that self-disable via useFormStatus",
            "No prop drilling: parent doesn't need to pass isPending down",
            "PendingOverlay: full-card overlay reading form status",
            "Every field + button + overlay reads the same ambient form state",
          ]}
        />
        <Result
          status="success"
          title="Registration Complete!"
          extra={<Button onClick={() => setDone(false)}>Register Another</Button>}
        />
        <LevelNavigator basePath="/react-19/use-form-status" currentLevel="medium" />
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        title="useFormStatus"
        level="medium"
        description="A reusable FormField component reads useFormStatus to disable itself during submission. No disabled prop is needed from the parent."
        teaches={[
          "Reusable form components that self-disable via useFormStatus",
          "No prop drilling: parent doesn't need to pass isPending down",
          "PendingOverlay: full-card overlay reading form status",
          "Every field + button + overlay reads the same ambient form state",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <div style={{ position: "relative" }}>
            <Card title="Registration Form" style={{ borderRadius: 12 }}>
              <form onSubmit={handleSubmit}>
                <Space direction="vertical" style={{ width: "100%" }} size={14}>
                  <Row gutter={12}>
                    <Col span={12}>
                      <FormField label="First Name" name="firstName" placeholder="Jane" required />
                    </Col>
                    <Col span={12}>
                      <FormField label="Last Name" name="lastName" placeholder="Smith" required />
                    </Col>
                  </Row>
                  <FormField label="Email" name="email" type="email" placeholder="jane@example.com" required />
                  <FormField label="Password" name="password" type="password" placeholder="Min 8 characters" required />
                  <FormSelect
                    label="Role"
                    name="role"
                    options={[
                      { value: "frontend", label: "Frontend Developer" },
                      { value: "backend", label: "Backend Developer" },
                      { value: "fullstack", label: "Full Stack" },
                    ]}
                  />
                  <SubmitButton />
                </Space>

                {/* Overlay also reads useFormStatus with no props */}
                <PendingOverlay />
              </form>
            </Card>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Why this matters"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#f87171" }}>// Old pattern (prop drilling):</div>
              <div style={{ color: "#6b7280" }}>{"<Form isLoading={isLoading}>"}</div>
              <div style={{ color: "#6b7280", paddingLeft: 12 }}>{"<Input disabled={isLoading} />"}</div>
              <div style={{ color: "#6b7280", paddingLeft: 12 }}>{"<Button disabled={isLoading} />"}</div>
              <div style={{ color: "#6b7280" }}>{"</Form>"}</div>
              <br />
              <div style={{ color: "#4ade80" }}>// React 19 (useFormStatus):</div>
              <div style={{ color: "#4ade80" }}>{"<form action={submit}>"}</div>
              <div style={{ color: "#4ade80", paddingLeft: 12 }}>{"<FormField />"} <span style={{ color: "#6b7280" }}>← self-disables</span></div>
              <div style={{ color: "#4ade80", paddingLeft: 12 }}>{"<SubmitButton />"} <span style={{ color: "#6b7280" }}>← self-disables</span></div>
              <div style={{ color: "#4ade80" }}>{"</form>"}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-form-status" currentLevel="medium" />
    </div>
  );
}
