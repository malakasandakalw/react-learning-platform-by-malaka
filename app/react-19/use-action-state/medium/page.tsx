"use client";

// React 19: useActionState Medium
// Concept: Form submission with useActionState.
// The action receives form data, validates it, calls an API, and returns
// a result state that includes success/errors. No useState for loading,
// no useState for error messages: it all lives in the action state.

import { useActionState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row, Select, Typography, Tag, Result } from "antd";
import { createPost } from "@/services/jsonPlaceholder";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type FormState = {
  status: "idle" | "success" | "error";
  errors: Partial<Record<"title" | "body" | "userId", string>>;
  created: { id: number; title: string } | null;
  submittedCount: number;
};

const initial: FormState = {
  status: "idle",
  errors: {},
  created: null,
  submittedCount: 0,
};

// The action receives current state + form payload
async function submitPostAction(
  state: FormState,
  payload: { title: string; body: string; userId: string }
): Promise<FormState> {
  const errors: FormState["errors"] = {};

  if (!payload.title.trim()) errors.title = "Title is required";
  if (payload.body.trim().length < 10) errors.body = "Body must be at least 10 characters";
  if (!payload.userId) errors.userId = "Select an author";

  if (Object.keys(errors).length > 0) {
    return { ...state, status: "error", errors, created: null };
  }

  try {
    const result = await createPost({
      title: payload.title,
      body: payload.body,
      userId: parseInt(payload.userId, 10),
    });
    return {
      status: "success",
      errors: {},
      created: { id: result.id, title: result.title },
      submittedCount: state.submittedCount + 1,
    };
  } catch {
    return {
      ...state,
      status: "error",
      errors: { title: "Server error. Please try again." },
      created: null,
    };
  }
}

export default function UseActionStateMediumPage() {
  const [state, dispatch, isPending] = useActionState(submitPostAction, initial);

  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [userId, setUserId] = React.useState("");

  function handleSubmit() {
    dispatch({ title, body, userId });
  }

  function handleReset() {
    setTitle("");
    setBody("");
    setUserId("");
    dispatch({ title: "__reset__", body: "", userId: "" });
  }

  if (state.status === "success" && state.created) {
    return (
      <div>
        <PageIntro
          sourcePath="app/react-19/use-action-state/medium/page.tsx"
          title="useActionState"
          level="medium"
          apiUsed="JSONPlaceholder"
          description="Form submission with useActionState. The action validates, calls the API, and returns the result state. One function handles the entire lifecycle."
          teaches={[
            "Action handles validation + API call + error state in one function",
            "State shape: { status, errors, created } replaces multiple useState calls",
            "isPending: true while the async action runs, with no manual flag needed",
            "The action accumulates state: submittedCount tracks total submissions",
          ]}
        />
        <Result
          status="success"
          title={`Post #${state.created.id} Created!`}
          subTitle={`"${state.created.title}" (Total submitted: ${state.submittedCount})`}
          extra={<Button onClick={handleReset}>Submit Another</Button>}
        />
        <LevelNavigator basePath="/react-19/use-action-state" currentLevel="medium" />
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/react-19/use-action-state/medium/page.tsx"
        title="useActionState"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="Form submission with useActionState. The action validates, calls the API, and returns the result state. One function handles the entire lifecycle."
        teaches={[
          "Action handles validation + API call + error state in one function",
          "State shape: { status, errors, created } replaces multiple useState calls",
          "isPending: true while the async action runs, with no manual flag needed",
          "The action accumulates state: submittedCount tracks total submissions",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Create Post" style={{ borderRadius: 12 }}>
            <Form layout="vertical">
              <Form.Item
                label="Author"
                validateStatus={state.errors.userId ? "error" : ""}
                help={state.errors.userId}
              >
                <Select
                  value={userId || undefined}
                  onChange={setUserId}
                  placeholder="Select author"
                  disabled={isPending}
                  options={Array.from({ length: 5 }, (_, i) => ({
                    value: String(i + 1),
                    label: `User ${i + 1}`,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Title"
                validateStatus={state.errors.title ? "error" : ""}
                help={state.errors.title}
              >
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isPending}
                  placeholder="Post title"
                />
              </Form.Item>

              <Form.Item
                label="Body"
                validateStatus={state.errors.body ? "error" : ""}
                help={state.errors.body}
              >
                <Input.TextArea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isPending}
                  placeholder="At least 10 characters"
                />
              </Form.Item>

              <Button type="primary" block loading={isPending} onClick={handleSubmit}>
                {isPending ? "Posting..." : "Submit Post"}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Action State"
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
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div>
                <span style={{ color: "#569cd6" }}>status: </span>
                <Tag
                  color={state.status === "error" ? "error" : "default"}
                  style={{ fontSize: 10 }}
                >
                  {state.status}
                </Tag>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#ce9178" : "#b5cea8" }}>
                  {String(isPending)}
                </span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>submittedCount: </span>
                <span style={{ color: "#b5cea8" }}>{state.submittedCount}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>errors: </span>
                <span style={{ color: "#d4d4d4" }}>{JSON.stringify(state.errors)}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-action-state" currentLevel="medium" />
    </div>
  );
}

// React must be in scope for JSX (TypeScript rule)
import React from "react";
