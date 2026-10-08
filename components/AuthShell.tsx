import Link from "next/link";
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold leading-8">{title}</h1>
        <p className="text-sm opacity-70">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6">{children}</div>
      <Link href="/" className="text-center text-sm hover:text-primary">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden><path fill="#ea4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285f4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#fbbc05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34a853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
);
const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#1d271f" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
);
export function SocialButtons({ onSocial, busy }: { onSocial: (p: "google" | "github") => void; busy: boolean }) {
  const cls = "btn btn-outline btn-sm sm:btn-md border-base-300 bg-transparent text-base-content hover:bg-base-200 hover:border-base-300";
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button type="button" disabled={busy} onClick={() => onSocial("google")} className={cls}><GoogleIcon />Google দিয়ে চালিয়ে যান</button>
      <button type="button" disabled={busy} onClick={() => onSocial("github")} className={cls}><GithubIcon />GitHub দিয়ে চালিয়ে যান</button>
    </div>
  );
}
export const Divider = () => (
  <div className="flex items-center gap-4 text-xs"><span className="h-px flex-1 bg-base-content/10" />অথবা<span className="h-px flex-1 bg-base-content/10" /></div>
);
