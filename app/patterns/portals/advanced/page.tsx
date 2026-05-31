"use client";

// Patterns: Portals (Advanced)
// Concept: Tooltip with portal + smart positioning.
// The tooltip renders via portal (escapes overflow), computes its position
// using getBoundingClientRect() in useLayoutEffect, and handles edge cases
// (near viewport edges). This is how libraries like Floating UI work.

import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type Placement = "top" | "bottom" | "left" | "right";

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  placement: Placement;
};

function useSmartTooltip() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    placement: "top",
  });

  // Compute tooltip position before paint: useLayoutEffect prevents flicker
  useLayoutEffect(() => {
    if (!state.visible || !triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const GAP = 8;

    // Pick placement based on available space
    let placement: Placement = "top";
    if (trigger.top < tooltip.height + GAP) placement = "bottom";
    else if (trigger.right + tooltip.width + GAP > vw) placement = "left";
    else if (trigger.left < tooltip.width + GAP) placement = "right";

    let x = 0,
      y = 0;
    switch (placement) {
      case "top":
        x = trigger.left + trigger.width / 2 - tooltip.width / 2;
        y = trigger.top - tooltip.height - GAP + window.scrollY;
        break;
      case "bottom":
        x = trigger.left + trigger.width / 2 - tooltip.width / 2;
        y = trigger.bottom + GAP + window.scrollY;
        break;
      case "left":
        x = trigger.left - tooltip.width - GAP;
        y = trigger.top + trigger.height / 2 - tooltip.height / 2 + window.scrollY;
        break;
      case "right":
        x = trigger.right + GAP;
        y = trigger.top + trigger.height / 2 - tooltip.height / 2 + window.scrollY;
        break;
    }

    // Clamp to viewport
    x = Math.max(8, Math.min(x, vw - tooltip.width - 8));
    setState((s) => ({ ...s, x, y, placement }));
  }, [state.visible]);

  const show = useCallback(() => setState((s) => ({ ...s, visible: true })), []);
  const hide = useCallback(() => setState((s) => ({ ...s, visible: false })), []);

  return { triggerRef, tooltipRef, state, show, hide };
}

const ARROW_STYLES: Record<Placement, React.CSSProperties> = {
  top: { bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)" },
  bottom: { top: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)" },
  left: { right: -4, top: "50%", transform: "translateY(-50%) rotate(45deg)" },
  right: { left: -4, top: "50%", transform: "translateY(-50%) rotate(45deg)" },
};

function SmartTooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const { triggerRef, tooltipRef, state, show, hide } = useSmartTooltip();

  return (
    <>
      <button
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{
          background: "#1677ff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 14px",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        {children}
      </button>

      {state.visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              top: state.y,
              left: state.x,
              background: "rgba(0,0,0,0.88)",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: 12,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 9999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            {content}
            <div
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                background: "rgba(0,0,0,0.88)",
                ...ARROW_STYLES[state.placement],
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default function PortalsAdvancedPage() {
  return (
    <div>
      <PageIntro
        title="Portals"
        level="advanced"
        description="A smart tooltip built with portal and useLayoutEffect positioning. The tooltip always renders in the correct position, auto-adjusting when near viewport edges. This is the core of every tooltip/popover library."
        teaches={[
          "Portal escapes the DOM hierarchy for correct z-index and overflow behavior",
          "useLayoutEffect positions the tooltip before it becomes visible",
          "getBoundingClientRect reads trigger/tooltip dimensions synchronously",
          "Viewport edge detection: flip placement when there's not enough space",
        ]}
      />

      <Card title="Smart Tooltip Demo" style={{ borderRadius: 12 }}>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 20 }}>
          Hover each button. The tooltip auto-positions based on available space.
        </Text>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <SmartTooltip content="I appear above (enough space above)">Center button</SmartTooltip>
          <SmartTooltip content="Near right edge: I flip left">Far right</SmartTooltip>
          <SmartTooltip content="Dynamic positioning based on viewport">Middle</SmartTooltip>
        </div>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <SmartTooltip content="Near bottom: I appear above or below based on available space">
            Bottom area button
          </SmartTooltip>
        </div>
      </Card>

      <LevelNavigator basePath="/patterns/portals" currentLevel="advanced" />
    </div>
  );
}
