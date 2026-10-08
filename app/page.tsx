"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useProducts } from "@/lib/api";
import { banglaDate, toBn } from "@/lib/format";
import ProductCard, { ProductGrid, SkeletonGrid } from "@/components/ProductCard";

export default function Home() {
  const { data, error } = useProducts();
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);
  const risers = data ? [...data].filter((p) => p.change.dir === "up").sort((a, b) => b.change.pct - a.change.pct).slice(0, 6) : [];
  const fallers = data ? [...data].filter((p) => p.change.dir === "down").sort((a, b) => a.change.pct - b.change.pct).slice(0, 6) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6">
      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100">
        <div className="flex flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row md:px-4">
          <div className="flex max-w-xl flex-col items-start gap-2 md:pl-4">
            <span className="min-h-7 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{date || "\u00a0"}</span>
            <h1 className="mt-1 text-3xl font-bold leading-tight md:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
            <p className="mt-2 text-base leading-6">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
            <a href="#সব-পণ্য" className="btn btn-primary mt-4">সব পণ্য দেখুন</a>
          </div>
          <Image src="/bazar-hero.png" alt="ফলের ঝুড়ি" width={315} height={263} priority className="h-auto w-64 md:mr-6 md:w-[315px]" />
        </div>
      </section>

      {error && <p className="rounded-xl border border-error/40 bg-base-100 p-4 text-error">ডাটা লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।</p>}

      <Section title="আজ দাম বেড়েছে" icon="▲" iconClass="text-[#d03739]">
        {data ? <ProductGrid>{risers.map((p) => <ProductCard key={p.id} p={p} />)}</ProductGrid> : <SkeletonGrid />}
      </Section>
      <Section title="আজ দাম কমেছে" icon="▼" iconClass="text-[#1a9951]">
        {data ? <ProductGrid>{fallers.map((p) => <ProductCard key={p.id} p={p} />)}</ProductGrid> : <SkeletonGrid />}
      </Section>

      <section id="সব-পণ্য" className="scroll-mt-nav space-y-3">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="text-sm opacity-70">{data ? `মোট ${toBn(data.length)}টি পণ্য দেখানো হচ্ছে` : "লোড হচ্ছে…"}</p>
        {data ? <ProductGrid>{data.map((p) => <ProductCard key={p.id} p={p} />)}</ProductGrid> : <SkeletonGrid n={9} />}
      </section>
    </div>
  );
}

function Section({ title, icon, iconClass, children }: { title: string; icon: string; iconClass: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-xl font-bold"><span className={`text-base font-normal ${iconClass}`}>{icon}</span>{title}</h2>
      {children}
    </section>
  );
}
