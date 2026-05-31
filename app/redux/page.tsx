"use client";

import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const LEVELS = [
  {
    level: "easy",
    path: "/redux/easy",
    title: "Counter Slice",
    description:
      "The 'Hello World' of Redux Toolkit. Create a slice with reducers, dispatch actions, read state with useAppSelector.",
  },
  {
    level: "medium",
    path: "/redux/medium",
    title: "Async Thunk",
    description:
      "Fetch data from JSONPlaceholder using createAsyncThunk. Handle loading, success, and error states with extraReducers.",
  },
  {
    level: "advanced",
    path: "/redux/advanced",
    title: "Multiple Slices + Cart",
    description:
      "A real-world store with multiple slices working together. Products slice + cart slice with full CRUD, all wired up.",
  },
];

export default function ReduxIndexPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <Title level={1}>Redux Toolkit</Title>
        <Paragraph style={{ fontSize: 15, maxWidth: 640 }}>
          Redux Toolkit (RTK) is the official, opinionated way to write Redux. It eliminates
          boilerplate with slices, handles immutability automatically, and makes async operations
          straightforward with createAsyncThunk.
        </Paragraph>
      </div>
      <Row gutter={[20, 20]}>
        {LEVELS.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.level}>
            <Link href={item.path} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{ borderRadius: 12, height: "100%" }}
                styles={{ body: { padding: 24 } }}
              >
                <Title level={4} style={{ margin: "0 0 8px" }}>
                  {item.title}
                </Title>
                <Paragraph style={{ fontSize: 13, marginBottom: 16 }}>{item.description}</Paragraph>
                <div
                  style={{
                    color: "#1677ff",
                    fontWeight: 600,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Start <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
