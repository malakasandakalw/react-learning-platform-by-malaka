"use client";

// Patterns: Error Boundaries (Advanced)
// Concept: Multiple scoped boundaries with different recovery strategies.
// Critical sections (payment, auth) use strict boundaries that stop the app.
// Non-critical sections (recommendations, ads) use lenient boundaries that hide silently.

import { Component, useState } from "react";
import { Button, Card, Col, Row, Tag, Typography, Space, Alert, Switch } from "antd";
import { BugOutlined, WarningOutlined, CloseCircleOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// Critical boundary: shows blocking error
class CriticalBoundary extends Component<
  { children: React.ReactNode; section: string },
  { hasError: boolean; error: string }
> {
  state = { hasError: false, error: "" };

  static getDerivedStateFromError(e: Error) {
    return { hasError: true, error: e.message };
  }

  render() {
    if (this.state.hasError)
      return (
        <Alert
          type="error"
          showIcon
          message={`Critical Error: ${this.props.section} unavailable`}
          description={
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{this.state.error}</span>
          }
          style={{ borderRadius: 8 }}
        />
      );
    return this.props.children;
  }
}

// Silent boundary: hides non-critical errors
class SilentBoundary extends Component<
  { children: React.ReactNode; section: string },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(e: Error) {
    console.warn(`[Silent:${this.props.section}]`, e.message);
  }

  render() {
    if (this.state.hasError) return null; // Render nothing (non-critical)
    return this.props.children;
  }
}

// ─── Test components ──────────────────────────────────────────────────────────
function PaymentWidget({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) throw new Error("PaymentService: connection refused");
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16 }}>
      <Text type="secondary">💳 Payment form ready</Text>
    </div>
  );
}

function RecommendationsWidget({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) throw new Error("RecommendationEngine: model timeout");
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16 }}>
      <Text type="secondary">🎯 Recommended for you</Text>
    </div>
  );
}

function UserProfileWidget({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) throw new Error("ProfileService: 503");
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16 }}>
      <Text type="secondary">👤 User profile loaded</Text>
    </div>
  );
}

export default function ErrorBoundaryAdvancedPage() {
  const [failPayment, setFailPayment] = useState(false);
  const [failRec, setFailRec] = useState(false);
  const [failProfile, setFailProfile] = useState(false);
  const [keys, setKeys] = useState({ payment: 0, rec: 0, profile: 0 });

  function crash(which: keyof typeof keys, setter: (v: boolean) => void) {
    setter(true);
    setKeys((k) => ({ ...k, [which]: k[which] + 1 }));
  }

  function fix(which: keyof typeof keys, setter: (v: boolean) => void) {
    setter(false);
    setKeys((k) => ({ ...k, [which]: k[which] + 1 }));
  }

  return (
    <div>
      <PageIntro
        title="Error Boundaries"
        level="advanced"
        description="Different sections need different recovery strategies. Critical sections (payment) use CriticalBoundary, which shows a highly visible error the user must act on. Non-critical sections (recommendations) use SilentBoundary, which hides and logs the error without disrupting the user."
        teaches={[
          "CriticalBoundary: blocks the section with a visible error the user must acknowledge",
          "SilentBoundary: renders null and hides the error, logging it to console/monitoring",
          "Match boundary severity to section importance",
          "Key-based remounting resets the child after fixing the error",
        ]}
      />

      <Row gutter={[16, 16]}>
        {/* CRITICAL: payment */}
        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <Tag color="red">Critical</Tag>
                <span>Payment</span>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <CriticalBoundary section="Payment" key={keys.payment}>
              <PaymentWidget shouldFail={failPayment} />
            </CriticalBoundary>
            <Button
              size="small"
              danger={!failPayment}
              style={{ marginTop: 12 }}
              onClick={() =>
                failPayment ? fix("payment", setFailPayment) : crash("payment", setFailPayment)
              }
            >
              {failPayment ? "Fix" : "Crash"} Payment
            </Button>
          </Card>
        </Col>

        {/* SILENT: recommendations */}
        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <Tag color="blue">Silent</Tag>
                <span>Recommendations</span>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            {failRec && (
              <Alert
                type="warning"
                showIcon
                title="Component errored silently (check console)"
                style={{ marginBottom: 8, borderRadius: 6 }}
              />
            )}
            <SilentBoundary section="Recommendations" key={keys.rec}>
              <RecommendationsWidget shouldFail={failRec} />
            </SilentBoundary>
            <Button
              size="small"
              style={{ marginTop: 12 }}
              onClick={() => (failRec ? fix("rec", setFailRec) : crash("rec", setFailRec))}
            >
              {failRec ? "Fix" : "Crash"} Recommendations
            </Button>
          </Card>
        </Col>

        {/* CRITICAL: profile */}
        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <Tag color="orange">Critical</Tag>
                <span>Profile</span>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <CriticalBoundary section="Profile" key={keys.profile}>
              <UserProfileWidget shouldFail={failProfile} />
            </CriticalBoundary>
            <Button
              size="small"
              danger={!failProfile}
              style={{ marginTop: 12 }}
              onClick={() =>
                failProfile ? fix("profile", setFailProfile) : crash("profile", setFailProfile)
              }
            >
              {failProfile ? "Fix" : "Crash"} Profile
            </Button>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/error-boundary" currentLevel="advanced" />
    </div>
  );
}
