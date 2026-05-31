"use client";

// useDeferredValue: Advanced
// Concept: Combining useDeferredValue with useMemo for maximum optimization.
// useMemo skips recomputation when deferredQuery hasn't changed.
// useDeferredValue skips re-rendering the slow component when query is changing rapidly.
// Together: the expensive filter runs only when the deferred value settles,
// AND the component only re-renders when the filtered result actually changes.

import { useEffect, useDeferredValue, useState, useMemo, memo } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Spin,
  Tag,
  Typography,
  Avatar,
  Statistic,
  Empty,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getPokemonList } from "@/services/pokeApi";
import type { PokemonListItem } from "@/types/pokemon";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

function getPokemonId(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

// memo: only re-renders when filteredPokemon reference changes.
// Since filteredPokemon is from useMemo, it only changes when deferredQuery changes.
// So this component only re-renders when the deferred query actually settles.
const FilteredGrid = memo(function FilteredGrid({
  filteredPokemon,
}: {
  filteredPokemon: PokemonListItem[];
}) {
  if (filteredPokemon.length === 0) return <Empty description="No results" />;

  return (
    <Row gutter={[8, 8]}>
      {filteredPokemon.map((p) => {
        const id = getPokemonId(p.url);
        return (
          <Col key={p.name} xs={8} sm={6} md={4} lg={3}>
            <div style={{ textAlign: "center", padding: 6, background: "#f8f9fc", borderRadius: 8, border: "1px solid #f0f0f0" }}>
              <Avatar
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                size={36}
                shape="square"
              />
              <div style={{ fontSize: 10, marginTop: 2, textTransform: "capitalize" }}>{p.name}</div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
});

export default function UseDeferredValueAdvancedPage() {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [memoRunCount, setMemoRunCount] = useState(0);

  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  useEffect(() => {
    getPokemonList(151).then((data) => {
      setAllPokemon(data.results);
      setLoading(false);
    });
  }, []);

  // useMemo: only runs the filter when deferredQuery changes, not on every keypress.
  // Combined with useDeferredValue: the filter runs AFTER the input settles.
  const filteredPokemon = useMemo(() => {
    setMemoRunCount((c) => c + 1);
    return allPokemon.filter((p) =>
      p.name.toLowerCase().includes(deferredQuery.toLowerCase())
    );
    // deferredQuery, not query. This is the key to the combination.
  }, [allPokemon, deferredQuery]);

  return (
    <div>
      <PageIntro
        title="useDeferredValue"
        level="advanced"
        apiUsed="PokéAPI"
        description="The ultimate optimization combo: useDeferredValue delays the render trigger, and useMemo skips the expensive computation until the deferred value settles. React.memo ensures the child only re-renders when the memoized result actually changes."
        teaches={[
          "useDeferredValue + useMemo: deferred trigger + memoized computation",
          "React.memo + useMemo on props = zero wasted renders",
          "memoRunCount proves the filter only runs when deferredQuery settles",
          "Three layers of optimization and why each one is needed",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card style={{ borderRadius: 12 }}>
            <Input
              prefix={<SearchOutlined />}
              suffix={isStale ? <Spin size="small" /> : null}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Pokémon (all 3 optimizations active)..."
              size="large"
              style={{ marginBottom: 16 }}
              allowClear
            />
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : (
              <div style={{ opacity: isStale ? 0.6 : 1, transition: "opacity 0.15s" }}>
                <FilteredGrid filteredPokemon={filteredPokemon} />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            title="Optimization Layers"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{ header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" }, body: { padding: 16 } }}
          >
            <Statistic
              title={<span style={{ color: "#6a9955", fontSize: 11 }}>filter ran (times)</span>}
              value={memoRunCount}
              styles={{ content: { color: "#b5cea8" } }}
            />
            <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "#d4d4d4" }}>
              <div><span style={{ color: "#569cd6" }}>query: </span><span style={{ color: "#ce9178" }}>&quot;{query}&quot;</span></div>
              <div><span style={{ color: "#569cd6" }}>deferred: </span><span style={{ color: "#b5cea8" }}>&quot;{deferredQuery}&quot;</span></div>
              <div><span style={{ color: "#569cd6" }}>results: </span><span style={{ color: "#d4d4d4" }}>{filteredPokemon.length}</span></div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#2d2d2d", borderRadius: 6, fontSize: 10 }}>
                <div style={{ color: "#569cd6" }}>Layer 1: useDeferredValue</div>
                <div style={{ color: "#6a9955" }}>→ delays re-render trigger</div>
                <div style={{ color: "#569cd6", marginTop: 4 }}>Layer 2: useMemo</div>
                <div style={{ color: "#6a9955" }}>→ skips filter when deferred same</div>
                <div style={{ color: "#569cd6", marginTop: 4 }}>Layer 3: React.memo</div>
                <div style={{ color: "#6a9955" }}>→ skips child render when result same</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-deferred-value" currentLevel="advanced" />
    </div>
  );
}
