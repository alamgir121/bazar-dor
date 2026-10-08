import Link from "next/link";
export default function NotFoundView({ title = "পেজটি খুঁজে পাওয়া যায়নি", text = "আপনি যে পেজটি খুঁজছেন তা নেই বা সরিয়ে ফেলা হয়েছে।" }: { title?: string; text?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-base-300 bg-base-100 px-6 py-12 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-3 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm opacity-70">{text}</p>
      <Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
