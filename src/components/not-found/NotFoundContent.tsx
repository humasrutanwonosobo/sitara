"use client";

import Link from "next/link";
import { Frown, Home } from "lucide-react";

export default function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14] px-5">
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-teal-500/[0.04] blur-[100px]" />

      <div className="relative text-center max-w-md">
        {/* 404 big text */}
        <p className="text-[120px] sm:text-[160px] font-black leading-none text-white/[0.04] select-none pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          404
        </p>

        {/* Icon */}
        <div className="relative w-18 h-18 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
          <Frown className="h-8 w-8 text-teal-400" />
        </div>

        <h1 className="relative text-2xl font-black text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p className="relative text-sm text-white/40 leading-relaxed mb-8">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. Periksa kembali URL atau kembali ke beranda.
        </p>

        <div className="relative flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-500/30 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Ke Beranda
          </Link>
          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Cek Tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
