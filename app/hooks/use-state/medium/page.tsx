"use client";

// useState: Medium
// Concept: State can hold objects, not just primitives.
// When state is an object, you must spread the existing state when updating a single field.
// This page shows a real registration form where each field is tracked in state,
// with live inline validation triggered on blur (when the user leaves a field).

import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Alert,
  Divider,
  Tag,
  Result,
} from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// The form state is a single object: each field is a key.
// This mirrors how you would manage forms in real apps before reaching for form libraries.
type FormData = {
  name: string;
  email: string;
  role: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

// Validation lives outside the component so it is not recreated on every render.
function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.includes("@")) errors.email = "Enter a valid email";
  if (!data.role) errors.role = "Please select a role";
  if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}

export default function UseStateMediumPage() {
  // One state object for all field values
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  // Separate state for which fields have been touched (user has visited & left)
  // Only show errors for touched fields (better UX than showing all errors upfront).
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const [submitted, setSubmitted] = useState(false);

  // Derived state: no useState needed, compute from existing state.
  const errors = validate(formData);
  const isValid = Object.keys(errors).length === 0;

  // Generic field updater: spreads existing state and overwrites only the changed field.
  // This pattern avoids writing a separate handler for every input.
  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof FormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit() {
    // Mark all fields as touched to surface all errors on submit
    setTouched({ name: true, email: true, role: true, password: true });
    if (isValid) setSubmitted(true);
  }

  function handleReset() {
    setFormData({ name: "", email: "", role: "", password: "" });
    setTouched({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div>
        <PageIntro
          sourcePath="app/hooks/use-state/medium/page.tsx"
          title="useState"
          level="medium"
          description="State can hold complex objects. When you need to update one field of an object, always spread the rest to avoid losing data."
          teaches={[
            "Managing multiple form fields in a single state object",
            "Spreading existing state when updating one field",
            "Tracking which fields are 'touched' to control error visibility",
            "Derived state: computing values from existing state without extra useState",
          ]}
        />
        <Result
          status="success"
          title="Registration Complete!"
          subTitle={
            <span>
              <Text strong>{formData.name}</Text>
              {" · "}
              <Text type="secondary">{formData.email}</Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {formData.role}
              </Tag>
            </span>
          }
          extra={[
            <Button key="reset" onClick={handleReset}>
              Register another
            </Button>,
          ]}
        />
        <LevelNavigator basePath="/hooks/use-state" currentLevel="medium" />
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/hooks/use-state/medium/page.tsx"
        title="useState"
        level="medium"
        description="State can hold complex objects. When you need to update one field of an object, always spread the rest to avoid losing data."
        teaches={[
          "Managing multiple form fields in a single state object",
          "Spreading existing state when updating one field",
          "Tracking which fields are 'touched' to control error visibility",
          "Derived state: computing values from existing state without extra useState",
        ]}
      />

      <Row gutter={[24, 0]}>
        <Col xs={24} lg={14}>
          <Card title="Registration Form" style={{ borderRadius: 12 }}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Full Name"
                validateStatus={touched.name && errors.name ? "error" : ""}
                help={touched.name && errors.name}
              >
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Jane Smith"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={touched.email && errors.email}
              >
                <Input
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="jane@example.com"
                />
              </Form.Item>

              <Form.Item
                label="Role"
                validateStatus={touched.role && errors.role ? "error" : ""}
                help={touched.role && errors.role}
              >
                <Select
                  value={formData.role || undefined}
                  onChange={(val) => {
                    handleChange("role", val);
                    handleBlur("role");
                  }}
                  placeholder="Select your role"
                  options={[
                    { value: "frontend", label: "Frontend Developer" },
                    { value: "backend", label: "Backend Developer" },
                    { value: "fullstack", label: "Full Stack Developer" },
                    { value: "designer", label: "UI/UX Designer" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={touched.password && errors.password ? "error" : ""}
                help={touched.password && errors.password}
              >
                <Input.Password
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="At least 8 characters"
                />
              </Form.Item>

              <Button type="primary" block onClick={handleSubmit} size="large">
                Register
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Live state inspector: helps readers see exactly what is in state */}
        <Col xs={24} lg={10}>
          <Card
            title="Live State Inspector"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <div style={{ color: "#6a9955", marginBottom: 8 }}>// formData state</div>
              <pre style={{ color: "#d4d4d4", margin: 0, lineHeight: 1.8 }}>
                {JSON.stringify(formData, null, 2)}
              </pre>
              <Divider style={{ borderColor: "#333", margin: "12px 0" }} />
              <div style={{ color: "#6a9955", marginBottom: 8 }}>// touched state</div>
              <pre style={{ color: "#d4d4d4", margin: 0, lineHeight: 1.8 }}>
                {JSON.stringify(touched, null, 2)}
              </pre>
              <Divider style={{ borderColor: "#333", margin: "12px 0" }} />
              <div style={{ color: "#6a9955", marginBottom: 8 }}>// isValid (derived)</div>
              <span style={{ color: isValid ? "#b5cea8" : "#ce9178" }}>{String(isValid)}</span>
            </div>
          </Card>
        </Col>
      </Row>

      {!isValid && Object.keys(touched).length > 0 && (
        <Alert
          type="warning"
          showIcon
          title="Fix the errors above before submitting"
          style={{ marginTop: 16, borderRadius: 8 }}
        />
      )}

      <LevelNavigator basePath="/hooks/use-state" currentLevel="medium" />
    </div>
  );
}
