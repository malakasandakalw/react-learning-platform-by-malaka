"use client";

// useMemo: Medium
// Concept: Memoizing a filtered/sorted list.
// This is the most common real-world use of useMemo.
// When the user types in the search box or changes the sort order,
// the filtered list should recompute. But if unrelated state changes
// (like the counter), the expensive filter+sort should be skipped.
// The list is fetched from PokéAPI: 151 original Pokémon.

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
  Badge,
  Button,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getPokemonList } from "@/services/pokeApi";
import type { PokemonListItem } from "@/types/pokemon";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

type SortOrder = "az" | "za" | "id";

function getPokemonId(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

function getPokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export default function UseMemoMediumPage() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("id");
  const [counter, setCounter] = useState(0);
  const [computeCount, setComputeCount] = useState(0);

  useEffect(() => {
    getPokemonList(151).then((data) => {
      setPokemon(data.results);
      setLoading(false);
    });
  }, []);

  // useMemo recomputes only when pokemon, search, or sort changes.
  // Clicking the unrelated counter does NOT trigger re-filtering.
  const filteredAndSorted = useMemo(() => {
    // Side effect for demo purposes: counts how many times this actually runs
    setComputeCount((c) => c + 1);

    const filtered = pokemon.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    return filtered.sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return getPokemonId(a.url) - getPokemonId(b.url); // id order
    });
  }, [pokemon, search, sort]);

  return (
    <div>
      <PageIntro
        title="useMemo"
        level="medium"
        apiUsed="PokéAPI"
        description="Filtering and sorting a list is a perfect use case for useMemo. The computation only needs to re-run when the list data, the search query, or the sort order changes, not on every render."
        teaches={[
          "Memoizing filter + sort operations on large arrays",
          "Multiple dependencies: [data, search, sort]",
          "How computeCount proves the memo is working",
          "Separating data fetching (useEffect) from data transformation (useMemo)",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={17}>
          <Card style={{ borderRadius: 12 }}>
            <Row gutter={12} style={{ marginBottom: 16 }}>
              <Col flex={1}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search Pokémon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                />
              </Col>
              <Col>
                <Select
                  value={sort}
                  onChange={setSort}
                  style={{ width: 140 }}
                  options={[
                    { value: "id", label: "By ID (#)" },
                    { value: "az", label: "A → Z" },
                    { value: "za", label: "Z → A" },
                  ]}
                />
              </Col>
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <Empty description="No Pokémon found" />
            ) : (
              <Row gutter={[8, 8]}>
                {filteredAndSorted.map((p) => {
                  const id = getPokemonId(p.url);
                  return (
                    <Col key={p.name} xs={12} sm={8} md={6} lg={4}>
                      <div
                        style={{
                          background: "#f8f9fc",
                          borderRadius: 8,
                          padding: "8px 4px",
                          textAlign: "center",
                          fontSize: 11,
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <Avatar src={getPokemonSprite(id)} size={40} shape="square" />
                        <div style={{ marginTop: 4, fontWeight: 500, textTransform: "capitalize" }}>
                          {p.name}
                        </div>
                        <Tag style={{ fontSize: 10, margin: "2px 0 0" }}>#{id}</Tag>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={7}>
          <Card
            title="Memo Stats"
            style={{ background: "#1e1e1e", border: "none", borderRadius: 8 }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2 }}>
              <div>
                <span style={{ color: "#569cd6" }}>total Pokémon: </span>
                <span style={{ color: "#d4d4d4" }}>{pokemon.length}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>filtered: </span>
                <span style={{ color: "#ce9178" }}>{filteredAndSorted.length}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>filter+sort ran: </span>
                <span style={{ color: "#b5cea8" }}>{computeCount}x</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>unrelated clicks: </span>
                <span style={{ color: "#d4d4d4" }}>{counter}</span>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text style={{ color: "#6b7280", fontSize: 11 }}>
                Click this and watch computeCount. It should NOT increment.
              </Text>
              <Button
                size="small"
                block
                style={{ marginTop: 8 }}
                onClick={() => setCounter((c) => c + 1)}
              >
                Unrelated state change
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-memo" currentLevel="medium" />
    </div>
  );
}
