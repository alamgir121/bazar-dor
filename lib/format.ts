const BN = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
export const toBn = (v: string | number) => String(v).replace(/\d/g, (d) => BN[+d]);

// Bangladeshi grouping: ১,২৯০ / ১,৮৫০ ; two decimals only when fractional
export function formatPrice(n: number) {
  const frac = Math.abs(n - Math.round(n)) > 1e-9;
  return new Intl.NumberFormat("bn-BD", { minimumFractionDigits: frac ? 2 : 0, maximumFractionDigits: 2 }).format(n);
}
export const formatPct = (p: number) => toBn(Math.abs(p).toFixed(1)) + "%";

export const UNIT_BN: Record<string, string> = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };
export const unitBn = (u: string) => UNIT_BN[u] ?? u;

const DAYS = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
export function banglaDate(d = new Date()) {
  return `${DAYS[d.getDay()]}, ${toBn(d.getDate())} ${MONTHS[d.getMonth()]}, ${toBn(d.getFullYear())}`;
}
