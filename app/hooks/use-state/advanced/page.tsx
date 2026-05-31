"use client";

// useState: Advanced
// Concept: Complex state with arrays, nested objects, and lazy initialization.
// This is a multi-step onboarding wizard. State holds the entire wizard data
// including which step is active, all field values, and per-step completion flags.
//
// Key patterns shown:
// - Lazy initialization: useState(() => computeExpensive()) runs only once
// - Updating array state: always map/filter, never mutate in place
// - State shape design: keeping related data together vs. splitting it

import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Steps,
  Tag,
  Typography,
  Select,
  Checkbox,
  Space,
  Result,
  Divider,
} from "antd";
import { UserOutlined, SettingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Title, Text, Paragraph } = Typography;

type Skill = { id: string; label: string; selected: boolean };
type NotifPref = { type: string; enabled: boolean };

type WizardState = {
  currentStep: number;
  profile: { name: string; bio: string; role: string };
  // Array state: each skill tracks its own selected flag
  skills: Skill[];
  notifications: NotifPref[];
  completed: boolean;
};

// Lazy initialization: the function passed to useState is called only once on mount.
// Use this when the initial value is expensive to compute (e.g. parsing localStorage,
// doing calculations). If you write useState(computeExpensive()), it runs on every render.
function buildInitialState(): WizardState {
  return {
    currentStep: 0,
    profile: { name: "", bio: "", role: "" },
    skills: [
      { id: "react", label: "React", selected: false },
      { id: "ts", label: "TypeScript", selected: false },
      { id: "nextjs", label: "Next.js", selected: false },
      { id: "redux", label: "Redux", selected: false },
      { id: "css", label: "CSS", selected: false },
      { id: "testing", label: "Testing", selected: false },
    ],
    notifications: [
      { type: "Email updates", enabled: true },
      { type: "Push notifications", enabled: false },
      { type: "Weekly digest", enabled: true },
    ],
    completed: false,
  };
}

