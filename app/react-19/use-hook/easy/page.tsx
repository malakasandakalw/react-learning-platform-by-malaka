"use client";

// React 19: use() Easy
// Concept: use() reads a Promise during render.
// Before React 19, you'd need: useEffect + useState + setLoading.
// With use(), you pass a promise directly and React suspends the component
// until the promise resolves. The parent <Suspense> shows the fallback while waiting.
//
// Rules of use():
// - Unlike other hooks, use() CAN be called inside if/loops/try-catch
// - It MUST be used with <Suspense> or it will throw uncaught
// - It cannot be used in async Server Components (use fetch directly there)

import { use, Suspense } from "react";
import { Avatar, Card, Col, List, Row, Spin, Tag, Typography, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { API_URLS } from "@/lib/constants";
import type { User } from "@/types/user";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// The promise is created OUTSIDE the component so it is not re-created on every render.
// Creating it inside the component would cause an infinite suspension loop.
const usersPromise = fetch(`${API_URLS.jsonPlaceholder}/users`).then(
  (r) => r.json() as Promise<User[]>
);

// This component calls use(promise) and suspends until the promise resolves.
// React will NOT render this component until the data is ready.
function UserList() {
  // use() reads the resolved value of the promise.
  // If the promise is still pending, React suspends this component.
  // If the promise rejected, React throws to the nearest Error Boundary.
  const users = use(usersPromise);

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {users.map((user) => (
        <List.Item key={user.id}>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={user.name}
            description={
              <span>
                <Text type="secondary">{user.email}</Text>
                {" · "}
                <Tag>{user.address.city}</Tag>
              </span>
            }
          />
        </List.Item>
      ))}
    </ul>
  );
}

export default function UseHookEasyPage() {
  return (
    <div>
      <PageIntro
        sourcePath="app/react-19/use-hook/easy/page.tsx"
        title="use()"
        level="easy"
        apiUsed="JSONPlaceholder"
        description="use() reads a Promise during render with no useEffect, no setState, and no loading flag. Wrap the component in <Suspense> and React handles the loading state for you."
        teaches={[
          "use(promise) suspends the component until the promise resolves",
          "<Suspense fallback={...}> shows the fallback while suspended",
          "The promise must be created outside the component to avoid re-creation on render",
          "use() can be called conditionally, unlike all other hooks",
        ]}
      />

      <Alert
        type="info"
        showIcon
        title="React 19 only"
        description="use() requires React 19+. This project runs React 19.2.4, so it works here."
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card title="Users (loaded with use())" style={{ borderRadius: 12 }}>
            {/* Suspense shows the fallback while UserList is suspended */}
            <Suspense
              fallback={
                <div style={{ textAlign: "center", padding: 40 }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 12, color: "#9ca3af" }}>
                    Suspense fallback: component is suspended
                  </div>
                </div>
              }
            >
              <UserList />
            </Suspense>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="use() vs useEffect"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div style={{ color: "#6a9955" }}>// Before (useEffect pattern):</div>
              <div style={{ color: "#d4d4d4" }}>const [data, setData] = useState(null)</div>
              <div style={{ color: "#d4d4d4" }}>const [loading, setLoading] = useState(true)</div>
              <div style={{ color: "#dcdcaa" }}>
                useEffect(() ={">"} {"{"}
              </div>
              <div style={{ color: "#dcdcaa", paddingLeft: 12 }}>fetch(url).then(setData)</div>
              <div style={{ color: "#dcdcaa" }}>{"}, [])"}</div>
              <div style={{ color: "#d4d4d4" }}>if (loading) return {"<Spinner />"}</div>
              <br />
              <div style={{ color: "#6a9955" }}>// React 19 (use() pattern):</div>
              <div style={{ color: "#b5cea8" }}>
                const promise = fetch(url).then(r ={">"} r.json())
              </div>
              <div style={{ color: "#6a9955" }}>// In component:</div>
              <div style={{ color: "#dcdcaa" }}>const data = use(promise)</div>
              <div style={{ color: "#6a9955" }}>// Parent: {"<Suspense fallback={...}>"}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/react-19/use-hook" currentLevel="easy" />
    </div>
  );
}
