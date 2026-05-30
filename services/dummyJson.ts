import { API_URLS } from "@/lib/constants";
import type { Product, ProductsResponse } from "@/types/product";

const BASE = API_URLS.dummyJson;

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products?limit=${limit}&skip=${skip}`);
  return res.json();
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`);
  return res.json();
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}`);
  return res.json();
}
