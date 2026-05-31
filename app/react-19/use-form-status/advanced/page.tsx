"use client";

// React 19: useFormStatus Advanced
// Concept: useFormStatus with useActionState, the React 19 form pattern.
// When a <form> has an action prop pointing to an async function,
// useFormStatus.pending is automatically true during that action.
// This ties together use(), useActionState, and useFormStatus, all React 19 APIs.

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Alert, Card, Col, Row, Typography, Space, Tag, Statistic } from "antd";
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { createPost } from "@/services/jsonPlaceholder";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type Result = {
  status: "idle" | "success" | "error";
  message: string;
  count: number;
};

// Server action (or client action in our case) tied to the form
async function submitAction(prev: Result, formData: FormData): Promise<Result> {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!title?.trim()) return { ...prev, status: "error", message: "Title required" };
  if (!body?.trim()) return { ...prev, status: "error", message: "Body required" };

  try {
    await createPost({ title, body, userId: 1 });
    return { status: "success", message: `Post "${title}" submitted!`, count: prev.count + 1 };
  } catch {
    return { ...prev, status: "error", message: "Network error" };
  }
}

// ─── Components that read useFormStatus ───────────────────────────────────────
function FieldStatus() {
  const { pending, data } = useFormStatus();

  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#374151" }}>
      <div>
        pending: <Tag color={pending ? "orange" : "default"}>{String(pending)}</Tag>
      </div>
      <div>
        data.title:{" "}
        <span style={{ color: "#1677ff" }}>&quot;{data?.get("title")?.toString() ?? ""}&quot;</span>
      </div>
      <div>
        data.body:{" "}
        <span style={{ color: "#1677ff" }}>
          &quot;{(data?.get("body")?.toString() ?? "").slice(0, 20)}&quot;
        </span>
      </div>
    </div>
  );
}

function SmartInput({
  name,
  label,
  multiline,
}: {
  name: string;
  label: string;
  multiline?: boolean;
}) {
  const { pending } = useFormStatus();
  const style: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d9d9d9",
    fontSize: 13,
    outline: "none",
    background: pending ? "#f5f5f5" : "#fff",
    color: pending ? "#9ca3af" : "#374151",
    resize: multiline ? "vertical" : undefined,
    minHeight: multiline ? 80 : undefined,
    boxSizing: "border-box" as const,
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </label>
      {multiline ? (
        <textarea name={name} disabled={pending} style={style} />
      ) : (
        <input name={name} disabled={pending} style={style} />
      )}
    </div>
  );
}

function ActionButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        padding: "10px 0",
        background: pending ? "#6b7280" : "#1677ff",
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
      {pending ? <LoadingOutlined /> : null}
      {pending ? "Submitting..." : "Submit Post"}
    </button>
  );
}

export default function UseFormStatusAdvancedPage() {
  // useActionState with FormData: the form passes FormData directly to the action
  const [result, dispatch, isPending] = useActionState(submitAction, {
    status: "idle" as const,
    message: "",
    count: 0,
  });

  return (
    <div>
      <PageIntro
        sourcePath="app/react-19/use-form-status/advanced/page.tsx"
        title="useFormStatus"
        level="advanced"
        apiUsed="JSONPlaceholder"
        description="The complete React 19 form pattern: useActionState manages state, the form passes FormData to the action, and useFormStatus reads the pending state from inside every child component without props."
        teaches={[
          "form action={dispatch} passes FormData automatically to useActionState",
          "useFormStatus.data contains the actual FormData being submitted",
          "All three React 19 APIs composing together: use(), useActionState, useFormStatus",
          "FieldStatus reads live FormData during submission for accessing field values mid-flight",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Post Form (React 19 pattern)" style={{ borderRadius: 12 }}>
            {result.status === "success" && (
              <Alert
                type="success"
                title={result.message}
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 12, borderRadius: 8 }}
              />
            )}
            {result.status === "error" && (
              <Alert
                type="error"
                title={result.message}
                showIcon
                icon={<CloseCircleOutlined />}
                style={{ marginBottom: 12, borderRadius: 8 }}
              />
            )}

            {/* form action={dispatch}: useFormStatus inside children reads this */}
            <form action={dispatch}>
              <Space orientation="vertical" style={{ width: "100%" }} size={14}>
                <SmartInput name="title" label="Post Title" />
                <SmartInput name="body" label="Post Body" multiline />
                <ActionButton />
              </Space>
            </form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Space orientation="vertical" style={{ width: "100%" }} size={16}>
            <Card
              title="Live Form Status"
              style={{ borderRadius: 12, border: "1px solid #e0e7ff" }}
            >
              {/* FieldStatus must be INSIDE the form to read its status */}
              {/* We show it here for visibility. In real use it would be inside the form. */}
              <form action={dispatch} style={{ display: "none" }}>
                <FieldStatus />
              </form>
              <div style={{ background: "#f8f9fc", borderRadius: 8, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 8 }}>
                  Form status from useFormStatus:
                </Text>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  <div>
                    isPending:{" "}
                    <Tag color={isPending ? "orange" : "default"}>{String(isPending)}</Tag>
                  </div>
                  <div>
                    status:{" "}
                    <Tag
                      color={
                        result.status === "success"
                          ? "success"
                          : result.status === "error"
                            ? "error"
                            : "default"
                      }
                    >
                      {result.status}
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ borderRadius: 12 }}>
              <Statistic title="Posts submitted this session" value={result.count} />
            </Card>
          </Space>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-form-status" currentLevel="advanced" />
    </div>
  );
}
