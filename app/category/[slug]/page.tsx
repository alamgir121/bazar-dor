"use client";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCategories, useProducts } from "@/lib/api";
import { toBn } from "@/lib/format";
import ProductCard, { ProductGrid, SkeletonGrid } from "@/components/ProductCard";
import NotFoundView from "@/components/NotFoundView";

type Sort = "default" | "asc" | "desc";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: cats } = useCategories();
  const { data: products, error } = useProducts();
  const [sort, setSort] = useState<Sort>("default");
  const loading = !cats || !products;
  const cat = cats?.find((c) => c.slug === slug);

  const items = useMemo(() => {
    const l = (products ?? []).filter((p) => p.category === slug);
    if (sort === "asc") return [...l].sort((a, b) => Number(a.today) - Number(b.today));
    if (sort === "desc") return [...l].sort((a, b) => Number(b.today) - Number(a.today));
    return l;
  }, [products, slug, sort]);

  if (error) return <Wrap><NotFoundView title="ডাটা লোড করা যায়নি" text="ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।" /></Wrap>;
  if (!loading && (!cat || items.length === 0)) return <Wrap><NotFoundView title="ক্যাটাগরিটি পাওয়া যায়নি" text="এই ক্যাটাগরিতে কোনো পণ্য নেই বা ঠিকানাটি ভুল।" /></Wrap>;

  return (
    <Wrap>
      <div className="space-y-6">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-[21px]">
          {loading ? <div className="skeleton h-[52px] w-64" /> : (
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-10">{cat!.icon}</span>
              <div>
                <h1 className="text-2xl font-bold leading-8">{cat!.nameBn}</h1>
                <p className="text-sm opacity-70">{toBn(items.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2 rounded-2xl border border-base-300 bg-base-100 p-[17px]">
            <label htmlFor="sort" className="text-sm">সাজান</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              className="select select-sm !border-base-content !text-xs">
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
          </div>
          <p className="text-sm opacity-70">{loading ? "লোড হচ্ছে…" : `মোট ${toBn(items.length)}টি পণ্য দেখানো হচ্ছে`}</p>
          {loading ? <SkeletonGrid n={6} /> : <ProductGrid>{items.map((p) => <ProductCard key={p.id} p={p} />)}</ProductGrid>}
        </div>
      </div>
    </Wrap>
  );
}
const Wrap = ({ children }: { children: React.ReactNode }) => <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>;
