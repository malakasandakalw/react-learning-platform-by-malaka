import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-tree",
    "rc-table",
    "rc-input",
    "rc-select",
    "rc-cascader",
    "rc-checkbox",
    "rc-radio",
    "rc-slider",
    "rc-rate",
    "rc-upload",
    "rc-progress",
    "rc-motion",
    "rc-menu",
    "rc-overflow",
    "rc-field-form",
    "rc-resize-observer",
    "rc-virtual-list",
    "rc-image",
    "@rc-component",
  ],
};

export default nextConfig;
