import { Tag, Tooltip } from "antd";
import { ApiOutlined } from "@ant-design/icons";

type Props = {
  api: string;
};

export default function ApiTag({ api }: Props) {
  return (
    <Tooltip title={`This demo uses the ${api} public API`}>
      <Tag icon={<ApiOutlined />} style={{ cursor: "default" }}>
        {api}
      </Tag>
    </Tooltip>
  );
}
