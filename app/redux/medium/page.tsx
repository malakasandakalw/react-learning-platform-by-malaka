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
        <Alert type="error" message={error} showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
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
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : (
              <List
                dataSource={users}
                renderItem={(user) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectUser(user.id)}
                    actions={[<Tag key="city">{user.address.city}</Tag>]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: "#b45309" }} icon={<UserOutlined />} />}
                      title={user.name}
                      description={user.email}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Async Thunk Lifecycle"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#7c3aed" }}>dispatch(fetchUsers())</div>
              <div style={{ color: "#6b7280" }}>↓ users/fetchAll/pending</div>
              <div style={{ color: "#6b7280" }}>   loading = true</div>
              <div style={{ color: "#fbbf24" }}>↓ await getUsers()</div>
              <div style={{ color: "#4ade80" }}>↓ users/fetchAll/fulfilled</div>
              <div style={{ color: "#6b7280" }}>   list = payload</div>
              <div style={{ color: "#6b7280" }}>   loading = false</div>
              <div style={{ color: "#f87171" }}>↓ (on error) /rejected</div>
              <div style={{ color: "#6b7280" }}>   error = message</div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#161630", borderRadius: 6 }}>
                <div style={{ color: "#a5b4fc" }}>current state:</div>
                <div>loading: <span style={{ color: loading ? "#f59e0b" : "#4ade80" }}>{String(loading)}</span></div>
                <div>users: <span style={{ color: "#e2e8f0" }}>{users.length}</span></div>
                <div>error: <span style={{ color: error ? "#f87171" : "#4ade80" }}>{error ?? "null"}</span></div>
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
