"use client";

// useCallback: Advanced
// Concept: Custom hooks that return memoized callbacks.
// When you extract logic into a custom hook, the callbacks inside
// must still be memoized if consumers pass them as props or effects.
// This example builds useProductSearch: a reusable hook that returns
// stable search and clear functions along with results.

import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Rate,
  Row,
  Spin,
  Tag,
  Typography,
  Space,
  Badge,
} from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { searchProducts } from "@/services/dummyJson";
import type { Product } from "@/types/product";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// Custom hook: useProductSearch
// Returns stable callbacks so consumers can safely put them in useEffect deps
// or pass them to memoized children without causing re-render loops.
function useProductSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [callCount, setCallCount] = useState(0);

  // search is a stable function reference so consumers can put it in useEffect deps
  // without worrying about infinite loops.
  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setCallCount((c) => c + 1);
    try {
      const data = await searchProducts(q);
      setResults(data.products);
    } finally {
      setLoading(false);
    }
  }, []); // []: no external deps, uses functional updaters

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  // Debounced auto-search: safe to list 'search' in deps because it is memoized
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 500);
    return () => clearTimeout(timer);
    // 'search' is stable (useCallback []) so this effect only re-runs when query changes
  }, [query, search]);

  return { results, loading, query, setQuery, search, clear, callCount };
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        background: "#f8f9fc",
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <Avatar src={product.thumbnail} size={56} shape="square" style={{ borderRadius: 6 }} />
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: 13 }}>{product.title}</Text>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <Tag>{product.category}</Tag>
          <Rate disabled value={product.rating} style={{ fontSize: 11 }} allowHalf />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <Text strong>${product.price}</Text>
          <Text type="success" style={{ fontSize: 12 }}>
            -{product.discountPercentage.toFixed(0)}%
          </Text>
        </div>
      </div>
    </div>
  );
}

export default function UseCallbackAdvancedPage() {
  const { results, loading, query, setQuery, clear, callCount } = useProductSearch();

  return (
    <div>
      <PageIntro
        title="useCallback"
        level="advanced"
        apiUsed="DummyJSON"
        description="Custom hooks that return functions must memoize those functions with useCallback. Otherwise, consumers cannot safely add them to useEffect dependency arrays because they would trigger infinite re-render loops."
        teaches={[
          "Custom hooks should return stable (memoized) callbacks",
          "A stable callback can safely appear in a useEffect dependency array",
          "If a callback changes every render, any useEffect depending on it loops infinitely",
          "useCallback in a hook is the same as in a component: the same rules apply",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card title="Product Search (via useProductSearch hook)" style={{ borderRadius: 12 }}>
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search products (auto-searches after 500ms)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="large"
              />
              <Button icon={<ClearOutlined />} onClick={clear} size="large">
                Clear
              </Button>
            </Space.Compact>

            {loading ? (
              <div style={{ textAlign: "center", padding: 32 }}><Spin /></div>
            ) : results.length === 0 ? (
              <Empty
                description={query ? "No products found" : "Type to search products"}
                style={{ padding: 32 }}
              />
            ) : (
              results.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Hook Inspector"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none", borderRadius: 8 }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2 }}>
              <div>
                <span style={{ color: "#569cd6" }}>query: </span>
                <span style={{ color: "#ce9178" }}>&quot;{query}&quot;</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>API calls made: </span>
                <span style={{ color: "#b5cea8" }}>{callCount}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>results: </span>
                <span style={{ color: "#d4d4d4" }}>{results.length}</span>
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#2d2d2d", borderRadius: 6 }}>
                <div style={{ color: "#569cd6", marginBottom: 4 }}>search() deps:</div>
                <code style={{ color: "#dcdcaa" }}>[]</code>
                <div style={{ color: "#6a9955", fontSize: 10, marginTop: 4 }}>
                  stable: safe in useEffect deps
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#2d2d2d", borderRadius: 6 }}>
                <div style={{ color: "#569cd6", marginBottom: 4 }}>debounce effect deps:</div>
                <code style={{ color: "#b5cea8" }}>[query, search]</code>
                <div style={{ color: "#6a9955", fontSize: 10, marginTop: 4 }}>
                  search is stable → no infinite loop
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-callback" currentLevel="advanced" />
    </div>
  );
}
