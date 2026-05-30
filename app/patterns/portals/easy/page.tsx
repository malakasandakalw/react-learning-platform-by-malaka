"use client";

// Patterns: Portals (Easy)
// Concept: createPortal(children, domNode) renders children into a DIFFERENT
// DOM node than the component's parent. The component stays in the React tree
// (events bubble normally) but the DOM output appears elsewhere.
//
// Why this matters: modals, tooltips, and dropdowns often need to escape
// their parent's overflow:hidden or z-index stacking context.
// Without portals: the modal clips inside its container.
// With portals: the modal renders directly in document.body.

import { createPortal } from "react-dom";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Space,
  Alert,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── Modal rendered via portal ────────────────────────────────────────────────
// Even though <Modal> is called inside a deeply nested component,
// its DOM output appears in document.body, outside all parent containers.
function Modal({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return createPortal(
    // This JSX renders in document.body, not in the parent's DOM tree
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 28,
          minWidth: 360,
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>{title}</Text>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <CloseOutlined />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body // ← the portal target: renders OUTSIDE the component's DOM parent
  );
}

// ─── Container with overflow:hidden ───────────────────────────────────────────
// Without a portal: a modal inside this box would be clipped.
// With a portal: the modal escapes to document.body.
function ClippedContainer({ usePortal }: { usePortal: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        overflow: "hidden", // This would clip a non-portal modal
        border: "2px dashed #e5e7eb",
        borderRadius: 8,
        padding: 20,
        position: "relative",
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text type="secondary" style={{ fontSize: 11, position: "absolute", top: 6, left: 10 }}>
        overflow: hidden container
      </Text>

      <Button onClick={() => setOpen(true)} type={usePortal ? "primary" : "default"}>
        {usePortal ? "Open Portal Modal" : "Open Inline (clipped)"}
      </Button>

      {/* Without portal: rendered inside this overflow:hidden div and would clip */}
      {!usePortal && open && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Clipped modal :(</Text>
            <Button size="small" onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* With portal: rendered in document.body and not clipped */}
      {usePortal && open && (
        <Modal title="Portal Modal" onClose={() => setOpen(false)}>
          <Text>This modal renders in <code>document.body</code>, not inside the overflow:hidden container. It can cover the full screen.</Text>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button type="primary" onClick={() => setOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function PortalsEasyPage() {
  return (
    <div>
      <PageIntro
        title="Portals"
        level="easy"
        description="createPortal renders children into a different DOM node than their component's parent. The component stays in the React tree (events still bubble), but the DOM output escapes parent overflow and z-index constraints."
        teaches={[
          "createPortal(children, domNode): renders into any DOM node",
          "The portal stays in the React tree: context, events, and refs all work",
          "Use document.body as target to escape overflow:hidden parents",
          "Without portal: modal clips inside container. With portal: modal covers the screen.",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Without Portal (clips inside container)" style={{ borderRadius: 12 }}>
            <ClippedContainer usePortal={false} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="With Portal (renders in document.body)" style={{ borderRadius: 12 }}>
            <ClippedContainer usePortal={true} />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 24, borderRadius: 12, background: "#0f0f23", border: "none" }}
        styles={{ body: { padding: 16 } }}
      >
        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
          <div style={{ color: "#7c3aed" }}>// createPortal syntax:</div>
          <div>return createPortal(</div>
          <div style={{ paddingLeft: 12, color: "#4ade80" }}>{"<Modal>...</Modal>,"}</div>
          <div style={{ paddingLeft: 12, color: "#fbbf24" }}>document.body</div>
          <div>);</div>
        </div>
      </Card>

      <LevelNavigator basePath="/patterns/portals" currentLevel="easy" />
    </div>
  );
}
