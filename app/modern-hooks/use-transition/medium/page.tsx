"use client";

// useTransition: Medium
// Concept: Using isPending to show contextual loading feedback during a search.
// The input updates instantly (urgent). The results render as a transition (non-urgent).
// isPending lets us show a spinner inside the results area, not a full page loader.
// so the user keeps their focus and the input stays responsive.

import { useState, useTransition, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Input,
  List,
  Row,
  Spin,
  Tag,
  Typography,
  Badge,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { getUsers } from "@/services/jsonPlaceholder";
import type { User } from "@/types/user";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

export default function UseTransitionMediumPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getUsers().then(setAllUsers);
  }, []);

  function handleSearch(value: string) {
    // The input value updates immediately, staying fast for the user
    setInputValue(value);

    // The search results update is wrapped in a transition for lower priority
    // React can interrupt this if something more urgent comes in (like another keypress)
    startTransition(() => {
      setSearchQuery(value);
    });
  }

  const results = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageIntro
        title="useTransition"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="Separating the input update (urgent) from the results render (transition) keeps the typing experience instant. isPending drives contextual feedback right in the results area, not a full-page loading state."
        teaches={[
          "Two state values: inputValue (urgent) and searchQuery (transition)",
          "The input always reflects the latest keypress immediately",
          "isPending true while searchQuery is still catching up",
          "Contextual loading indicators vs. full page spinners",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12 }}>
            <Input
              prefix={<SearchOutlined />}
              suffix={isPending ? <Spin size="small" /> : null}
              placeholder="Search users by name, email, or city..."
              value={inputValue}
              onChange={(e) => handleSearch(e.target.value)}
              size="large"
              style={{ marginBottom: 16 }}
            />

            <div style={{ minHeight: 200 }}>
              {isPending ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 16, color: "#9ca3af" }}>
                  <Spin size="small" />
                  <Text type="secondary">Updating results...</Text>
                </div>
              ) : (
                {results.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
                    {searchQuery ? "No users found" : "Start typing to search"}
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {results.map((user) => (
                      <List.Item key={user.id}>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={user.name}
                          description={
                            <span>
                              <Text type="secondary">{user.email}</Text>
                              {" · "}<Tag>{user.address.city}</Tag>
                            </span>
                          }
                        />
                      </List.Item>
                    ))}
                  </ul>
                )}
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="State Split"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2.2 }}>
              <div style={{ color: "#6a9955" }}>// Updates IMMEDIATELY (urgent):</div>
              <div>
                <span style={{ color: "#569cd6" }}>inputValue: </span>
                <span style={{ color: "#ce9178" }}>&quot;{inputValue}&quot;</span>
              </div>
              <div style={{ marginTop: 8, color: "#6a9955" }}>// Updates in TRANSITION (deferred):</div>
              <div>
                <span style={{ color: "#569cd6" }}>searchQuery: </span>
                <span style={{ color: "#b5cea8" }}>&quot;{searchQuery}&quot;</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isPending: </span>
                <span style={{ color: isPending ? "#dcdcaa" : "#b5cea8" }}>{String(isPending)}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>results: </span>
                <span style={{ color: "#d4d4d4" }}>{results.length}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-transition" currentLevel="medium" />
    </div>
  );
}
