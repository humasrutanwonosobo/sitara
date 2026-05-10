import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function PublicNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#080c14] px-5 py-16 min-h-[60vh]">
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-teal-500/[0.04] blur-[100px]" />

      <div className="relative text-center max-w-sm">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-5">
          <FileSearch className="h-7 w-7 text-teal-400" />
        </div>

        <h2 className="text-xl font-black text-white mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-white/35 leading-relaxed mb-8">
          Konten yang Anda cari tidak tersedia. Mungkin URL salah atau halaman telah dihapus.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-teal-500/30 active:scale-95"
          >
            Beranda
          </Link>
          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            Cek Tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
