"use client";

// Custom Hooks: Medium
// Two essential utility hooks found in nearly every real codebase:
//
// useLocalStorage<T>(key, initialValue)
//   Syncs state with localStorage. When the state updates, localStorage updates too.
//   On page refresh, the stored value is restored as the initial state.
//
// useDebounce<T>(value, delay)
//   Returns a debounced copy of a value. Useful for search inputs, API calls,
//   and any scenario where you want to wait for the user to stop typing.

import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Switch,
  Typography,
  Tag,
  Select,
  Divider,
  Space,
  Slider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

// ─── useLocalStorage ──────────────────────────────────────────────────────────
// Key insight: useState initialiser reads from localStorage (lazy init).
// The setter both updates React state AND writes to localStorage atomically.
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Wrap the setter to also persist to localStorage
  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof newValue === "function"
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {}
      return resolved;
    });
  };

  return [value, setStoredValue] as const;
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
// Returns a lagging copy of 'value' that only updates after 'delay' ms of inactivity.
// The cleanup cancels the pending timeout when value changes before the delay expires.
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
// ─────────────────────────────────────────────────────────────────────────────

const THEME_OPTIONS = ["indigo", "violet", "sky", "emerald", "rose"];

const THEME_COLORS: Record<string, string> = {
  indigo: "#4f46e5",
  violet: "#7c3aed",
  sky: "#0891b2",
  emerald: "#059669",
  rose: "#e11d48",
};

export default function CustomHooksMediumPage() {
  // useLocalStorage: persists across page refreshes. Try refreshing!
  const [theme, setTheme] = useLocalStorage("rlh-theme", "indigo");
  const [darkMode, setDarkMode] = useLocalStorage("rlh-dark", false);
  const [fontSize, setFontSize] = useLocalStorage("rlh-font-size", 14);

  // useDebounce: search only fires after 400ms of inactivity
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [debounceDelay, setDebounceDelay] = useState(400);
  const [searchWithDelay, setSearchWithDelay] = useState("");
  const debouncedWithCustomDelay = useDebounce(searchInput, debounceDelay);

  const color = THEME_COLORS[theme] ?? "#4f46e5";

  return (
    <div>
      <PageIntro
        title="Custom Hooks"
        level="medium"
        description="Two utility hooks found in almost every real codebase. useLocalStorage persists state across refreshes. useDebounce delays a value and is essential for search inputs and live API calls."
        teaches={[
          "useLocalStorage: lazy initialiser reads from storage on first render only",
          "Wrapping setState to add side effects (persistence) without exposing internals",
          "useDebounce: cleanup-based delay using setTimeout and clearTimeout in useEffect",
          "Generic hooks with TypeScript constraints: useLocalStorage<T>, useDebounce<T>",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* useLocalStorage demo */}
        <Col xs={24} lg={12}>
          <Card
            title="useLocalStorage: Persisted Preferences"
            style={{ borderRadius: 12 }}
          >
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 16 }}>
              Change these settings and refresh the page. They persist in localStorage.
            </Text>

            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text>Accent colour</Text>
                <Select
                  value={theme}
                  onChange={setTheme}
                  size="small"
                  style={{ width: 110 }}
                  options={THEME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text>Dark mode</Text>
                <Switch checked={darkMode} onChange={setDarkMode} />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text>Font size</Text>
                  <Tag>{fontSize}px</Tag>
                </div>
                <Slider min={12} max={20} value={fontSize} onChange={setFontSize} />
              </div>

              {/* Preview using the persisted values */}
              <div
                style={{
                  background: darkMode ? "#0f0f23" : "#f8f9fc",
                  border: `2px solid ${color}`,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize,
                    color: darkMode ? "#e2e8f0" : "#374151",
                    fontWeight: 500,
                  }}
                >
                  Preview text: refresh to see persistence
                </Text>
              </div>

              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#9ca3af" }}>
                localStorage keys: rlh-theme, rlh-dark, rlh-font-size
              </div>
            </Space>
          </Card>
        </Col>

        {/* useDebounce demo */}
        <Col xs={24} lg={12}>
          <Card title="useDebounce: Delayed Value" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 16 }}>
              Type quickly. The debounced value only updates after you pause.
            </Text>

            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div>
                <Text style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  Delay: {debounceDelay}ms
                </Text>
                <Slider
                  min={100}
                  max={2000}
                  step={100}
                  value={debounceDelay}
                  onChange={setDebounceDelay}
                />
              </div>

              <Input
                prefix={<SearchOutlined />}
                placeholder="Type here..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                size="large"
              />

              <div
                style={{
                  background: "#f8f9fc",
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ fontSize: 12 }}>Raw value:</Text>
                  <Tag color="orange">&quot;{searchInput}&quot;</Tag>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12 }}>Debounced ({debounceDelay}ms):</Text>
                  <Tag color="green">&quot;{debouncedWithCustomDelay}&quot;</Tag>
                </div>
              </div>

              <Text type="secondary" style={{ fontSize: 11 }}>
                {searchInput !== debouncedWithCustomDelay
                  ? `⏳ Waiting ${debounceDelay}ms...`
                  : "✓ In sync"}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/custom-hooks" currentLevel="medium" />
    </div>
  );
}
