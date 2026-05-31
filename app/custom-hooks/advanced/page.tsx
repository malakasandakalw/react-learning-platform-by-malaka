/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Custom Hooks: Advanced
// Two production-grade hooks:
//
// useIntersectionObserver: detects when an element enters or leaves the viewport.
// Used for: infinite scroll, lazy image loading, scroll-triggered animations.
// Internally wraps the IntersectionObserver browser API.
//
// usePagination: manages page/limit state and fetches paginated data.
// Composed FROM useFetch: hooks composing other custom hooks is the key pattern.

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Spin,
  Tag,
  Typography,
  Statistic,
  Space,
} from "antd";
import { getProducts } from "@/services/dummyJson";
import type { Product } from "@/types/product";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// ─── useIntersectionObserver ──────────────────────────────────────────────────
// Returns a ref to attach to any element, and a boolean indicating visibility.
// When the element enters the viewport, isIntersecting flips to true.
function useIntersectionObserver(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isIntersecting };
}

// ─── usePagination ────────────────────────────────────────────────────────────
// Manages page state and fetches the right slice of data.
// loadMore appends new items to the existing list (infinite scroll pattern).
function usePagination<T>(fetchFn: (limit: number, skip: number) => Promise<{ products: T[]; total: number }>, pageSize = 8) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const data = await fetchFn(pageSize, page * pageSize);
    setTotal(data.total);
    setItems((prev) => [...prev, ...data.products]);
    setPage((p) => p + 1);
    setHasMore((page + 1) * pageSize < data.total);
    setLoading(false);
  }, [fetchFn, page, pageSize, loading, hasMore]);

  return { items, loading, hasMore, total, loadMore, page };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomHooksAdvancedPage() {
  // Compose the two hooks: observe the sentinel div, trigger loadMore when visible
  const fetchProducts = useCallback(
    (limit: number, skip: number) => getProducts(limit, skip),
    []
  );
  const { items, loading, hasMore, total, loadMore, page } = usePagination<Product>(fetchProducts, 8);
  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  // Load initial batch
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When sentinel enters viewport → load next page
  useEffect(() => {
    if (isIntersecting && !loading && hasMore) {
      loadMore();
    }
  }, [isIntersecting, loading, hasMore, loadMore]);

  return (
    <div>
      <PageIntro
        title="Custom Hooks"
        level="advanced"
        apiUsed="DummyJSON"
        description="Production hooks: useIntersectionObserver wraps the browser's IntersectionObserver API. usePagination manages infinite scroll state. Combined: when the sentinel element enters the viewport, the next page loads automatically."
        teaches={[
          "useIntersectionObserver: wraps a browser API in a hook with proper cleanup",
          "usePagination: manages page/items/hasMore state across async calls",
          "Hook composition: hooks calling other custom hooks",
          "Infinite scroll pattern: sentinel element + IntersectionObserver + pagination",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={17}>
          <Card
            title={`Products: Infinite Scroll (${items.length} / ${total})`}
            style={{ borderRadius: 12 }}
          >
            <Row gutter={[12, 12]}>
              {items.map((product) => (
                <Col xs={12} sm={8} md={6} key={(product as any).id}>
                  <div
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      padding: 10,
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      src={(product as any).thumbnail}
                      size={48}
                      shape="square"
                      style={{ borderRadius: 6, marginBottom: 6 }}
                    />
                    <Text
                      style={{ fontSize: 11, display: "block", fontWeight: 500 }}
                      ellipsis
                    >
                      {(product as any).title}
                    </Text>
                    <Tag style={{ fontSize: 10, marginTop: 4 }}>
                      ${(product as any).price}
                    </Tag>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Sentinel: useIntersectionObserver watches this div */}
            <div ref={sentinelRef} style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
              {loading && <Spin />}
              {!hasMore && !loading && (
                <Text type="secondary" style={{ fontSize: 12 }}>All {total} products loaded</Text>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={7}>
          <Card
            title="Hook State"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
              <div><span style={{ color: "#569cd6" }}>page: </span><span style={{ color: "#b5cea8" }}>{page}</span></div>
              <div><span style={{ color: "#569cd6" }}>loaded: </span><span style={{ color: "#b5cea8" }}>{items.length}</span></div>
              <div><span style={{ color: "#569cd6" }}>total: </span><span style={{ color: "#d4d4d4" }}>{total}</span></div>
              <div><span style={{ color: "#569cd6" }}>hasMore: </span><span style={{ color: hasMore ? "#b5cea8" : "#ce9178" }}>{String(hasMore)}</span></div>
              <div><span style={{ color: "#569cd6" }}>loading: </span><span style={{ color: loading ? "#ce9178" : "#b5cea8" }}>{String(loading)}</span></div>
              <div><span style={{ color: "#569cd6" }}>sentinel visible: </span><span style={{ color: isIntersecting ? "#b5cea8" : "#d4d4d4" }}>{String(isIntersecting)}</span></div>
              <div style={{ marginTop: 12, padding: "8px 10px", background: "#2d2d2d", borderRadius: 6, fontSize: 10 }}>
                <div style={{ color: "#dcdcaa" }}>Flow:</div>
                <div style={{ color: "#d4d4d4" }}>sentinel enters viewport</div>
                <div style={{ color: "#d4d4d4" }}>→ isIntersecting = true</div>
                <div style={{ color: "#d4d4d4" }}>→ loadMore() fires</div>
                <div style={{ color: "#d4d4d4" }}>→ items append</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/custom-hooks" currentLevel="advanced" />
    </div>
  );
}
