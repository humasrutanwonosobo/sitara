"use client";

import { useGetTracking, getGetTrackingQueryKey } from "@/lib/api-client";
import { useParams } from "next/navigation";
import {
  Loader2, ArrowLeft, Download, ShieldCheck, CheckCircle2,
  Calendar, MapPin, Phone, User, AlertCircle, Clock, Info, XCircle, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS, TAHAP_ORDER } from "@/lib/constants";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string; label: string }> = {
    aktif: { cls: "bg-blue-500/15 text-blue-300 border-blue-500/25", dot: "bg-blue-400 animate-pulse", label: STATUS_LABELS.aktif },
    selesai: { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", dot: "bg-emerald-400", label: STATUS_LABELS.selesai },
    ditolak: { cls: "bg-red-500/15 text-red-300 border-red-500/25", dot: "bg-red-400", label: STATUS_LABELS.ditolak },
  };
  const s = map[status] || { cls: "bg-white/5 text-white/50 border-white/10", dot: "bg-white/30", label: status };
  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function TrackingDetail() {
  const params = useParams<{ id: string }>();
  const kode = params?.id?.toUpperCase() ?? "";
  const { data, isLoading, isError } = useGetTracking(kode, {
    query: { enabled: !!kode, queryKey: getGetTrackingQueryKey(kode) },
  });
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 32;
      canvas.height = img.height + 32;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 16, 16);
      }
      const a = document.createElement("a");
      a.download = `SITARA-QR-${data?.data?.kodeTracking || kode}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 bg-[#080c14]">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-teal-500/10 blur-2xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/20 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="h-7 w-7 animate-spin text-teal-400" />
          </div>
        </div>
        <div className="text-center animate-fade-in">
          <p className="text-white/60 text-sm font-semibold mb-1">Memuat data tracking</p>
          <p className="text-white/20 text-xs font-mono">{kode}</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !data?.data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24 px-5 text-center bg-[#080c14]">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="h-7 w-7 text-red-400" />
        </div>
        <h2 className="text-lg font-black text-white mb-2">Data Tidak Ditemukan</h2>
        <p className="text-white/35 text-sm mb-8 max-w-xs leading-relaxed">
          ID tidak valid atau data telah dihapus dari sistem. Pastikan URL yang Anda gunakan benar.
        </p>
        <Link href="/tracking">
          <button className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Pencarian
          </button>
        </Link>
      </div>
    );
  }

  const wbp = data.data;
  const riwayat = data.riwayat || [];
  const currentStepIndex = TAHAP_ORDER.indexOf(wbp.tahapSaatIni);
  const isDitolak = wbp.status === "ditolak";
  const isSelesai = wbp.status === "selesai";
  const progressPct = isSelesai ? 100 : Math.round(((currentStepIndex + 1) / TAHAP_ORDER.length) * 100);
  const qrUrl = `${window.location.origin}/tracking/${wbp.kodeTracking || kode}`;
  const initials = wbp.nama.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const progressGradient = isDitolak
    ? "from-red-500 to-rose-500"
    : isSelesai
    ? "from-emerald-500 to-green-400"
    : "from-teal-500 to-emerald-400";

  const progressColor = isDitolak ? "text-red-400" : isSelesai ? "text-emerald-400" : "text-teal-400";

  const avatarCls = isDitolak
    ? "from-red-500/20 to-rose-600/20 border-red-500/20 shadow-red-500/10"
    : isSelesai
    ? "from-emerald-500/20 to-green-600/20 border-emerald-500/20 shadow-emerald-500/10"
    : "from-teal-500/20 to-emerald-600/20 border-teal-500/20 shadow-teal-500/10";

  const avatarTextCls = isDitolak ? "text-red-300" : isSelesai ? "text-emerald-300" : "text-teal-300";

  const heroGlow = isDitolak ? "bg-red-500/6" : isSelesai ? "bg-emerald-500/6" : "bg-teal-500/6";

  return (
    <>
      {/* ── HERO ── */}
      <div className="relative bg-[#080c14] border-b border-white/[0.05] overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full ${heroGlow} blur-[120px] animate-[pulse_8s_ease-in-out_infinite]`} />
          <div className={`absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full ${heroGlow} blur-[100px] animate-[pulse_6s_ease-in-out_infinite_1s]`} />
        </div>

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-teal-400/30 animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 rounded-full bg-emerald-400/20 animate-[float_8s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[60%] left-[70%] w-1 h-1 rounded-full bg-teal-300/25 animate-[float_7s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[30%] right-[40%] w-0.5 h-0.5 rounded-full bg-white/20 animate-[float_5s_ease-in-out_infinite_3s]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 pt-8 pb-10">
          <Link href="/tracking">
            <button className="flex items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors text-sm mb-8 group font-medium">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Kembali ke hasil pencarian
            </button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar with glow */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-2xl ${heroGlow} blur-xl scale-150`} />
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br border flex items-center justify-center flex-shrink-0 shadow-xl backdrop-blur-sm ${avatarCls}`}>
                <span className={`text-xl font-black ${avatarTextCls}`}>{initials}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={wbp.status} />
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black border border-white/[0.08] text-white/40 tracking-wider">
                  {JENIS_LAYANAN_LABELS[wbp.jenisLayanan]}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-1.5">
                {wbp.nama}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm text-white/30 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-lg">
                  {wbp.nomorRegistrasi}
                </span>
                <span className="text-xs text-white/25 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Diperbarui {new Date(wbp.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Overall progress — circular */}
            <div className="hidden md:flex flex-col items-center flex-shrink-0">
              <div className="relative w-20 h-20">
                {/* Background circle */}
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPct / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={isDitolak ? "#ef4444" : isSelesai ? "#10b981" : "#14b8a6"} />
                      <stop offset="100%" stopColor={isDitolak ? "#f43f5e" : isSelesai ? "#34d399" : "#34d399"} />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-lg font-black ${progressColor}`}>{progressPct}%</span>
                </div>
              </div>
              <p className="text-[10px] text-white/25 mt-2 text-center font-medium">
                {isSelesai ? "Selesai" : isDitolak ? "Ditolak" : `${currentStepIndex + 1}/${TAHAP_ORDER.length}`}
              </p>
            </div>
          </div>

          {/* Mobile progress */}
          <div className="md:hidden mt-5 pt-5 border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-white/25 uppercase tracking-widest font-bold">
                {isDitolak ? "Ditolak pada Tahap" : "Progress"}
              </span>
              <span className={`text-sm font-black ${progressColor}`}>{progressPct}%</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${progressGradient} rounded-full`} style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* ── REJECTION BANNER ── */}
          {isDitolak && wbp.catatan && (
            <div className="mt-6 flex items-start gap-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-4.5 w-4.5 text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Alasan Penolakan</p>
                <p className="text-sm text-red-200/80 leading-relaxed">{wbp.catatan}</p>
              </div>
            </div>
          )}
          {isDitolak && !wbp.catatan && (
            <div className="mt-6 flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-2xl px-5 py-3.5">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300/60">Permohonan ditolak. Hubungi petugas Rumah Tahanan Negara Kelas IIB Wonosobo untuk keterangan lebih lanjut.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="bg-[#080c14] min-h-[60vh] relative">
        {/* Subtle gradient mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-teal-500/[0.02] rounded-full blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] bg-emerald-500/[0.02] rounded-full blur-[80px]" />
        </div>

        {/* Celebration banner for selesai */}
        {isSelesai && (
          <div className="max-w-5xl mx-auto px-5 pt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20 rounded-2xl px-5 py-4 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-300">Proses Reintegrasi Selesai</p>
                <p className="text-xs text-emerald-400/60 mt-0.5">SK telah terbit dan diterima. Selamat atas keberhasilan proses reintegrasi.</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative max-w-5xl mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── TIMELINE ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tahapan */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/[0.12] transition-colors duration-500">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDitolak ? "bg-red-500/10 border border-red-500/20" : isSelesai ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-teal-500/10 border border-teal-500/20"}`}>
                  {isDitolak
                    ? <XCircle className="h-4 w-4 text-red-400" />
                    : isSelesai
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    : <CheckCircle2 className="h-4 w-4 text-teal-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Tahapan Proses Reintegrasi</h3>
                  <p className="text-xs text-white/30">
                    {isDitolak ? "Proses dihentikan — lihat alasan di atas" : isSelesai ? "Seluruh tahap telah selesai" : "Urutan verifikasi hingga SK terbit"}
                  </p>
                </div>
              </div>

              <div className="p-5">
                {TAHAP_ORDER.map((tahap, index) => {
                  const isCompleted = index < currentStepIndex || wbp.status === "selesai";
                  const isCurrent = index === currentStepIndex && wbp.status !== "selesai";
                  const isRejected = index === currentStepIndex && wbp.status === "ditolak";
                  const isFuture = index > currentStepIndex && wbp.status !== "selesai";
                  const riwayatItem = riwayat.find((r) => r.tahap === tahap);
                  const isLast = index === TAHAP_ORDER.length - 1;

                  return (
                    <div key={tahap} className="flex gap-4">
                      {/* Icon + line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        {/* Circle */}
                        {isRejected ? (
                          <div className="w-9 h-9 rounded-full bg-red-500/15 border-2 border-red-500/40 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          </div>
                        ) : isCurrent ? (
                          <div className="relative w-9 h-9">
                            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-40" />
                            <div className="relative w-9 h-9 rounded-full bg-teal-500/20 border-2 border-teal-400/60 flex items-center justify-center">
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                            </div>
                          </div>
                        ) : isCompleted ? (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/20">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                            <span className="text-[10px] sm:text-xs font-bold text-white/20">{index + 1}</span>
                          </div>
                        )}
                        {/* Connector */}
                        {!isLast && (
                          <div className={`w-0.5 flex-1 min-h-5 my-1 rounded-full ${isCompleted ? "bg-gradient-to-b from-teal-500 to-teal-500/30" : isCurrent ? "bg-gradient-to-b from-teal-400/50 to-white/5" : "bg-white/[0.05]"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`${isLast ? "pb-0" : "pb-5"} flex-1 pt-1.5`}>
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h4 className={`text-sm font-semibold leading-snug ${isRejected ? "text-red-400" : isCurrent ? "text-teal-300 font-bold" : isCompleted ? "text-white/80" : "text-white/25"}`}>
                            {TAHAP_LABELS[tahap]}
                          </h4>
                          {riwayatItem && (
                            <span className="text-[10px] sm:text-xs font-semibold text-white/20 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full flex-shrink-0">
                              {new Date(riwayatItem.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>

                        {/* Keterangan */}
                        {riwayatItem?.keterangan && (
                          <div className={`mt-2 px-3 py-2.5 rounded-xl text-xs leading-relaxed border ${isRejected ? "bg-red-500/5 border-red-500/15 text-red-300/70" : isCurrent ? "bg-teal-500/5 border-teal-500/15 text-teal-300/70" : "bg-white/[0.03] border-white/[0.06] text-white/35"}`}>
                            {riwayatItem.keterangan}
                          </div>
                        )}

                        {isCurrent && !riwayatItem?.keterangan && (
                          <p className="text-xs text-teal-400/60 mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
                            Sedang dalam proses pengerjaan...
                          </p>
                        )}

                        {isFuture && (
                          <p className="text-xs text-white/15 mt-1">Menunggu tahap sebelumnya selesai</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data Pribadi */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/[0.12] transition-colors duration-500">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                  <User className="h-4 w-4 text-white/40" />
                </div>
                <h3 className="font-bold text-white text-sm">Informasi Warga Binaan</h3>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: User, label: "Jenis Kelamin",
                    value: wbp.jenisKelamin === "L" ? "Laki-laki" : wbp.jenisKelamin === "P" ? "Perempuan" : "—"
                  },
                  { icon: MapPin, label: "Tempat Lahir", value: wbp.tempatLahir || "—" },
                  {
                    icon: Calendar, label: "Tanggal Lahir",
                    value: wbp.tanggalLahir
                      ? new Date(wbp.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "—"
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className="h-3 w-3 text-white/25" />
                      <p className="text-[10px] sm:text-xs text-white/25 uppercase tracking-wider font-bold">{label}</p>
                    </div>
                    <p className="text-sm font-semibold text-white/70">{value}</p>
                  </div>
                ))}
              </div>

              {/* Catatan */}
              {wbp.catatan && (
                <div className="mx-5 mb-5 bg-teal-500/5 border border-teal-500/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-3.5 w-3.5 text-teal-400" />
                    <p className="text-[10px] sm:text-xs font-bold text-teal-400 uppercase tracking-wider">Keterangan Petugas</p>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{wbp.catatan}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4">
            {/* QR Code */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm hover:border-teal-500/20 transition-all duration-500 group/qr">
              <div className="text-center mb-4">
                <h3 className="font-bold text-white text-sm mb-1">QR Code Status</h3>
                <p className="text-xs text-white/30">Scan untuk akses cepat ke halaman ini</p>
              </div>
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-500" />
                  <div className="relative p-3.5 bg-white rounded-2xl shadow-lg">
                    <QRCodeSVG value={qrUrl} size={140} level="H" includeMargin={false} ref={qrRef} />
                  </div>
                </div>
              </div>
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-teal-500/30 text-white/50 hover:text-teal-300 text-sm font-semibold py-2.5 rounded-xl transition-all group"
              >
                <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                Download QR Code
              </button>
            </div>

            {/* Info Kontak */}
            {(wbp.namaKontakKeluarga || wbp.nomorHpKeluarga) && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm hover:border-green-500/20 transition-colors duration-500">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Phone className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Kontak Keluarga</h3>
                </div>
                <div className="space-y-2">
                  {wbp.namaKontakKeluarga && (
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3.5 py-2.5">
                      <p className="text-[10px] sm:text-xs text-white/25 mb-0.5">Nama</p>
                      <p className="text-sm font-semibold text-white/70">{wbp.namaKontakKeluarga}</p>
                    </div>
                  )}
                  {wbp.nomorHpKeluarga && (
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3.5 py-2.5">
                      <p className="text-[10px] sm:text-xs text-white/25 mb-0.5">Nomor WhatsApp</p>
                      <p className="text-sm font-mono font-semibold text-white/70">{wbp.nomorHpKeluarga}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bantuan */}
            <div className="relative bg-gradient-to-br from-teal-900/40 to-emerald-900/20 border border-teal-500/20 rounded-2xl p-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/8 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-4 w-4 text-teal-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Perlu Bantuan?</h3>
                <p className="text-xs text-white/35 mb-4 leading-relaxed">
                  Hubungi petugas informasi di Rumah Tahanan Negara Kelas IIB Wonosobo untuk keterangan lebih lanjut mengenai proses ini.
                </p>
                <div className="space-y-2 text-xs text-white/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-teal-400 flex-shrink-0" />
                    <span>Informasi resmi dari SDP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-teal-400 flex-shrink-0" />
                    <span>Diperbarui oleh petugas berwenang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-teal-400 flex-shrink-0" />
                    <span>Notifikasi WA otomatis ke keluarga</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
