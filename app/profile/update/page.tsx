"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser, useSession } from "@/lib/auth-client";
import { Field } from "@/components/AuthShell";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data, isPending } = useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data?.user) setName(data.user.name); }, [data?.user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return void toast.error("নাম খালি রাখা যাবে না");
    setBusy(true);
    const { error } = await updateUser({ name: name.trim() });
    setBusy(false);
    if (error) return void toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold leading-8">তথ্য আপডেট করুন</h1>
        <p className="text-sm opacity-70">আপনার নাম পরিবর্তন করুন।</p>
      </div>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
        {isPending ? <div className="skeleton h-28 w-full" /> : (
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <Field label="নাম"><input className="input w-full" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></Field>
            <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? <span className="loading loading-spinner loading-sm" /> : "তথ্য আপডেট করুন"}</button>
          </form>
        )}
      </div>
      <Link href="/profile" className="text-center text-sm hover:text-primary">← প্রোফাইলে ফিরে যান</Link>
    </div>
  );
}
