import { Typography, Alert } from "antd";
import LevelBadge from "./LevelBadge";
import ApiTag from "./ApiTag";
import type { Level } from "@/lib/constants";

const { Title, Paragraph, Text } = Typography;

type Props = {
  title: string;
  level: Level;
  description: string;
  teaches: string[];
  apiUsed?: string;
};

export default function PageIntro({ title, level, description, teaches, apiUsed }: Props) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <Title level={2} style={{ margin: 0 }}>
          {title}
        </Title>
        <LevelBadge level={level} size="large" />
        {apiUsed && <ApiTag api={apiUsed} />}
      </div>

      <Paragraph style={{ fontSize: 15, marginBottom: 16 }}>
        {description}
      </Paragraph>

      <Alert
        type="info"
        showIcon
        title="What you will learn"
        description={
          <ul style={{ margin: "4px 0 0 0", paddingLeft: 20 }}>
            {teaches.map((item, i) => (
              <li key={i} style={{ marginBottom: 2, fontSize: 12 }}>
                {item}
              </li>
            ))}
          </ul>
        }
        style={{ marginBottom: 12 }}
      />

      <Alert
        type="warning"
        showIcon
        title="Reading the source code is not optional"
        description={
          <span style={{ fontSize: 13, lineHeight: 1.7 }}>
            The demo above shows <em>what</em> this concept does. As a developer, you learn
            by reading <em>how</em> it is built. Open this page&apos;s source file in your editor
            and read through every line before moving on.
            The file path matches the URL:{" "}
            <Text code style={{ fontSize: 12 }}>app/[section]/[hook]/[level]/page.tsx</Text>
          </span>
        }
      />
    </div>
  );
}
