"use client";

// Context API: Medium
// Concept: Auth context, the most common real-world context pattern.
// The app has a protected area. Without logging in, you can only see the public page.
// After login, the user object is available throughout the entire app via useAuth().
// Components deep in the tree can check auth state and conditionally render
// without receiving user as a prop from every parent.

import { createContext, useContext, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

type User = { id: number; name: string; email: string; role: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
});

function useAuth() {
  return useContext(AuthContext);
}

// Mock users: in a real app this would be an API call
const MOCK_USERS: (User & { password: string })[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", password: "password123", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", password: "password123", role: "Developer" },
];

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Login form: reads auth context to call login()
function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(false);

  async function handleLogin() {
    setError(false);
    const success = await login(email, password);
    if (!success) setError(true);
  }

  return (
    <Card title="Login" style={{ borderRadius: 12 }}>
      <Alert
        type="info"
        showIcon
        message='Try: alice@example.com / password123'
        style={{ marginBottom: 16, borderRadius: 8, fontSize: 12 }}
      />
      {error && (
        <Alert type="error" message="Invalid credentials" showIcon style={{ marginBottom: 12, borderRadius: 8 }} />
      )}
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input prefix={<UserOutlined />} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password prefix={<LockOutlined />} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Button type="primary" block loading={isLoading} onClick={handleLogin}>
          Sign In
        </Button>
      </Form>
    </Card>
  );
}

// User profile: reads auth context to show user data and logout
function UserProfile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <Card style={{ borderRadius: 12, textAlign: "center", padding: "8px 0" }}>
      <Avatar size={64} style={{ background: "#4f46e5", fontSize: 24 }}>
        {user.name[0]}
      </Avatar>
      <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>{user.name}</Title>
      <Text type="secondary" style={{ display: "block" }}>{user.email}</Text>
      <Tag color="blue" style={{ marginTop: 8 }}>{user.role}</Tag>
      <Divider />
      <Button icon={<LogoutOutlined />} onClick={logout} danger>Sign Out</Button>
    </Card>
  );
}

// Protected dashboard: only visible when logged in
function Dashboard() {
  const { user } = useAuth();

  return (
    <Card
      title={
        <Space>
          <CheckCircleOutlined style={{ color: "#16a34a" }} />
          <span>Protected Dashboard</span>
        </Space>
      }
      style={{ borderRadius: 12, borderColor: "#a7f3d0" }}
    >
      <Text style={{ fontSize: 13, color: "#555" }}>
        This component is <strong>protected</strong>. It reads <code>user</code> from AuthContext
        No prop was passed from any parent.
      </Text>
      <div style={{ marginTop: 16, background: "#f0fdf4", borderRadius: 8, padding: 12 }}>
        <Text strong style={{ color: "#16a34a" }}>Logged in as: </Text>
        <Text>{user?.name}</Text> · <Tag color="green">{user?.role}</Tag>
      </div>
    </Card>
  );
}

function AppContent() {
  const { user } = useAuth();
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        {user ? <UserProfile /> : <LoginForm />}
      </Col>
      <Col xs={24} md={12}>
        {user ? (
          <Dashboard />
        ) : (
          <Card style={{ borderRadius: 12, background: "#fafafa", textAlign: "center", padding: 32 }}>
            <LockOutlined style={{ fontSize: 32, color: "#d1d5db" }} />
            <Title level={5} style={{ color: "#9ca3af", marginTop: 12 }}>
              Log in to access the dashboard
            </Title>
          </Card>
        )}
      </Col>
    </Row>
  );
}

export default function ContextMediumPage() {
  return (
    <div>
      <PageIntro
        title="Context API"
        level="medium"
        description="Auth context is the most common real-world context. The user state lives in one place (AuthProvider) and is accessible everywhere. Components check auth state and respond accordingly, without prop drilling."
        teaches={[
          "Holding async state (login/logout) in context",
          "Custom useAuth() hook for clean consumption",
          "Conditional UI based on context state: protected routes pattern",
          "Why NOT to overuse context: it re-renders ALL consumers on every change",
        ]}
      />

      {/* The entire UI tree is wrapped in AuthProvider */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>

      <LevelNavigator basePath="/context" currentLevel="medium" />
    </div>
  );
}
