import { LEVEL_DOT_COLORS, type Level } from "@/lib/constants";

type Props = {
  level: Level;
  size?: number;
};

export default function LevelDot({ level, size = 6 }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: LEVEL_DOT_COLORS[level],
        flexShrink: 0,
      }}
    />
  );
}
