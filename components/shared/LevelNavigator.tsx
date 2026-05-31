"use client";

import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { LEVELS, type Level } from "@/lib/constants";
import LevelDot from "./LevelDot";

type Props = {
  basePath: string;
  currentLevel: Level;
};

export default function LevelNavigator({ basePath, currentLevel }: Props) {
  const router = useRouter();
  const currentIndex = LEVELS.indexOf(currentLevel);
  const prevLevel = currentIndex > 0 ? LEVELS[currentIndex - 1] : null;
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  function label(l: Level) {
    return l.charAt(0).toUpperCase() + l.slice(1);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid #f0f0f0",
      }}
    >
      {prevLevel ? (
        <Button icon={<LeftOutlined />} onClick={() => router.push(`${basePath}/${prevLevel}`)}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <LevelDot level={prevLevel} size={6} />
            {label(prevLevel)}
          </span>
        </Button>
      ) : (
        <span />
      )}

      {nextLevel ? (
        <Button
          type="primary"
          iconPlacement="end"
          icon={<RightOutlined />}
          onClick={() => router.push(`${basePath}/${nextLevel}`)}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <LevelDot level={nextLevel} size={6} />
            {label(nextLevel)}
          </span>
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}
