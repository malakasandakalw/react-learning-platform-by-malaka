"use client";

// Patterns: Portals (Medium)
// Concept: Toast notification system using portals.
// Toasts appear in the top-right corner regardless of where in the app they are triggered.
// They render in a fixed container attached to document.body via a portal.
// This is the pattern used by libraries like react-hot-toast and react-toastify.

import { createPortal } from "react-dom";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type ToastType = "success" | "error" | "info" | "warning";
type Toast = { id: number; message: string; type: ToastType };

// ─── Toast Context ────────────────────────────────────────────────────────────
type ToastCtx = { addToast: (message: string, type?: ToastType) => void };
const ToastContext = createContext<ToastCtx>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ─── Toast icons & colors ─────────────────────────────────────────────────────
const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
  success: { bg: "#f0fdf4", border: "#a7f3d0", icon: <CheckCircleOutlined style={{ color: "#16a34a" }} /> },
  error: { bg: "#fef2f2", border: "#fca5a5", icon: <CloseCircleOutlined style={{ color: "#ef4444" }} /> },
  info: { bg: "#eff6ff", border: "#bfdbfe", icon: <InfoCircleOutlined style={{ color: "#3b82f6" }} /> },
  warning: { bg: "#fffbeb", border: "#fcd34d", icon: <WarningOutlined style={{ color: "#f59e0b" }} /> },
};

// ─── Individual Toast ─────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const style = TOAST_STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 280,
        maxWidth: 380,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        animation: "slideIn 0.2s ease",
      }}
    >
      {style.icon}
      <Text style={{ flex: 1, fontSize: 13 }}>{toast.message}</Text>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}
      >
        <CloseOutlined style={{ fontSize: 10 }} />
      </button>
    </div>
  );
}

// Toast Provider: manages state and renders portal
let toastId = 0;

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    setToasts((prev) => [...prev, { id: toastId++, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Portal: renders the toast container in document.body */}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
          </div>,
          document.body
        )
      }
    </ToastContext.Provider>
  );
}

// ─── Demo components that trigger toasts ─────────────────────────────────────
function ActionButtons() {
  const { addToast } = useToast();

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button block icon={<CheckCircleOutlined />} onClick={() => addToast("Operation completed successfully!", "success")}>
        Success toast
      </Button>
      <Button block danger icon={<CloseCircleOutlined />} onClick={() => addToast("Something went wrong. Please try again.", "error")}>
        Error toast
      </Button>
      <Button block icon={<InfoCircleOutlined />} onClick={() => addToast("Your changes have been saved.", "info")}>
        Info toast
      </Button>
      <Button block icon={<WarningOutlined />} onClick={() => addToast("Session expires in 5 minutes.", "warning")}>
        Warning toast
      </Button>
    </Space>
  );
}

export default function PortalsMediumPage() {
  return (
    <div>
      <PageIntro
        title="Portals"
        level="medium"
        description="A toast notification system built with portals. Toasts are triggered from anywhere in the component tree but always render in the top-right corner via a portal to document.body, regardless of overflow or z-index constraints in the component hierarchy."
        teaches={[
          "Context + portal: manage toast state in Context, render via portal",
          "The toast container is always in document.body and never clips",
          "Any component calling useToast() can trigger toasts without prop drilling",
          "Auto-dismiss with setTimeout + cleanup in useEffect",
        ]}
      />

      {/* ToastProvider wraps everything: Context provides addToast and Portal renders toasts */}
      <ToastProvider>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Trigger toasts from here" style={{ borderRadius: 12 }}>
              <ActionButtons />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title="How it works"
              style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
              styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
            >
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
                <div style={{ color: "#7c3aed" }}>// ToastProvider renders:</div>
                <div>{"<ToastContext.Provider>"}</div>
                <div style={{ paddingLeft: 12 }}>{"{children}"}</div>
                <div style={{ paddingLeft: 12, color: "#4ade80" }}>
                  {"createPortal("}
                </div>
                <div style={{ paddingLeft: 24, color: "#4ade80" }}>{"<ToastContainer />,"}</div>
                <div style={{ paddingLeft: 24, color: "#fbbf24" }}>{"document.body"}</div>
                <div style={{ paddingLeft: 12, color: "#4ade80" }}>{")"}</div>
                <div>{"</ToastContext.Provider>"}</div>
              </div>
            </Card>
          </Col>
        </Row>
      </ToastProvider>

      <LevelNavigator basePath="/patterns/portals" currentLevel="medium" />
    </div>
  );
}
