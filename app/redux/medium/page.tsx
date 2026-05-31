"use client";

// Redux Toolkit: Medium
// Concept: createAsyncThunk for async operations.
// Most apps need to fetch data. RTK's createAsyncThunk handles the async lifecycle:
//   - pending: request started
//   - fulfilled: request succeeded
//   - rejected: request failed
// Each lifecycle event is a separate action that extraReducers handles.
// This separates WHAT you're fetching (the thunk) from HOW state updates (extraReducers).

import { useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  List,
  Row,
  Spin,
  Tag,
  Typography,
  Alert,
  Modal,
} from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, fetchUser, clearSelected } from "@/store/slices/usersSlice";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

export default function ReduxMediumPage() {
  const dispatch = useAppDispatch();

  // Read slices of state with typed selectors
  const { list: users, selected, loading, error } = useAppSelector((state) => state.users);

  // Dispatch the async thunk on mount (same as calling fetch() in useEffect),
  // but the loading/error states are handled automatically by extraReducers.
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  async function handleSelectUser(id: number) {
    // fetchUser dispatches: pending → fulfilled/rejected
    dispatch(fetchUser(id));
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/redux/medium/page.tsx"
        title="Redux Toolkit"
        level="medium"
        apiUsed="JSONPlaceholder"
        description="createAsyncThunk handles the async lifecycle. It automatically dispatches pending/fulfilled/rejected actions. extraReducers listens to these to update loading and error state, with no manual flag management."
        teaches={[
          "createAsyncThunk('name', async () => result): wraps async logic",
          "extraReducers handles .pending, .fulfilled, .rejected automatically",
          "The thunk is dispatched like any action: dispatch(fetchUsers())",
          "Loading/error state lives in the slice with no local useState needed",
        ]}
      />

      {error && (
        <Alert type="error" title={error} showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card
            title={`Users (${users.length})`}
            extra={
              <Button
                size="small"
                icon={<ReloadOutlined spin={loading} />}
                onClick={() => dispatch(fetchUsers())}
                loading={loading}
              >
                Refresh
              </Button>
            }
            style={{ borderRadius: 12 }}
          >
            {loading && users.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {users.map((user) => (
                  <List.Item
                    key={user.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectUser(user.id)}
                    actions={[<Tag key="city">{user.address.city}</Tag>]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={user.name}
                      description={user.email}
                    />
                  </List.Item>
                ))}
              </ul>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Async Thunk Lifecycle"
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
              <div style={{ color: "#dcdcaa" }}>dispatch(fetchUsers())</div>
              <div style={{ color: "#6a9955" }}>↓ users/fetchAll/pending</div>
              <div style={{ color: "#6a9955" }}> loading = true</div>
              <div style={{ color: "#ce9178" }}>↓ await getUsers()</div>
              <div style={{ color: "#b5cea8" }}>↓ users/fetchAll/fulfilled</div>
              <div style={{ color: "#d4d4d4" }}> list = payload</div>
              <div style={{ color: "#d4d4d4" }}> loading = false</div>
              <div style={{ color: "#ce9178" }}>↓ (on error) /rejected</div>
              <div style={{ color: "#d4d4d4" }}> error = message</div>
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                }}
              >
                <div style={{ color: "#569cd6" }}>current state:</div>
                <div>
                  loading:{" "}
                  <span style={{ color: loading ? "#ce9178" : "#b5cea8" }}>{String(loading)}</span>
                </div>
                <div>
                  users: <span style={{ color: "#d4d4d4" }}>{users.length}</span>
                </div>
                <div>
                  error:{" "}
                  <span style={{ color: error ? "#ce9178" : "#b5cea8" }}>{error ?? "null"}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* User detail modal */}
      <Modal
        open={!!selected}
        onCancel={() => dispatch(clearSelected())}
        footer={null}
        title="User Details"
      >
        {selected && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Name">{selected.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
            <Descriptions.Item label="Website">{selected.website}</Descriptions.Item>
            <Descriptions.Item label="City">{selected.address.city}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <LevelNavigator basePath="/redux" currentLevel="medium" />
    </div>
  );
}
