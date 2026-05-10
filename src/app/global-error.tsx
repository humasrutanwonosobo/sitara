"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <div className="fixed inset-0 flex items-center justify-center bg-[#080c14] px-5">
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
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-500/[0.06] blur-[120px]" />

          <div className="relative text-center max-w-md">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-9 w-9 text-red-400" />
            </div>

            <h1 className="text-2xl font-black text-white mb-3">Terjadi Kesalahan Sistem</h1>
            <p className="text-sm text-white/40 leading-relaxed mb-2">
              Aplikasi mengalami error yang tidak terduga. Tim kami telah diberitahu dan sedang memperbaikinya.
            </p>
            {error.digest && (
              <p className="text-xs text-white/20 font-mono mb-8">Kode: {error.digest}</p>
            )}
            {!error.digest && <div className="mb-8" />}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-500/30 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Ke Beranda
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
