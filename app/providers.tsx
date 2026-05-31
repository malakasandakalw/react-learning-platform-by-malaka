"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 6,
            fontFamily: "var(--font-sans), sans-serif",
          },
          components: {
            Layout: {
              siderBg: "#001529",
              triggerBg: "#002140",
            },
            Menu: {
              darkItemBg: "#001529",
              darkSubMenuItemBg: "#000c17",
              darkItemSelectedBg: "#1677ff",
            },
          },
        }}
      >
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
