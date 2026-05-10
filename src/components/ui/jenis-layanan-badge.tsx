import { JENIS_LAYANAN_LABELS } from "@/lib/constants";

const LAYANAN_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  PB:        { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500"   },
  CB:        { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  CMB:       { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  ASIMILASI: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
};

interface Props {
  code: string;
  full?: boolean;
  size?: "sm" | "xs";
}

export function JenisLayananBadge({ code, full = false, size = "sm" }: Props) {
  const s = LAYANAN_STYLE[code] ?? { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };
  const label = full ? (JENIS_LAYANAN_LABELS[code] ?? code) : code;
  const textSize = size === "xs" ? "text-[10px] sm:text-xs" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize} font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {label}
    </span>
  );
}
