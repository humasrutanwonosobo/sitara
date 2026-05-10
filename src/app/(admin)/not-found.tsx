import Link from "next/link";
import { FileSearch, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-5">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-5">
          <FileSearch className="h-6 w-6 text-slate-400" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Menu atau halaman yang Anda akses tidak tersedia di dashboard.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
