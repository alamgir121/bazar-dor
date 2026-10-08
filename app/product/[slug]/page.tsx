"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { marketStats, useProducts } from "@/lib/api";
import { formatPrice, unitBn } from "@/lib/format";
import PriceBadge from "@/components/PriceBadge";
import NotFoundView from "@/components/NotFoundView";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, error } = useProducts();
  const p = data?.find((x) => x.slug === slug);

  if (error) return <Wrap><NotFoundView title="ডাটা লোড করা যায়নি" text="ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।" /></Wrap>;
  if (!data) return <Wrap><Skeleton /></Wrap>;
  if (!p) return <Wrap><NotFoundView title="পণ্যটি পাওয়া যায়নি" text="এই পণ্যটি নেই বা ঠিকানাটি ভুল।" /></Wrap>;

  const { rows, min, max, avg } = marketStats(p);
  const diff = Math.abs(p.today - p.yesterday);
  const u = unitBn(p.unit);
  const word = p.change.dir === "up" ? "বেড়েছে" : p.change.dir === "down" ? "কমেছে" : "অপরিবর্তিত";
  const wordColor = p.change.dir === "up" ? "text-[#d03739]" : p.change.dir === "down" ? "text-[#1a9951]" : "";

  return (
    <Wrap>
      <div className="space-y-6">
        <nav aria-label="breadcrumb" className="py-2 text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-primary">হোম</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href={`/category/${p.category}`} className="hover:text-primary">{p.categoryNameBn}</Link></li>
            <li className="opacity-50">/</li>
            <li aria-current="page" className="opacity-70">{p.nameBn}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-100 p-[21px] md:flex-row md:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-4xl">{p.image}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-9">{p.nameBn}</h1>
            <p className="text-sm opacity-70">প্রতি {u} · {p.categoryNameBn}</p>
            <p className="mt-2 text-sm opacity-70">গতকালের তুলনায় আজ দাম{" "}
              <b className={wordColor}>{word}</b>{diff > 0 && <> · {formatPrice(diff)} টাকা</>}</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-base-200 px-5 py-4 text-center md:min-w-36">
            <span className="text-sm opacity-70">আজকের দাম</span>
            <span className="text-3xl font-bold leading-9">{formatPrice(p.today)}</span>
            <span className="text-sm opacity-70">টাকা / {u}</span>
            <span className="mt-1"><PriceBadge dir={p.change.dir} pct={p.change.pct} size="md" /></span>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-base-300 bg-base-100 p-[21px]">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">দামের সারসংক্ষেপ</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Stat label="সর্বনিম্ন দাম" value={min} color="text-[#1a9951]" note="সবচেয়ে কম দামের বাজার" />
              <Stat label="সর্বাধিক দাম" value={max} color="text-[#d03739]" note="সবচেয়ে বেশি দামের বাজার" />
              <Stat label="গড় দাম" value={avg} color="text-primary" note={`প্রতি ${u}-এর হিসাবে`} />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">বাজারভিত্তিক আজকের দাম</h2>
            <div className="overflow-x-auto rounded-2xl border border-base-300">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-base-300 text-left font-bold">
                    <th className="px-4 py-3">বাজার</th><th className="px-4 py-3">বিভাগ</th>
                    <th className="px-4 py-3 text-right">সর্বনিম্ন</th><th className="px-4 py-3 text-right">সর্বাধিক</th><th className="px-4 py-3 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.market} className={`border-b border-base-300/60 last:border-0 ${i % 2 === 1 ? "bg-base-200" : ""}`}>
                      <td className="px-4 py-3 font-medium">{r.market}</td>
                      <td className="px-4 py-3">{r.division}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(r.min)} টাকা</td>
                      <td className="px-4 py-3 text-right">{formatPrice(r.max)} টাকা</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatPrice(r.avg)} টাকা</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </Wrap>
  );
}

function Stat({ label, value, color, note }: { label: string; value: number; color: string; note: string }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-4">
      <p className="text-xs opacity-70">{label}</p>
      <p className={`text-2xl font-bold leading-8 ${color}`}>{formatPrice(value)} <span className="text-2xl">টাকা</span></p>
      <p className="text-xs opacity-70">{note}</p>
    </div>
  );
}
const Skeleton = () => (
  <div className="space-y-6"><div className="skeleton h-5 w-56" /><div className="skeleton h-40 w-full rounded-2xl" /><div className="skeleton h-96 w-full rounded-2xl" /></div>
);
const Wrap = ({ children }: { children: React.ReactNode }) => <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>;
