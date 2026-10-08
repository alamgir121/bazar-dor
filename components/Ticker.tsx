"use client";
import { useProducts } from "@/lib/api";
import { formatPct, formatPrice, unitBn } from "@/lib/format";

export default function Ticker() {
  const { data } = useProducts();
  return (
    <div className="relative z-0 ticker h-[37px] overflow-hidden border-b border-base-300 bg-base-100" aria-label="দামের তালিকা">
      {data ? (
        <div className="ticker-track flex w-max animate-ticker">
          {[...data, ...data].map((p, i) => {
            const c = p.change.dir === "up" ? "text-[#d03739]" : p.change.dir === "down" ? "text-[#1a9951]" : "";
            const arrow = p.change.dir === "up" ? "▲" : p.change.dir === "down" ? "▼" : "—";
            return (
              <div key={i} className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-base-200 py-2 pl-4 pr-[17px] text-sm" aria-hidden={i >= data.length}>
                <span>{p.image}</span>
                <span className="font-medium">{p.nameBn}</span>
                <span className="ml-1">{formatPrice(p.today)} টাকা/{unitBn(p.unit)}</span>
                <span className={`ml-1 font-semibold ${c}`}>{arrow} {formatPct(p.change.dir === "flat" ? 0 : p.change.pct)}</span>
              </div>
            );
          })}
        </div>
      ) : <div className="skeleton h-full w-full rounded-none" />}
    </div>
  );
}
