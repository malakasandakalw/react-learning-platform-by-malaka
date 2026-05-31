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
  Alert,
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
// Using Ant Design semantic color tokens via CSS custom properties
const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
  success: { bg: "#ffffff", border: "#d9d9d9", icon: <CheckCircleOutlined style={{ color: "var(--ant-color-success, #52c41a)" }} /> },
  error: { bg: "#ffffff", border: "#d9d9d9", icon: <CloseCircleOutlined style={{ color: "var(--ant-color-error, #ff4d4f)" }} /> },
  info: { bg: "#ffffff", border: "#d9d9d9", icon: <InfoCircleOutlined style={{ color: "#1677ff" }} /> },
  warning: { bg: "#ffffff", border: "#d9d9d9", icon: <WarningOutlined style={{ color: "var(--ant-color-warning, #faad14)" }} /> },
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
    <Space orientation="vertical" style={{ width: "100%" }}>
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
              style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
              styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
                <div style={{ color: "#6a9955" }}>// ToastProvider renders:</div>
                <div>{"<ToastContext.Provider>"}</div>
                <div style={{ paddingLeft: 12 }}>{"{children}"}</div>
                <div style={{ paddingLeft: 12, color: "#569cd6" }}>
                  {"createPortal("}
                </div>
                <div style={{ paddingLeft: 24, color: "#569cd6" }}>{"<ToastContainer />,"}</div>
                <div style={{ paddingLeft: 24, color: "#ce9178" }}>{"document.body"}</div>
                <div style={{ paddingLeft: 12, color: "#569cd6" }}>{")"}</div>
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
