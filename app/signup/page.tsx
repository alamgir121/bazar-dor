"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";
import AuthShell, { Divider, Field, SocialButtons } from "@/components/AuthShell";

export default function SignUpPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  function fail(m: string) { setError(m); toast.error(m); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!f.name.trim()) return fail("আপনার নাম দিন");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return fail("সঠিক ইমেইল দিন");
    if (f.password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (f.password !== f.confirm) return fail("পাসওয়ার্ড দুটি মেলেনি");
    setBusy(true);
    const { error } = await signUp.email({ name: f.name.trim(), email: f.email.trim(), password: f.password });
    setBusy(false);
    if (error) return fail(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন");
    router.push("/signin");
  }
  async function social(provider: "google" | "github") {
    setBusy(true);
    const { error } = await signIn.social({ provider, callbackURL: "/" });
    if (error) { setBusy(false); fail("সোশ্যাল সাইন ইন করা যায়নি"); }
  }

  return (
    <AuthShell title="অ্যাকাউন্ট তৈরি করুন" subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।">
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="নাম"><input autoComplete="name" className="input w-full" placeholder="যেমন: নাম" value={f.name} onChange={set("name")} /></Field>
        <Field label="ইমেইল"><input type="email" autoComplete="email" className="input w-full" placeholder="you@example.com" value={f.email} onChange={set("email")} /></Field>
        <Field label="পাসওয়ার্ড"><input type="password" autoComplete="new-password" className="input w-full" placeholder="কমপক্ষে ৮ অক্ষর" value={f.password} onChange={set("password")} /></Field>
        <Field label="পাসওয়ার্ড নিশ্চিত করুন"><input type="password" autoComplete="new-password" className="input w-full" placeholder="আবার লিখুন" value={f.confirm} onChange={set("confirm")} /></Field>
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? <span className="loading loading-spinner loading-sm" /> : "অ্যাকাউন্ট তৈরি করুন"}</button>
        <Divider />
        <SocialButtons onSocial={social} busy={busy} />
        <p className="text-center text-sm">অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-primary hover:underline">সাইন ইন করুন</Link></p>
      </form>
    </AuthShell>
  );
}
