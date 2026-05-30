"use client";

// React 19: use() Medium
// Concept: use() can also read a Context, just like useContext.
// But unlike useContext, use(Context) CAN be called conditionally or inside loops.
// This unlocks patterns that were impossible with useContext.
//
// Also shown: multiple Suspense boundaries on one page, each with its own fallback.
// Each boundary is independent: one can be loading while another has resolved.

import { use, Suspense, createContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Tag,
  Typography,
  Switch,
  Alert,
  Space,
  Statistic,
} from "antd";
import { API_URLS } from "@/lib/constants";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── use() with Context ───────────────────────────────────────────────────────
type ThemeCtx = { color: string; label: string };
const ThemeContext = createContext<ThemeCtx>({ color: "#059669", label: "Green" });

// use(Context) reads context and can be called conditionally unlike useContext
function ThemedBadge({ showBadge }: { showBadge: boolean }) {
  // This conditional use() is IMPOSSIBLE with useContext because hooks cannot be conditional
  if (!showBadge) return <Text type="secondary">Badge hidden</Text>;

  // use() CAN be conditional, which is the key advantage over useContext
  const theme = use(ThemeContext);
  return (
    <Tag color={theme.color} style={{ fontSize: 13 }}>
      Theme: {theme.label}
    </Tag>
  );
}

// ─── Multiple Suspense Boundaries ────────────────────────────────────────────
// Each fetches independently and they do not block each other
const postsPromise = fetch(`${API_URLS.jsonPlaceholder}/posts?_limit=5`)
  .then((r) => r.json() as Promise<Post[]>);

const usersPromise = fetch(`${API_URLS.jsonPlaceholder}/users?_limit=5`)
  .then((r) => r.json() as Promise<User[]>);

function PostList() {
  const posts = use(postsPromise);
  return (
    <div>
      {posts.map((p) => (
        <div key={p.id} style={{ padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 12 }}>
          <Text strong style={{ fontSize: 12 }}>#{p.id}</Text>
          <Text style={{ marginLeft: 8, fontSize: 12 }} ellipsis>{p.title}</Text>
        </div>
      ))}
    </div>
  );
}

function UserList() {
  const users = use(usersPromise);
  return (
    <div>
      {users.map((u) => (
        <div key={u.id} style={{ padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 12 }}>
          <Tag style={{ fontSize: 10 }}>{u.address.city}</Tag>
          <Text style={{ marginLeft: 6, fontSize: 12 }}>{u.name}</Text>
        </div>
      ))}
    </div>
  );
}

function SuspenseFallback({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 16, color: "#9ca3af" }}>
      <Spin size="small" />
      <Text type="secondary" style={{ fontSize: 12 }}>Loading {label}...</Text>
    </div>
  );
}

export default function UseHookMediumPage() {
  const [showBadge, setShowBadge] = useState(true);
  const [themeColor, setThemeColor] = useState<"green" | "blue">("green");

  const themeValue: ThemeCtx = themeColor === "green"
    ? { color: "#059669", label: "Emerald" }
    : { color: "#4f46e5", label: "Indigo" };

  return (
    <div>
      <PageIntro
        title="use()"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="use() can read Context conditionally, unlike useContext which must follow the Rules of Hooks. Multiple independent Suspense boundaries let different parts of the UI load in parallel without blocking each other."
        teaches={[
          "use(Context) reads context and can be called inside if/loops",
          "useContext cannot be conditional, but use() can. This is a key React 19 upgrade.",
          "Multiple <Suspense> boundaries: each section loads independently",
          "Parallel data fetching: promises start simultaneously, not sequentially",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* use() with Context demo */}
        <Col xs={24} lg={11}>
          <Card title="use() with Context (conditional)" style={{ borderRadius: 12 }}>
            <ThemeContext.Provider value={themeValue}>
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 13 }}>Show badge?</Text>
                  <Switch checked={showBadge} onChange={setShowBadge} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 13 }}>Theme colour</Text>
                  <Button
                    size="small"
                    onClick={() => setThemeColor((c) => c === "green" ? "blue" : "green")}
                  >
                    Toggle
                  </Button>
                </div>

                <div style={{ background: "#f8f9fc", borderRadius: 8, padding: 16, minHeight: 40, display: "flex", alignItems: "center" }}>
                  {/* use(ThemeContext) only called when showBadge is true */}
                  <ThemedBadge showBadge={showBadge} />
                </div>

                <Alert
                  type="info"
                  showIcon
                  message='use(Context) is called only when showBadge=true. This is impossible with useContext.'
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </ThemeContext.Provider>
          </Card>
        </Col>

        {/* Multiple Suspense boundaries */}
        <Col xs={24} lg={13}>
          <Card title="Multiple Suspense Boundaries (parallel loading)" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 16 }}>
              Both requests fire simultaneously. Neither blocks the other.
            </Text>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>Posts</Text>
                <Suspense fallback={<SuspenseFallback label="posts" />}>
                  <PostList />
                </Suspense>
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>Users</Text>
                <Suspense fallback={<SuspenseFallback label="users" />}>
                  <UserList />
                </Suspense>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-hook" currentLevel="medium" />
    </div>
  );
}
