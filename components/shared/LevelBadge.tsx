import { Tag } from "antd";
import { LEVEL_LABELS, LEVEL_COLORS, type Level } from "@/lib/constants";

type Props = {
  level: Level;
  size?: "default" | "large";
};

export default function LevelBadge({ level, size = "default" }: Props) {
  return (
    <Tag
      color={LEVEL_COLORS[level]}
      style={{
        fontSize: size === "large" ? 14 : 12,
        padding: size === "large" ? "4px 14px" : "2px 10px",
        fontWeight: 600,
      }}
    >
      {LEVEL_LABELS[level]}
    </Tag>
  );
}
