"use client";

// Patterns: HOC (Medium)
// Concept: withAuth HOC for route protection.
// withAuth wraps a component and checks authentication state.
// If not authenticated: redirect to login. If authenticated: render the component.
// This is how protected routes are implemented with HOCs.

import { ComponentType, useContext, createContext, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  Avatar,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// ─── Auth Context ─────────────────────────────────────────────────────────────
type AuthUser = { name: string; role: "admin" | "user" };
type AuthCtxType = { user: AuthUser | null; login: (name: string, role: "admin" | "user") => void; logout: () => void };

const AuthCtx = createContext<AuthCtxType>({ user: null, login: () => { }, logout: () => { } });

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  return (
    <AuthCtx.Provider value={{
      user,
      login: (name, role) => setUser({ name, role }),
      logout: () => setUser(null),
    }}>
      {children}
    </AuthCtx.Provider>
  );
}

// ─── withAuth HOC ─────────────────────────────────────────────────────────────
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRole?: "admin" | "user"
) {
  function WithAuth(props: P) {
    const { user } = useContext(AuthCtx);

    if (!user) {
      return (
        <div style={{ textAlign: "center", padding: 40 }}>
          <LockOutlined style={{ fontSize: 32, color: "#d1d5db", marginBottom: 12 }} />
          <Title level={5} style={{ color: "rgba(0,0,0,0.65)" }}>Authentication Required</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Please log in to view this content.</Text>
        </div>
      );
    }

    if (requiredRole && user.role !== requiredRole) {
      return (
        <Alert
          type="error"
          showIcon
          title="Access Denied"
          description={`This section requires ${requiredRole} role. You have: ${user.role}`}
          style={{ borderRadius: 8 }}
        />
      );
    }

    // Inject the user as a prop so the wrapped component can use it
    return <WrappedComponent {...props} user={user} />;
  }

  WithAuth.displayName = `withAuth(${WrappedComponent.name})`;
  return WithAuth;
}

// ─── Protected components ─────────────────────────────────────────────────────
function Dashboard({ user }: { user?: AuthUser }) {
  return (
    <Alert
      type="success"
      showIcon
      message="User Dashboard"
      description={`Welcome, ${user?.name}! You have ${user?.role} access.`}
      style={{ borderRadius: 8 }}
    />
  );
}

function AdminPanel({ user }: { user?: AuthUser }) {
  return (
    <Alert
      type="warning"
      showIcon
      message="Admin Panel"
      description={`Admin controls for ${user?.name}`}
      style={{ borderRadius: 8 }}
    />
  );
}

// Apply HOCs
const ProtectedDashboard = withAuth(Dashboard);
const AdminOnlyPanel = withAuth(AdminPanel, "admin");

// ─── Login form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const { user, login, logout } = useContext(AuthCtx);
  const [name, setName] = useState("Alex");

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Space>
          <Avatar>
            {user.name[0]}
          </Avatar>
          <div>
            <Text strong>{user.name}</Text>
            <Tag color={user.role === "admin" ? "gold" : "blue"} style={{ marginLeft: 6 }}>{user.role}</Tag>
          </div>
        </Space>
        <Button icon={<LogoutOutlined />} size="small" onClick={logout}>Logout</Button>
      </div>
    );
  }

  return (
    <Space>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" style={{ width: 120 }} size="small" />
      <Button size="small" type="primary" icon={<UserOutlined />} onClick={() => login(name, "user")}>
        Login as User
      </Button>
      <Button size="small" icon={<CrownOutlined />} onClick={() => login(name, "admin")}>
        Login as Admin
      </Button>
    </Space>
  );
}

export default function HocMediumPage() {
  return (
    <div>
      <PageIntro
        title="Higher Order Components"
        level="medium"
        description="withAuth wraps any component and handles authentication/authorization before rendering. Components inside do not know about auth logic. They just receive the user as a prop."
        teaches={[
          "withAuth(Component, requiredRole): checks auth before rendering",
          "HOC injects injected props (user) into the wrapped component",
          "Role-based access: HOC receives requiredRole and checks user.role",
          "The wrapped component is decoupled from auth concerns entirely",
        ]}
      />

      <AuthProvider>
        <Card title="Auth Status" style={{ borderRadius: 12, marginBottom: 16 }}>
          <LoginForm />
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="withAuth(Dashboard): any logged-in user" style={{ borderRadius: 12 }}>
              <ProtectedDashboard />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title='withAuth(AdminPanel, "admin"): admin only' style={{ borderRadius: 12 }}>
              <AdminOnlyPanel />
            </Card>
          </Col>
        </Row>
      </AuthProvider>

      <LevelNavigator basePath="/patterns/hoc" currentLevel="medium" />
    </div>
  );
}
