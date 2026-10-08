"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCategories } from "@/lib/api";
import { banglaDate } from "@/lib/format";
import { signOut, useSession } from "@/lib/auth-client";
import Ticker from "./Ticker";

const FALLBACK = [
  ["chal","🍚","চাল"],["dal","🫘","ডাল"],["tel","🛢️","তেল"],["sobji","🥬","সবজি"],
  ["mach","🐟","মাছ"],["mangsho","🍗","মাংস"],["dim-dui","🥛","ডিম-দুধ"],["mosla","🌶️","মসলা"],
].map(([slug, icon, nameBn]) => ({ id: slug, slug, icon, nameBn }));

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: cats } = useCategories();
  const { data: session, isPending } = useSession();
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => setDate(banglaDate()), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const list = cats ?? FALLBACK;
  const user = session?.user;

  async function logout() {
    setOpen(false);
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-40">
      <header className="border-b border-base-300 bg-base-100/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg text-primary-content">🛒</span>
            <span className="leading-none">
              <span className="block text-xl font-bold leading-7 tracking-tight">বাজার দর</span>
              <span className="block min-h-4 text-xs">{date}</span>
            </span>
          </Link>

          {isPending ? <div className="skeleton h-10 w-28 rounded-lg" /> : user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}
                className="flex h-10 items-center gap-2 rounded-lg px-[3px] pr-3 text-sm font-medium hover:bg-base-200">
                <Avatar name={user.name} image={user.image} size={36} />
                <span className="hidden max-w-24 truncate sm:inline">{user.name.split(" ")[0]}</span>
                <span className="text-xs">▾</span>
              </button>
              {open && (
                <div role="menu" className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-base-300 bg-base-100 p-[9px] shadow-lg">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs opacity-70">{user.email}</p>
                  </div>
                  <Link href="/profile" role="menuitem" className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-base-200">👤 আমার প্রোফাইল</Link>
                  <button onClick={logout} role="menuitem" className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-error hover:bg-base-200">↩ সাইন আউট</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">সাইন আপ</Link>
            </div>
          )}
        </div>

        <nav className="border-t border-base-200 bg-base-100" aria-label="ক্যাটাগরি">
          <ul className="no-scrollbar mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
            {list.map((c) => {
              const active = pathname === `/category/${c.slug}`;
              return (
                <li key={c.slug} className="shrink-0">
                  <Link href={`/category/${c.slug}`} aria-current={active ? "page" : undefined}
                    className={`flex h-8 items-center gap-1.5 rounded-lg border px-[13px] text-xs font-semibold transition ${
                      active ? "border-[#047c37] bg-[#047f39] text-primary-content" : "border-transparent hover:bg-base-200"}`}>
                    <span>{c.icon}</span><span>{c.nameBn}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <Ticker />
    </div>
  );
}

export function Avatar({ name, image, size = 80 }: { name: string; image?: string | null; size?: number }) {
  const r = size >= 80 ? "rounded-2xl" : "rounded-[10px]";
  
  if (image) return <img src={image} alt={name} width={size} height={size} style={{ width: size, height: size }} className={`${r} object-cover`} />;
  return (
    <span style={{ width: size, height: size }} className={`flex items-center justify-center ${r} bg-primary font-bold text-primary-content`}>
      <span style={{ fontSize: size / 2.4 }}>{(name || "?").trim().charAt(0).toUpperCase()}</span>
    </span>
  );
}
