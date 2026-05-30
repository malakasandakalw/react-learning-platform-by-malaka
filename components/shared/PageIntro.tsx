import { Typography, Alert } from "antd";
import LevelBadge from "./LevelBadge";
import ApiTag from "./ApiTag";
import type { Level } from "@/lib/constants";

const { Title, Paragraph } = Typography;

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

      <Paragraph style={{ fontSize: 15, color: "#555", marginBottom: 16 }}>
        {description}
      </Paragraph>

      <Alert
        type="info"
        showIcon
        message="What you will learn"
        description={
          <ul style={{ margin: "4px 0 0 0", paddingLeft: 20 }}>
            {teaches.map((item, i) => (
              <li key={i} style={{ marginBottom: 2 }}>
                {item}
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
}
