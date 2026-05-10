"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#080c14] px-5 py-16 min-h-[60vh]">
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-red-500/[0.04] blur-[100px]" />

      <div className="relative text-center max-w-sm">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <TriangleAlert className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="text-xl font-black text-white mb-2">Terjadi Kesalahan</h2>
        <p className="text-sm text-white/35 leading-relaxed mb-2">
          Halaman gagal dimuat. Silakan coba lagi atau kembali ke beranda.
        </p>
        {error.digest && (
          <p className="text-xs text-white/15 font-mono mb-8">Ref: {error.digest}</p>
        )}
        {!error.digest && <div className="mb-8" />}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-teal-500/30 active:scale-95"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
