"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import AuthShell, { Divider, Field, SocialButtons } from "@/components/AuthShell";

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect");
  const dest = redirect && redirect.startsWith("/") ? redirect : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (sp.get("reason") === "protected" && !shown.current) {
      shown.current = true;
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন");
    }
  }, [sp]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return fail("ইমেইল ও পাসওয়ার্ড দিন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setBusy(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    setBusy(false);
    if (error) return fail("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(dest);
    router.refresh();
  }
  function fail(msg: string) { setError(msg); toast.error(msg); }

  async function social(provider: "google" | "github") {
    setBusy(true);
    const { error } = await signIn.social({ provider, callbackURL: dest });
    if (error) { setBusy(false); fail("সোশ্যাল সাইন ইন করা যায়নি"); }
  }

  return (
    <AuthShell title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="ইমেইল"><input type="email" autoComplete="email" className="input w-full" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="পাসওয়ার্ড"><input type="password" autoComplete="current-password" className="input w-full" placeholder="কমপক্ষে ৮ অক্ষর" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? <span className="loading loading-spinner loading-sm" /> : "সাইন ইন"}</button>
        <Divider />
        <SocialButtons onSocial={social} busy={busy} />
        <p className="text-center text-sm">অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-primary hover:underline">সাইন আপ করুন</Link></p>
      </form>
    </AuthShell>
  );
}
export default function SignInPage() { return <Suspense><SignInForm /></Suspense>; }
