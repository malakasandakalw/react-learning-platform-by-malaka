"use client";

// Patterns: HOC (Higher Order Components, Easy)
// Concept: An HOC is a function that takes a component and returns a NEW component
// with additional behavior injected. Pattern: withX(Component) → EnhancedComponent.
// HOCs were the pre-hooks way to share logic. Custom hooks have replaced most HOC use cases,
// but HOCs are still used when you need to inject props or wrap a component in a decorator.

import { useState, useEffect, ComponentType } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  Typography,
  Space,
  Tag,
  Avatar,
  Alert,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { User } from "@/types/user";
import { getUsers } from "@/services/jsonPlaceholder";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── withLoading HOC ──────────────────────────────────────────────────────────
// Takes any component and wraps it: when loading=true, shows a spinner instead.
// The wrapped component receives all original props minus loading.
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  // Returns a NEW component with an extra `loading` prop
  function WithLoadingComponent(props: P & { loading: boolean }) {
    const { loading, ...rest } = props;

    if (loading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      );
    }

    return <WrappedComponent {...(rest as P)} />;
  }

  // displayName: set this so React DevTools shows "WithLoading(UserList)"
  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;

  return WithLoadingComponent;
}

// Base component: knows nothing about loading
function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.slice(0, 5).map((user) => (
        <div key={user.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
          <Avatar style={{ background: "#4f46e5" }} icon={<UserOutlined />} />
          <div>
            <Text strong style={{ fontSize: 13 }}>{user.name}</Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{user.email}</Text>
          </div>
        </div>
      ))}
    </div>
  );
}

// Create the HOC-wrapped version: UserList enhanced with loading capability
const UserListWithLoading = withLoading(UserList);

// ─── withError HOC ────────────────────────────────────────────────────────────
function withError<P extends object>(WrappedComponent: ComponentType<P>) {
  function WithErrorComponent(props: P & { error: string | null }) {
    const { error, ...rest } = props;
    if (error) {
      return (
        <Alert type="error" message={error} showIcon style={{ borderRadius: 8 }} />
      );
    }
    return <WrappedComponent {...(rest as P)} />;
  }
  WithErrorComponent.displayName = `withError(${WrappedComponent.name})`;
  return WithErrorComponent;
}

const UserListEnhanced = withError(withLoading(UserList));

export default function HocEasyPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageIntro
        title="Higher Order Components"
        level="easy"
        apiUsed="JSONPlaceholder"
        description="An HOC takes a component and returns an enhanced version. withLoading wraps any component and shows a spinner when loading=true. The wrapped component never knows about the loading state, which provides clean separation of concerns."
        teaches={[
          "HOC signature: withX<P>(Component: ComponentType<P>) → ComponentType<P & ExtraProps>",
          "The wrapped component receives its normal props. The HOC handles the cross-cutting concern.",
          "displayName: set it so React DevTools shows the HOC wrapping chain",
          "HOC composition: withError(withLoading(UserList)) to apply multiple HOCs",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="withLoading(UserList)" style={{ borderRadius: 12 }}>
            <Tag style={{ marginBottom: 12, fontSize: 11 }}>loading={String(loading)}</Tag>
            {/* HOC-wrapped component: loading prop controls spinner vs content */}
            <UserListWithLoading users={users} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="withError(withLoading(UserList))" style={{ borderRadius: 12 }}>
            <Space style={{ marginBottom: 12 }}>
              <Tag style={{ fontSize: 11 }}>loading={String(loading)}</Tag>
              <Tag color={error ? "red" : "default"} style={{ fontSize: 11 }}>error={String(!!error)}</Tag>
            </Space>
            {/* Composed HOCs: error check first, then loading, then content */}
            <UserListEnhanced users={users} loading={loading} error={error} />
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/patterns/hoc" currentLevel="easy" />
    </div>
  );
}
