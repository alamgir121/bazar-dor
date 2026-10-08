import { formatPct } from "@/lib/format";
export default function PriceBadge({ dir, pct, size = "sm" }: { dir: "up" | "down" | "flat"; pct: number; size?: "sm" | "md" }) {
  const color = dir === "up" ? "text-[#d03739]" : dir === "down" ? "text-[#1a9951]" : "text-base-content";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
  const txt = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={`inline-flex items-center gap-1 ${txt} ${color}`}>
      <span>{arrow}</span><span className="font-semibold">{formatPct(dir === "flat" ? 0 : pct)}</span>
    </span>
  );
}
