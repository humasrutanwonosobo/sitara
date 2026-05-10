"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSearchTracking, getSearchTrackingQueryKey } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import {
  Loader2, ChevronRight,
  AlertCircle, Sparkles, ShieldCheck, KeyRound, Search,
} from "lucide-react";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS } from "@/lib/constants";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    aktif: { cls: "bg-blue-500/15 text-blue-300 border-blue-500/25", dot: "bg-blue-400 animate-pulse" },
    selesai: { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", dot: "bg-emerald-400" },
    ditolak: { cls: "bg-red-500/15 text-red-300 border-red-500/25", dot: "bg-red-400" },
  };
  const s = map[status] || { cls: "bg-white/5 text-white/40 border-white/10", dot: "bg-white/25" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function LayananBadge({ code }: { code: string }) {
  const color: Record<string, string> = {
    PB:        "text-teal-300   border-teal-500/30   bg-teal-500/10",
    CB:        "text-amber-300  border-amber-500/30  bg-amber-500/10",
    CMB:       "text-indigo-300 border-indigo-500/30 bg-indigo-500/10",
    ASIMILASI: "text-orange-300 border-orange-500/30 bg-orange-500/10",
  };
  return (
    <span className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${color[code] || "text-white/30 border-white/10"}`}>
      {JENIS_LAYANAN_LABELS[code] || code}
    </span>
  );
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [searchInput, setSearchInput] = useState(initialQ);
  const [focused, setFocused] = useState(false);

  const { data, isLoading } = useSearchTracking({ q: q.toUpperCase() }, {
    query: {
      enabled: q.length > 0,
      queryKey: getSearchTrackingQueryKey({ q: q.toUpperCase() }),
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim().toUpperCase();
    if (!trimmed) return;
    setQ(trimmed);
    const url = new URL(window.location.href);
    url.searchParams.set("q", trimmed);
    window.history.pushState({}, "", url.toString());
  };

  const results = data?.data || [];
  const found = results[0];

  return (
    <div className="relative min-h-[calc(100dvh-64px)] bg-[#080c14] overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/[0.06] blur-[120px]" />

      {/* Content */}
      <div className="relative max-w-3xl mx-auto px-5 pt-12 sm:pt-16 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold px-3.5 py-1.5 rounded-full mb-5 tracking-wide">
            <ShieldCheck className="h-3 w-3" />
            Tracking Terverifikasi
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Cek Status Reintegrasi
          </h1>
          <p className="text-sm text-white/35 max-w-md mx-auto leading-relaxed">
            Masukkan kode tracking yang dikirim via WhatsApp untuk melihat status proses terkini.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className={`flex items-center gap-2 bg-white/[0.04] border rounded-2xl p-1.5 transition-all duration-300 ${focused ? "border-teal-500/40 shadow-[0_0_0_4px_rgba(20,184,166,0.08)]" : "border-white/[0.08]"}`}>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0 ml-0.5">
              <Search className="h-4 w-4 text-white/30" />
            </div>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="SITARA-PB-XXXXXXXX"
              className="border-0 focus-visible:ring-0 shadow-none bg-transparent text-white placeholder:text-white/20 text-sm h-10 px-0 font-mono tracking-wider"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold flex-shrink-0 transition-all shadow-sm shadow-teal-500/25 active:scale-95"
            >
              Cari
            </button>
          </div>
          <p className="text-xs text-white/20 mt-3 text-center">
            Contoh: <span className="font-mono text-white/35">SITARA-PB-A3K9X2M7</span>
          </p>
        </form>

        {/* ── Results ── */}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
            <span className="text-sm text-white/40">Mencari <span className="text-white/60 font-mono font-medium">{q}</span>...</span>
          </div>
        )}

        {/* Empty — no query */}
        {!isLoading && !q && (
          <div className="text-center py-12">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 bg-teal-500/8 rounded-2xl blur-2xl" />
              <div className="relative w-16 h-16 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex items-center justify-center">
                <KeyRound className="h-7 w-7 text-white/15" />
              </div>
            </div>
            <p className="text-sm text-white/30 mb-6">Kode tracking dikirim otomatis via WhatsApp saat Warga Binaan didaftarkan.</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["PB · Pembebasan Bersyarat", "CB · Cuti Bersyarat", "CMB · Cuti Menjelang Bebas", "Asimilasi"].map((label) => (
                <span key={label} className="text-xs text-white/20 border border-white/[0.06] rounded-full px-3 py-1">{label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Not found */}
        {!isLoading && q && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="h-6 w-6 text-red-400/70" />
            </div>
            <h3 className="font-bold text-white/70 mb-2">Kode Tidak Ditemukan</h3>
            <p className="text-white/30 text-sm max-w-sm mx-auto mb-1.5 leading-relaxed">
              Kode "<span className="text-white/50 font-mono font-semibold">{q}</span>" tidak terdaftar.
            </p>
            <p className="text-white/20 text-xs max-w-xs mx-auto mb-6">
              Pastikan kode benar atau hubungi petugas untuk mendapatkan kode baru.
            </p>
            <button
              onClick={() => { setSearchInput(""); setQ(""); }}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold transition-colors"
            >
              Reset pencarian
            </button>
          </div>
        )}

        {/* Result found */}
        {!isLoading && found && (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <p className="text-sm text-white/40">
                Ditemukan untuk <span className="text-teal-300 font-mono font-semibold">{q}</span>
              </p>
              <span className="ml-auto text-xs text-white/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Data resmi
              </span>
            </div>

            <Link href={`/tracking/${found.kodeTracking}`}>
              <div className="group relative bg-white/[0.03] border border-teal-500/20 hover:border-teal-500/40 hover:bg-white/[0.05] rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-600/20 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base font-black text-teal-300">
                      {found.nama.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h4 className="font-bold text-white/90 group-hover:text-white transition-colors text-base truncate">
                        {found.nama}
                      </h4>
                      <LayananBadge code={found.jenisLayanan} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-teal-400/70 bg-teal-500/8 border border-teal-500/15 px-2 py-0.5 rounded-md">
                        {found.kodeTracking}
                      </span>
                      <span className="font-mono text-xs text-white/20 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md">
                        {found.nomorRegistrasi}
                      </span>
                    </div>
                  </div>

                  {/* Status + Tahap */}
                  <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge status={found.status} />
                    <p className="text-xs text-white/25 text-right max-w-40 leading-snug line-clamp-2">
                      {TAHAP_LABELS[found.tahapSaatIni]}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 flex items-center justify-center flex-shrink-0 transition-all">
                    <ChevronRight className="h-4 w-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Mobile status */}
                <div className="sm:hidden mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                  <p className="text-xs text-white/25 flex-1 mr-3 leading-snug">
                    {TAHAP_LABELS[found.tahapSaatIni]}
                  </p>
                  <StatusBadge status={found.status} />
                </div>
              </div>
            </Link>

            {/* Security note */}
            <div className="mt-5 flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400/60 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/25 leading-relaxed">
                Data hanya dapat diakses oleh pemegang kode tracking. Jaga kerahasiaan kode Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center bg-[#080c14]"><Loader2 className="h-6 w-6 animate-spin text-teal-400" /></div>}>
      <TrackingContent />
    </Suspense>
  );
}
