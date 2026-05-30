import { Tag, Tooltip } from "antd";
import { ApiOutlined } from "@ant-design/icons";

const API_COLORS: Record<string, string> = {
  JSONPlaceholder: "blue",
  PokéAPI: "red",
  DummyJSON: "orange",
};

type Props = {
  api: string;
};

export default function ApiTag({ api }: Props) {
  return (
    <Tooltip title={`This demo uses the ${api} public API`}>
      <Tag
        icon={<ApiOutlined />}
        color={API_COLORS[api] ?? "default"}
        style={{ cursor: "default", borderRadius: 20 }}
      >
        {api}
      </Tag>
    </Tooltip>
  );
}
