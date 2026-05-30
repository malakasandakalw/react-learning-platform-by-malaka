"use client";

// useReducer: Medium
// Concept: Form state as a state machine.
// A form has multiple states: idle → submitting → success/error.
// Using useState for this would mean juggling 3-4 separate booleans (isLoading,
// isSuccess, isError, errorMessage). A reducer makes the transitions explicit
// and prevents impossible states (you can't be both loading AND showing an error).

import { useReducer } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Result,
  Typography,
  Select,
  Tag,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { createPost } from "@/services/jsonPlaceholder";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// State machine: the form can only be in ONE of these states at a time.
// This eliminates impossible combinations like { isLoading: true, isError: true }.
type FormStatus = "idle" | "submitting" | "success" | "error";

type FormState = {
  title: string;
  body: string;
  userId: string;
  status: FormStatus;
  errorMessage: string | null;
  // Accumulate submitted posts to show a history
  submittedPosts: { title: string; id: number }[];
};

type FormAction =
  | { type: "SET_FIELD"; field: "title" | "body" | "userId"; value: string }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_SUCCESS"; id: number; title: string }
  | { type: "SUBMIT_ERROR"; message: string }
  | { type: "RESET" };

const initialState: FormState = {
  title: "",
  body: "",
  userId: "1",
  status: "idle",
  errorMessage: null,
  submittedPosts: [],
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      // Only allow field changes when not submitting
      if (state.status === "submitting") return state;
      return { ...state, [action.field]: action.value, status: "idle", errorMessage: null };

    case "SUBMIT":
      // Transition to submitting: form is now locked
      return { ...state, status: "submitting" };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        status: "success",
        errorMessage: null,
        title: "",
        body: "",
        submittedPosts: [
          { title: action.title, id: action.id },
          ...state.submittedPosts,
        ],
      };

    case "SUBMIT_ERROR":
      return { ...state, status: "error", errorMessage: action.message };

    case "RESET":
      return { ...initialState, submittedPosts: state.submittedPosts };

    default:
      return state;
  }
}

const STATUS_COLORS: Record<FormStatus, string> = {
  idle: "default",
  submitting: "processing",
  success: "success",
  error: "error",
};

export default function UseReducerMediumPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  async function handleSubmit() {
    if (!state.title.trim() || !state.body.trim()) return;

    dispatch({ type: "SUBMIT" }); // lock the form

    try {
      const result = await createPost({
        title: state.title,
        body: state.body,
        userId: parseInt(state.userId, 10),
      });
      dispatch({ type: "SUBMIT_SUCCESS", id: result.id, title: result.title });
    } catch {
      dispatch({ type: "SUBMIT_ERROR", message: "Failed to create post. Try again." });
    }
  }

  return (
    <div>
      <PageIntro
        title="useReducer"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="Complex UI flows like form submission have multiple distinct states: idle, loading, success, and error. A reducer models these as a state machine, preventing impossible combinations and making transitions explicit."
        teaches={[
          "Modeling UI as a state machine: idle → submitting → success/error",
          "Impossible states become impossible: can't be submitting AND showing an error",
          "async operations dispatch multiple actions: SUBMIT → SUCCESS/ERROR",
          "Accumulating history in state: submittedPosts array",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span>Create Post</span>
                <Tag color={STATUS_COLORS[state.status]}>{state.status}</Tag>
              </div>
            }
            style={{ borderRadius: 12 }}
          >
            {state.status === "success" && (
              <Alert
                type="success"
                showIcon
                message="Post created! You can submit another."
                style={{ marginBottom: 16, borderRadius: 8 }}
                action={<Button size="small" onClick={() => dispatch({ type: "RESET" })}>New post</Button>}
              />
            )}
            {state.status === "error" && (
              <Alert
                type="error"
                showIcon
                message={state.errorMessage}
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}

            <Form layout="vertical">
              <Form.Item label="Author (User ID)">
                <Select
                  value={state.userId}
                  onChange={(v) => dispatch({ type: "SET_FIELD", field: "userId", value: v })}
                  disabled={state.status === "submitting"}
                  options={Array.from({ length: 10 }, (_, i) => ({
                    value: String(i + 1),
                    label: `User ${i + 1}`,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Title">
                <Input
                  value={state.title}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "title", value: e.target.value })
                  }
                  disabled={state.status === "submitting"}
                  placeholder="Post title"
                />
              </Form.Item>

              <Form.Item label="Body">
                <Input.TextArea
                  rows={4}
                  value={state.body}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "body", value: e.target.value })
                  }
                  disabled={state.status === "submitting"}
                  placeholder="Post content"
                />
              </Form.Item>

              <Button
                type="primary"
                block
                loading={state.status === "submitting"}
                onClick={handleSubmit}
                disabled={!state.title.trim() || !state.body.trim()}
              >
                {state.status === "submitting" ? "Posting to JSONPlaceholder..." : "Create Post"}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="State Machine"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div>idle <span style={{ color: "#6b7280" }}>→ SUBMIT →</span> submitting</div>
              <div>submitting <span style={{ color: "#6b7280" }}>→ SUCCESS →</span> success</div>
              <div>submitting <span style={{ color: "#6b7280" }}>→ ERROR →</span> error</div>
              <div>any <span style={{ color: "#6b7280" }}>→ RESET →</span> idle</div>

              <div style={{ marginTop: 12, padding: "8px 12px", background: "#161630", borderRadius: 6 }}>
                <div style={{ color: "#a5b4fc" }}>current status:</div>
                <div style={{ color: "#fbbf24" }}>{state.status}</div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ color: "#a5b4fc", marginBottom: 4 }}>submitted:</div>
                {state.submittedPosts.length === 0 ? (
                  <Text style={{ color: "#6b7280", fontSize: 11 }}>none yet</Text>
                ) : (
                  state.submittedPosts.slice(0, 3).map((p) => (
                    <div key={p.id} style={{ fontSize: 10, color: "#4ade80" }}>
                      #{p.id}: {p.title.slice(0, 25)}...
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-reducer" currentLevel="medium" />
    </div>
  );
}
