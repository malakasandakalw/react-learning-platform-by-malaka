import { API_URLS } from "@/lib/constants";
import type { Pokemon, PokemonListResponse } from "@/types/pokemon";

const BASE = API_URLS.pokeApi;

export async function getPokemonList(
  limit = 151,
  offset = 0
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  return res.json();
}

export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE}/pokemon/${nameOrId}`);
  return res.json();
}
