"use client";

// useDeferredValue: Medium
// Concept: Deferred filter over a large real dataset from PokéAPI.
// The input (urgent) updates instantly while the list (non-urgent) defers.
// This is the real-world version of the easy example, using the same pattern with real data.

import { useEffect, useDeferredValue, useState } from "react";
import { Avatar, Card, Col, Input, Row, Spin, Tag, Typography, Empty } from "antd";
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

function PokemonGrid({ pokemon, query }: { pokemon: PokemonListItem[]; query: string }) {
  const filtered = pokemon.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  if (filtered.length === 0) return <Empty description="No Pokémon match" />;

  return (
    <Row gutter={[8, 8]}>
      {filtered.map((p) => {
        const id = getPokemonId(p.url);
        return (
          <Col key={p.name} xs={8} sm={6} md={4} lg={3}>
            <div
              style={{
                textAlign: "center",
                padding: 6,
                background: "#f8f9fc",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
              }}
            >
              <Avatar
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                size={40}
                shape="square"
              />
              <div
                style={{ fontSize: 10, marginTop: 2, textTransform: "capitalize", fontWeight: 500 }}
              >
                {p.name}
              </div>
              <Tag style={{ fontSize: 9, margin: "2px 0 0" }}>#{id}</Tag>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default function UseDeferredValueMediumPage() {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  useEffect(() => {
    getPokemonList(151).then((data) => {
      setAllPokemon(data.results);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageIntro
        sourcePath="app/modern-hooks/use-deferred-value/medium/page.tsx"
        title="useDeferredValue"
        level="medium"
        apiUsed="PokéAPI"
        description="Filtering 151 Pokémon with useDeferredValue. The search input is instant; the grid re-renders as a deferred update. The opacity hint shows when the display is stale."
        teaches={[
          "Applying useDeferredValue to a real API dataset",
          "Opacity transition as a visual stale indicator",
          "The filter runs on deferredQuery, not query directly",
          "Deferred value always lags one render behind the real value",
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
              placeholder="Search Pokémon..."
              size="large"
              style={{ marginBottom: 16 }}
              allowClear
            />

            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <div style={{ opacity: isStale ? 0.6 : 1, transition: "opacity 0.15s" }}>
                <PokemonGrid pokemon={allPokemon} query={deferredQuery} />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            title="Deferred State"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none" }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2.2 }}>
              <div>
                <span style={{ color: "#569cd6" }}>query: </span>
                <span style={{ color: "#ce9178" }}>&quot;{query}&quot;</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>deferred: </span>
                <span style={{ color: "#b5cea8" }}>&quot;{deferredQuery}&quot;</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>isStale: </span>
                <span style={{ color: isStale ? "#dcdcaa" : "#b5cea8" }}>{String(isStale)}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>total: </span>
                <span style={{ color: "#d4d4d4" }}>{allPokemon.length}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-deferred-value" currentLevel="medium" />
    </div>
  );
}
