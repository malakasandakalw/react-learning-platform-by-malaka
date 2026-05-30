export const API_URLS = {
  jsonPlaceholder: "https://jsonplaceholder.typicode.com",
  pokeApi: "https://pokeapi.co/api/v2",
  dummyJson: "https://dummyjson.com",
} as const;

export const LEVELS = ["easy", "medium", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<Level, string> = {
  easy: "Easy",
  medium: "Medium",
  advanced: "Advanced",
};

export const LEVEL_COLORS: Record<Level, string> = {
  easy: "success",
  medium: "warning",
  advanced: "error",
};

export const MODULES = {
  hooks: {
    key: "hooks",
    label: "Core Hooks",
    path: "/hooks",
    description: "Master the fundamental React hooks every developer must know.",
  },
  modernHooks: {
    key: "modern-hooks",
    label: "Modern Hooks",
    path: "/modern-hooks",
    description: "Explore the latest hooks introduced in React 18 and 19.",
  },
  context: {
    key: "context",
    label: "Context API",
    path: "/context",
    description: "Share state across components without prop drilling.",
  },
  redux: {
    key: "redux",
    label: "Redux Toolkit",
    path: "/redux",
    description: "Manage complex global state with Redux Toolkit.",
  },
} as const;