export default function UseStateAdvancedPage() {
  // Lazy initialization: pass a function, not a value
  const [wizard, setWizard] = useState<WizardState>(buildInitialState);

  // Helper to update a nested slice of state while preserving everything else.
  // This is the pattern for updating one field inside a nested object.
  function updateProfile(field: keyof WizardState["profile"], value: string) {
    setWizard((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  }

  // Updating array state: map over items, toggle the matching one.
  // NEVER do: wizard.skills[i].selected = true (that mutates state directly).
  function toggleSkill(id: string) {
    setWizard((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)),
    }));
  }

  function toggleNotification(type: string) {
    setWizard((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.type === type ? { ...n, enabled: !n.enabled } : n
      ),
    }));
  }

  function goToStep(step: number) {
    setWizard((prev) => ({ ...prev, currentStep: step }));
  }

  function handleComplete() {
    setWizard((prev) => ({ ...prev, completed: true }));
  }

  function handleReset() {
    // Reset to initial state using the same lazy initializer
    setWizard(buildInitialState());
  }

  if (wizard.completed) {
    return (
      <div>
        <PageIntro
          sourcePath="app/hooks/use-state/advanced/page.tsx"
          title="useState"
          level="advanced"
          description="Complex state management with nested objects, arrays, and lazy initialization."
          teaches={[
            "Lazy initialization: useState(() => fn()) runs only once",
            "Updating nested objects: always spread at every level",
            "Updating arrays: map/filter, never mutate",
            "Designing state shape to minimize update complexity",
          ]}
        />
        <Result
          status="success"
          title="Profile Complete!"
          subTitle={`Welcome, ${wizard.profile.name || "teammate"}!`}
          extra={[
            <div key="summary" style={{ textAlign: "left", maxWidth: 400, margin: "0 auto 16px" }}>
              <Text strong>Role: </Text>
              <Tag color="blue">{wizard.profile.role || "None"}</Tag>
              <br />
              <br />
              <Text strong>Skills: </Text>
              <Space wrap size={4} style={{ marginTop: 4 }}>
                {wizard.skills
                  .filter((s) => s.selected)
                  .map((s) => (
                    <Tag key={s.id} color="blue">
                      {s.label}
                    </Tag>
                  ))}
              </Space>
            </div>,
            <Button key="reset" onClick={handleReset}>
              Start Over
            </Button>,
          ]}
        />
        <LevelNavigator basePath="/hooks/use-state" currentLevel="advanced" />
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/hooks/use-state/advanced/page.tsx"
        title="useState"
        level="advanced"
        description="Complex state management with nested objects, arrays, and lazy initialization."
        teaches={[
          "Lazy initialization: useState(() => fn()) runs only once",
          "Updating nested objects: always spread at every level",
          "Updating arrays: map/filter, never mutate",
          "Designing state shape to minimize update complexity",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card style={{ borderRadius: 12 }}>
            <Steps
              current={wizard.currentStep}
              items={[
                { title: "Profile", icon: <UserOutlined /> },
                { title: "Skills", icon: <CheckCircleOutlined /> },
                { title: "Preferences", icon: <SettingOutlined /> },
              ]}
              style={{ marginBottom: 32 }}
            />

            {/* Step 0: Profile */}
            {wizard.currentStep === 0 && (
              <div>
                <Title level={5}>Your Profile</Title>
                <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                  <Input
                    placeholder="Full name"
                    value={wizard.profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    prefix={<UserOutlined />}
                  />
                  <Select
                    placeholder="Your role"
                    style={{ width: "100%" }}
                    value={wizard.profile.role || undefined}
                    onChange={(val) => updateProfile("role", val)}
                    options={[
                      { value: "Frontend Developer", label: "Frontend Developer" },
                      { value: "Backend Developer", label: "Backend Developer" },
                      { value: "Full Stack Developer", label: "Full Stack Developer" },
                    ]}
                  />
                  <Input.TextArea
                    placeholder="Short bio (optional)"
                    rows={3}
                    value={wizard.profile.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                  />
                </Space>
                <Button
                  type="primary"
                  style={{ marginTop: 20 }}
                  onClick={() => goToStep(1)}
                  disabled={!wizard.profile.name || !wizard.profile.role}
                >
                  Next: Skills
                </Button>
              </div>
            )}

            {/* Step 1: Skills */}
            {wizard.currentStep === 1 && (
              <div>
                <Title level={5}>Select Your Skills</Title>
                <Paragraph type="secondary">Pick all that apply</Paragraph>
                <Row gutter={[8, 8]}>
                  {wizard.skills.map((skill) => (
                    <Col key={skill.id}>
                      {/* Clicking a skill calls toggleSkill, which maps over the array */}
                      <Tag
                        style={{
                          cursor: "pointer",
                          fontSize: 13,
                          padding: "4px 12px",
                          borderRadius: 20,
                        }}
                        color={skill.selected ? "purple" : "default"}
                        onClick={() => toggleSkill(skill.id)}
                      >
                        {skill.selected && "✓ "}
                        {skill.label}
                      </Tag>
                    </Col>
                  ))}
                </Row>
                <Space style={{ marginTop: 20 }}>
                  <Button onClick={() => goToStep(0)}>Back</Button>
                  <Button
                    type="primary"
                    onClick={() => goToStep(2)}
                    disabled={!wizard.skills.some((s) => s.selected)}
                  >
                    Next: Preferences
                  </Button>
                </Space>
              </div>
            )}

            {/* Step 2: Preferences */}
            {wizard.currentStep === 2 && (
              <div>
                <Title level={5}>Notification Preferences</Title>
                <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                  {wizard.notifications.map((notif) => (
                    <div
                      key={notif.type}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        background: "#f8f9fc",
                        borderRadius: 8,
                      }}
                    >
                      <Text>{notif.type}</Text>
                      <Checkbox
                        checked={notif.enabled}
                        onChange={() => toggleNotification(notif.type)}
                      />
                    </div>
                  ))}
                </Space>
                <Space style={{ marginTop: 20 }}>
                  <Button onClick={() => goToStep(1)}>Back</Button>
                  <Button type="primary" onClick={handleComplete}>
                    Complete Setup
                  </Button>
                </Space>
              </div>
            )}
          </Card>
        </Col>

        {/* State shape viewer */}
        <Col xs={24} lg={9}>
          <Card
            title="State Shape"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#d4d4d4" }}>
              <div style={{ color: "#569cd6" }}>
                currentStep: <span style={{ color: "#b5cea8" }}>{wizard.currentStep}</span>
              </div>
              <Divider style={{ borderColor: "#333", margin: "8px 0" }} />
              <div style={{ color: "#569cd6" }}>profile:</div>
              <pre style={{ margin: "0 0 0 8px", lineHeight: 1.7, color: "#d4d4d4" }}>
                {JSON.stringify(wizard.profile, null, 2)}
              </pre>
              <Divider style={{ borderColor: "#333", margin: "8px 0" }} />
              <div style={{ color: "#569cd6" }}>skills selected:</div>
              <div style={{ marginLeft: 8 }}>
                {wizard.skills
                  .filter((s) => s.selected)
                  .map((s) => (
                    <Tag key={s.id} color="blue" style={{ marginTop: 4 }}>
                      {s.label}
                    </Tag>
                  ))}
                {!wizard.skills.some((s) => s.selected) && (
                  <span style={{ color: "#6a9955" }}>none</span>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-state" currentLevel="advanced" />
    </div>
  );
}
