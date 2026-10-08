import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatPrice, unitBn } from "@/lib/format";
import PriceBadge from "./PriceBadge";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`}
      className="block rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:border-primary/50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl">{p.image}</div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-6">{p.nameBn}</h3>
          <p className="text-xs opacity-70">প্রতি {unitBn(p.unit)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-xs opacity-70">আজকের দাম</p>
          <p className="text-xl font-bold leading-7">{formatPrice(p.today)} <span className="text-base font-bold">টাকা</span></p>
        </div>
        <span className="rounded-full bg-base-200 px-2 py-1"><PriceBadge dir={p.change.dir} pct={p.change.pct} /></span>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-4">
      <div className="flex gap-3"><div className="skeleton size-12 rounded-xl" /><div className="space-y-2"><div className="skeleton h-5 w-28" /><div className="skeleton h-3 w-16" /></div></div>
      <div className="mt-3 flex items-end justify-between"><div className="space-y-2"><div className="skeleton h-3 w-16" /><div className="skeleton h-6 w-24" /></div><div className="skeleton h-6 w-16 rounded-full" /></div>
    </div>
  );
}

export function ProductGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
export const SkeletonGrid = ({ n = 6 }: { n?: number }) => (
  <ProductGrid>{Array.from({ length: n }, (_, i) => <ProductCardSkeleton key={i} />)}</ProductGrid>
);
