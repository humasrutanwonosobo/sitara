"use client";

import Link from "next/link";
import { TriangleAlert, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-5">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
          <TriangleAlert className="h-6 w-6 text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-2">
          Halaman ini mengalami masalah. Silakan muat ulang atau kembali ke dashboard.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono mb-6">Ref: {error.digest}</p>
        )}
        {!error.digest && <div className="mb-6" />}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Muat Ulang
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors border border-slate-200"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
