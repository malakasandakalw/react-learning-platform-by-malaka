"use client";

// Patterns: Compound Components (Advanced)
// Concept: FlexCard with variant-aware sub-components.
// The variant prop on the root propagates via Context to Header, Footer, and Badge,
// each sub-component derives its own styles without receiving variant as a prop.
// Advanced aspects: optional sub-components, Context as a theming channel, dot notation.

import { createContext, useContext } from "react";
import { Col, Row, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title, Paragraph } = Typography;

// ─── Card Context ──────────────────────────────────────────────────────────────
type CardVariant = "default" | "success" | "warning" | "error" | "info";

type FlexCardContextValue = { variant: CardVariant };
const FlexCardContext = createContext<FlexCardContextValue>({ variant: "default" });

const VARIANT_CONFIG: Record<
  CardVariant,
  { bg: string; border: string; accent: string; icon: React.ReactNode; tagColor: string }
> = {
  default: {
    bg: "#ffffff",
    border: "#d9d9d9",
    accent: "rgba(0,0,0,0.88)",
    icon: <InfoCircleOutlined />,
    tagColor: "default",
  },
  success: {
    bg: "#f6ffed",
    border: "#b7eb8f",
    accent: "rgba(0,0,0,0.88)",
    icon: <CheckCircleOutlined />,
    tagColor: "success",
  },
  warning: {
    bg: "#fffbe6",
    border: "#ffe58f",
    accent: "rgba(0,0,0,0.88)",
    icon: <WarningOutlined />,
    tagColor: "warning",
  },
  error: {
    bg: "#fff2f0",
    border: "#ffccc7",
    accent: "rgba(0,0,0,0.88)",
    icon: <CloseCircleOutlined />,
    tagColor: "error",
  },
  info: {
    bg: "#e6f4ff",
    border: "#91caff",
    accent: "rgba(0,0,0,0.88)",
    icon: <InfoCircleOutlined />,
    tagColor: "processing",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function FlexCardRoot({
  variant = "default",
  children,
}: {
  variant?: CardVariant;
  children: React.ReactNode;
}) {
  const cfg = VARIANT_CONFIG[variant];
  return (
    <FlexCardContext.Provider value={{ variant }}>
      <div
        style={{
          border: `1.5px solid ${cfg.border}`,
          borderRadius: 12,
          background: cfg.bg,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </FlexCardContext.Provider>
  );
}

function FlexCardHeader({ children }: { children: React.ReactNode }) {
  const { variant } = useContext(FlexCardContext);
  const cfg = VARIANT_CONFIG[variant];
  return (
    <div
      style={{
        padding: "11px 16px",
        borderBottom: `1px solid ${cfg.border}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: cfg.accent,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {cfg.icon}
      {children}
    </div>
  );
}

function FlexCardBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "14px 16px" }}>{children}</div>;
}

function FlexCardFooter({ children }: { children: React.ReactNode }) {
  const { variant } = useContext(FlexCardContext);
  const cfg = VARIANT_CONFIG[variant];
  return (
    <div
      style={{
        padding: "9px 16px",
        borderTop: `1px solid ${cfg.border}`,
        background: "rgba(0,0,0,0.02)",
        fontSize: 12,
        color: "rgba(0,0,0,0.65)",
      }}
    >
      {children}
    </div>
  );
}

function FlexCardBadge({ children }: { children: React.ReactNode }) {
  const { variant } = useContext(FlexCardContext);
  return (
    <Tag color={VARIANT_CONFIG[variant].tagColor} style={{ fontSize: 11, margin: 0 }}>
      {children}
    </Tag>
  );
}

// ─── Dot notation API ─────────────────────────────────────────────────────────
const FlexCard = Object.assign(FlexCardRoot, {
  Header: FlexCardHeader,
  Body: FlexCardBody,
  Footer: FlexCardFooter,
  Badge: FlexCardBadge,
});

export default function CompoundComponentsAdvancedPage() {
  return (
    <div>
      <PageIntro
        title="Compound Components"
        level="advanced"
        description="FlexCard propagates a variant through Context so every sub-component (Header icon, Footer border, Badge color) reacts automatically with no variant prop threaded through each one. Footer is optional: omit it and it simply does not render."
        teaches={[
          "Context as a theming channel: variant on root reaches Header, Footer, and Badge without prop drilling",
          "Optional sub-components: FlexCard.Footer only renders when the consumer includes it",
          "Dot notation API assembled via Object.assign(Root, { Header, Body, Footer, Badge })",
          "VARIANT_CONFIG lookup table: derives all styles from a single string variant",
        ]}
      />

      <Row gutter={[20, 20]}>
        {/* Live demos of all variants */}
        {(["default", "success", "warning", "error", "info"] as CardVariant[]).map((variant) => (
          <Col xs={24} sm={12} lg={8} key={variant}>
            <FlexCard variant={variant}>
              <FlexCard.Header>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}{" "}
                <FlexCard.Badge>{variant}</FlexCard.Badge>
              </FlexCard.Header>
              <FlexCard.Body>
                <Paragraph style={{ fontSize: 13, margin: 0 }}>
                  Header icon, border, and Badge color all derive from{" "}
                  <code>variant=&quot;{variant}&quot;</code> via Context with zero extra props on
                  sub-components.
                </Paragraph>
              </FlexCard.Body>
              {variant !== "warning" && (
                <FlexCard.Footer>
                  {variant === "default" && "No status"}
                  {variant === "success" && "✓ All checks passed"}
                  {variant === "error" && "✗ Action required"}
                  {variant === "info" && "ℹ Read the docs →"}
                </FlexCard.Footer>
              )}
            </FlexCard>
          </Col>
        ))}

        {/* Pattern explainer card */}
        <Col xs={24} lg={16}>
          <div
            style={{
              background: "#1e1e1e",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Title level={5} style={{ color: "#d4d4d4", margin: "0 0 14px" }}>
              Dot notation API
            </Title>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 1.9,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#6a9955" }}>
                {"// Object.assign attaches sub-components as static properties:"}
              </div>
              <div style={{ color: "#6a9955" }}>
                {"// const FlexCard = Object.assign(FlexCardRoot, { Header, Body, Footer, Badge })"}
              </div>
              <br />
              <div>{'<FlexCard variant="success">'}</div>
              <div style={{ paddingLeft: 16 }}>{"<FlexCard.Header>"}</div>
              <div style={{ paddingLeft: 32 }}>
                {"Title <FlexCard.Badge>Active</FlexCard.Badge>"}
              </div>
              <div style={{ paddingLeft: 16 }}>{"</FlexCard.Header>"}</div>
              <div style={{ paddingLeft: 16, color: "#ce9178" }}>
                {"<FlexCard.Body>...content...</FlexCard.Body>"}
              </div>
              <div style={{ paddingLeft: 16, color: "#569cd6" }}>
                {"<FlexCard.Footer>optional footer</FlexCard.Footer>"}
              </div>
              <div style={{ color: "#6a9955" }}>{"// ↑ omit Footer and it won't render"}</div>
              <div>{"</FlexCard>"}</div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: 20,
              border: "1.5px solid #f0f0f0",
              height: "100%",
            }}
          >
            <Title level={5} style={{ margin: "0 0 14px" }}>
              Why Context here?
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <div>
                <Text strong>Without Context:</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  You would write <code>variant</code> on every sub-component. FlexCard.Header,
                  FlexCard.Footer, FlexCard.Badge.
                </Text>
              </div>
              <div>
                <Text strong>With Context:</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Set it once on <code>{"<FlexCard>"}</code>. Every sub-component picks it up
                  automatically. To add a new sub-component, just call{" "}
                  <code>useContext(FlexCardContext)</code>.
                </Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/compound-components" currentLevel="advanced" />
    </div>
  );
}
