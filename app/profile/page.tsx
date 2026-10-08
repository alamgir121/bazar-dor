"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar } from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;
  const [name, setName] = useState("");
  useEffect(() => { if (user) setName(user.name); }, [user]);

  async function logout() {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold leading-8">আমার প্রোফাইল</h1>
        <p className="text-sm opacity-70">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>
      {isPending || !user ? (
        <><div className="skeleton h-[120px] w-full rounded-2xl" /><div className="skeleton h-56 w-full rounded-2xl" /></>
      ) : (
        <>
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-base-300 bg-base-100 p-[25px] sm:flex-row sm:items-center">
            <Avatar name={user.name} image={user.image} size={80} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl leading-7">{user.name}</p>
              <p className="truncate text-base opacity-80">{user.email}</p>
            </div>
            <button onClick={logout} className="btn btn-outline btn-error">↩ সাইন আউট</button>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-[21px]">
            <h2 className="text-lg font-semibold">তথ্য</h2>
            <div className="flex flex-col gap-4 p-6 pt-2">
              <label className="flex flex-col gap-1"><span className="text-sm font-medium">নাম</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="input w-full" /></label>
              <button type="button" onClick={() => router.push(`/profile/update?name=${encodeURIComponent(name.trim() || user.name)}`)} className="btn btn-primary w-full">আপডেট</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}