"use client";

import { Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { LEVELS, type Level } from "@/lib/constants";

type Props = {
  basePath: string;
  currentLevel: Level;
};

export default function LevelNavigator({ basePath, currentLevel }: Props) {
  const router = useRouter();
  const currentIndex = LEVELS.indexOf(currentLevel);
  const prevLevel = currentIndex > 0 ? LEVELS[currentIndex - 1] : null;
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  return (
    <Space style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
      {prevLevel ? (
        <Button
          icon={<LeftOutlined />}
          onClick={() => router.push(`${basePath}/${prevLevel}`)}
        >
          {prevLevel.charAt(0).toUpperCase() + prevLevel.slice(1)}
        </Button>
      ) : (
        <div />
      )}
      {nextLevel ? (
        <Button
          type="primary"
          iconPlacement="end"
          icon={<RightOutlined />}
          onClick={() => router.push(`${basePath}/${nextLevel}`)}
        >
          {nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)}
        </Button>
      ) : (
        <div />
      )}
    </Space>
  );
}
