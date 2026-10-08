"use client";
import { useEffect, useState } from "react";

export type Market = { market: string; division: string; min: number; max: number };
export type Product = {
  id: number; slug: string; nameBn: string; category: string; categoryNameBn: string; categoryIcon: string;
  unit: string; image: string; today: number; yesterday: number; lastWeek: number; lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number }; markets: Market[];
};
export type Category = { id: string; slug: string; nameBn: string; icon: string };

const BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];
const cache = new Map<string, Promise<unknown>>();

async function get<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    const p = (async () => {
      let lastErr: unknown;
      for (const b of BASES) {
        try {
          const r = await fetch(b + path);
          if (!r.ok) throw new Error(String(r.status));
          return (await r.json()) as T;
        } catch (e) { lastErr = e; }
      }
      throw lastErr;
    })();
    p.catch(() => cache.delete(path));
    cache.set(path, p);
  }
  return cache.get(path) as Promise<T>;
}

export const fetchProducts = () => get<Product[]>("/products");
export const fetchCategories = () => get<Category[]>("/categories");

function useAsync<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    fn().then((d) => alive && setData(d)).catch(() => alive && setError(true));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, loading: !data && !error };
}
export const useProducts = () => useAsync(fetchProducts);
export const useCategories = () => useAsync(fetchCategories);

export function marketStats(p: Product) {
  const rows = p.markets.map((m) => ({ ...m, avg: (m.min + m.max) / 2 })).sort((a, b) => a.avg - b.avg);
  const min = Math.min(...p.markets.map((m) => m.min));
  const max = Math.max(...p.markets.map((m) => m.max));
  const avg = Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length);
  return { rows, min, max, avg };
}
