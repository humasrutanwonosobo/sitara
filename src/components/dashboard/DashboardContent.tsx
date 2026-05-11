"use client";

import { PageShell } from "@/components/layout/PageShell";
import {
  useGetDashboardStats, getGetDashboardStatsQueryKey,
  useGetDashboardRecent, getGetDashboardRecentQueryKey
} from "@/lib/api-client";
import { Users, CheckCircle2, Activity, TrendingUp, ArrowRight, ShieldCheck, RefreshCw, Plus, BookOpen, Send, Download, XCircle, CalendarDays, LayoutGrid } from "lucide-react";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS, TAHAP_ORDER } from "@/lib/constants";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@/lib/safe-react-query";
import type { WbpItem } from "@/lib/api-client/generated/api.schemas";
import { toast } from "sonner";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    aktif: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50",
    selesai: "bg-green-50 text-green-700 border-green-100 hover:bg-green-50",
    ditolak: "bg-red-50 text-red-700 border-red-100 hover:bg-red-50",
  };
  const dot: Record<string, string> = {
    aktif: "bg-blue-500", selesai: "bg-green-500", ditolak: "bg-red-500",
  };
  return (
    <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 text-[10px] sm:text-xs font-semibold ${map[status] || ""}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || "bg-slate-400"}`} />
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return (
    <div className="flex flex-col items-center justify-center h-28 text-slate-300 gap-2">
      <ShieldCheck className="h-7 w-7" />
      <span className="text-xs">Belum ada data</span>
    </div>
  );
  const cx = 52, cy = 52, r = 40, stroke = 16;
  const circumference = 2 * Math.PI * r;
  const offsets = data.reduce<number[]>((acc, seg, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / total));
    return acc;
  }, []);
  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <svg viewBox="0 0 104 104" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-sm">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          {data.map((seg, i) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const gap = circumference - dash;
            return (
              <circle key={seg.label} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
                strokeWidth={stroke} strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offsets[i] * circumference}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`} />
            );
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">{total}</text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600" letterSpacing="0.8">TOTAL</text>
        </svg>
      </div>
      <div className="space-y-2">
        {data.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <div key={seg.label}>
              <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs font-medium text-slate-600 truncate">{JENIS_LAYANAN_LABELS[seg.label] || seg.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-900 flex-shrink-0 whitespace-nowrap">
                  {seg.value} <span className="text-slate-400 font-normal text-[10px] sm:text-xs">({pct}%)</span>
                </span>
              </div>
              <Progress value={pct} className="h-1" style={{ "--progress-foreground": seg.color } as React.CSSProperties} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/60">
      <Skeleton className="h-1 w-full rounded-none" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-20 rounded" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-14 rounded" />
        <Skeleton className="h-3 w-28 rounded" />
      </div>
    </div>
  );
}

const metricCards = [
  { key: "totalWbp", label: "Total Warga Binaan",   icon: Users,        gradient: "from-slate-400 to-slate-600",   iconBg: "bg-slate-100", iconColor: "text-slate-600", tooltip: "Jumlah seluruh Warga Binaan yang pernah masuk ke sistem reintegrasi", trend: null },
  { key: "aktif",    label: "Belum Bebas", icon: Activity,     gradient: "from-blue-400 to-blue-600",     iconBg: "bg-blue-50",   iconColor: "text-blue-600",  tooltip: "Warga Binaan yang masih dalam proses reintegrasi, belum keluar dari rutan", trend: "aktif" },
  { key: "selesai",  label: "Telah Bebas", icon: CheckCircle2, gradient: "from-emerald-400 to-green-600", iconBg: "bg-green-50",  iconColor: "text-green-600", tooltip: "Warga Binaan yang sudah bebas — SK terbit dan keluar dari rutan", trend: "selesai" },
  { key: "ditolak",  label: "Ditolak",     icon: XCircle,      gradient: "from-red-400 to-rose-600",      iconBg: "bg-red-50",    iconColor: "text-red-500",   tooltip: "Warga Binaan yang proses reintegrasinya ditolak atau dihentikan", trend: "ditolak" },
];

const aksesItems = [
  { href: "/dashboard/wbp/tambah",   label: "Tambah Warga Binaan",   desc: "Input data baru",        icon: Plus,     color: "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700", text: "text-white" },
  { href: "/dashboard/wbp",          label: "Data Warga Binaan",     desc: "Kelola semua Warga Binaan",       icon: Users,    color: "from-slate-100 to-slate-100 hover:from-slate-200 hover:to-slate-200", text: "text-slate-700" },
  { href: "/dashboard/buku-analisa", label: "Buku Analisa", desc: "Rekap analisa Warga Binaan",      icon: BookOpen, color: "from-slate-100 to-slate-100 hover:from-slate-200 hover:to-slate-200", text: "text-slate-700" },
  { href: "/dashboard/notifikasi",   label: "Notif WA",     desc: "Log pengiriman",         icon: Send,     color: "from-slate-100 to-slate-100 hover:from-slate-200 hover:to-slate-200", text: "text-slate-700" },
  { href: "/dashboard/laporan",      label: "Laporan",      desc: "Unduh PDF / CSV",        icon: Download, color: "from-slate-100 to-slate-100 hover:from-slate-200 hover:to-slate-200", text: "text-slate-700" },
];

export default function Dashboard() {
  const qc = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() },
  });
  const { data: recent, isLoading: recentLoading } = useGetDashboardRecent({
    query: { queryKey: getGetDashboardRecentQueryKey() },
  });

  const isLoading = statsLoading || recentLoading;

  const handleRefresh = () => {
    toast.promise(
      Promise.all([
        qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() }),
        qc.invalidateQueries({ queryKey: getGetDashboardRecentQueryKey() }),
      ]),
      { loading: "Memperbarui data...", success: "Data berhasil diperbarui!", error: "Gagal memperbarui." }
    );
  };

  const statValues: Record<string, number> = {
    totalWbp: stats?.totalWbp || 0,
    aktif:    stats?.aktif    || 0,
    selesai:  stats?.selesai  || 0,
    ditolak:  stats?.ditolak  || 0,
  };

  const donutData = [
    { label: "PB",        value: stats?.byJenisLayanan?.PB        || 0, color: "#0d9488" },
    { label: "CB",        value: stats?.byJenisLayanan?.CB        || 0, color: "#f59e0b" },
    { label: "CMB",       value: stats?.byJenisLayanan?.CMB       || 0, color: "#6366f1" },
    { label: "ASIMILASI", value: stats?.byJenisLayanan?.ASIMILASI || 0, color: "#f97316" },
  ].filter(d => d.value > 0);

  const completionRate = statValues.totalWbp > 0
    ? Math.round((statValues.selesai / statValues.totalWbp) * 100)
    : 0;

  const jadwalItems = (recent?.data as WbpItem[] ?? [])
    .filter(w => w.tanggalPelaksanaan)
    .sort((a, b) => new Date(a.tanggalPelaksanaan!).getTime() - new Date(b.tanggalPelaksanaan!).getTime())
    .slice(0, 4);

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Selamat datang kembali"
          breadcrumbItems={[{ label: "Dashboard" }]}
          subtitle={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        >
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh}
                  className="h-9 w-9 rounded-xl border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-200">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="font-semibold">Perbarui Dashboard</p>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Muat ulang semua statistik dari database</p>
              </TooltipContent>
            </Tooltip>
            <Link href="/dashboard/wbp/tambah">
              <Button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-semibold px-4 h-9 rounded-xl shadow-sm shadow-teal-500/25">
                + Tambah Warga Binaan
              </Button>
            </Link>
          </div>
        </PageShell>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
            : metricCards.map(({ key, label, icon: Icon, gradient, iconBg, iconColor, tooltip, trend }) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-default">
                    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-slate-500">{label}</p>
                        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-slate-900 tabular-nums">{statValues[key].toLocaleString("id-ID")}</p>
                      {trend === "aktif" && (
                        <p className="text-xs text-blue-500 font-semibold mt-2 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Masih dalam rutan
                        </p>
                      )}
                      {trend === "selesai" && (
                        <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Sudah keluar · SK terbit
                        </p>
                      )}
                      {trend === "ditolak" && (
                        <p className="text-xs text-red-500 font-semibold mt-2 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Proses dihentikan
                        </p>
                      )}
                      {!trend && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[10px] sm:text-xs text-slate-400">
                            <span>Tingkat kebebasan</span>
                            <span className="font-semibold text-slate-600">{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-52">
                  <p className="font-semibold">Info Metrik</p>
                  <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 leading-snug">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))
          }
        </div>

        {/* ── Ringkasan strip ── */}
        {!isLoading && statValues.totalWbp > 0 && (
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-800">Ringkasan Reintegrasi</p>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                {completionRate}% telah bebas
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 gap-px">
              {statValues.aktif > 0 && (
                <div style={{ width: `${(statValues.aktif / statValues.totalWbp) * 100}%` }}
                  className="bg-blue-400 h-full transition-all duration-700" />
              )}
              {statValues.selesai > 0 && (
                <div style={{ width: `${(statValues.selesai / statValues.totalWbp) * 100}%` }}
                  className="bg-emerald-400 h-full transition-all duration-700" />
              )}
              {statValues.ditolak > 0 && (
                <div style={{ width: `${(statValues.ditolak / statValues.totalWbp) * 100}%` }}
                  className="bg-red-400 h-full transition-all duration-700" />
              )}
            </div>
            <div className="flex gap-6 mt-3 flex-wrap">
              {[
                { label: "Aktif / Proses", val: statValues.aktif,   color: "bg-blue-400",    text: "text-blue-700"    },
                { label: "Telah Bebas",    val: statValues.selesai, color: "bg-emerald-400", text: "text-emerald-700" },
                { label: "Ditolak",        val: statValues.ditolak, color: "bg-red-400",     text: "text-red-700"     },
              ].map(({ label, val, color, text }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
                  <span className="text-xs text-slate-500">{label}:</span>
                  <span className={`text-[12px] font-bold ${text}`}>{val}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">
                    ({statValues.totalWbp > 0 ? Math.round((val / statValues.totalWbp) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ROW 3: Aktivitas (2/3) + Donut+Jadwal (1/3) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* Aktivitas Terbaru — natural height, no scroll */}
          <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Aktivitas Terbaru</h2>
                {!isLoading && !!recent?.data?.length && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-4 font-semibold">
                    {recent.data.length}
                  </Badge>
                )}
              </div>
              <Link href="/dashboard/wbp">
                <button className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Semua Data <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-4">
                    <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="space-y-1.5 items-end flex flex-col">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))
              ) : !recent?.data?.length ? (
                <div className="p-10 text-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm">Belum ada aktivitas.</p>
                </div>
              ) : (
                (recent.data as { id: string; nama: string; nomorRegistrasi: string; jenisLayanan: string; tahapSaatIni: string; status: string; perkara?: string; tanggalPelaksanaan?: string; updatedAt: string }[]).map((item) => (
                  <Link key={item.id} href={`/dashboard/wbp/${item.id}/edit`}>
                    <div className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 rounded-xl flex-shrink-0">
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-700 text-xs font-bold group-hover:from-teal-100 group-hover:to-emerald-200 transition-all">
                            {item.nama.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">{item.nama}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {item.nomorRegistrasi} · <span className="font-medium text-slate-500">{JENIS_LAYANAN_LABELS[item.jenisLayanan]}</span>
                            {item.perkara && <span> · {item.perkara}</span>}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-teal-400 inline-block flex-shrink-0" />
                            {TAHAP_LABELS[item.tahapSaatIni]}
                            {item.tanggalPelaksanaan && (
                              <span className="text-slate-300 ml-1">
                                · Pelaks. {new Date(item.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <StatusBadge status={item.status} />
                        <span className="text-[10px] sm:text-xs text-slate-400">
                          {new Date(item.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right column — Donut + Jadwal */}
          <div className="space-y-4">
            {/* Donut */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">Jenis Layanan</h2>
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 h-4">
                  {donutData.reduce((s, d) => s + d.value, 0)} total
                </Badge>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Skeleton className="h-26 w-26 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-lg" />)}
                  </div>
                </div>
              ) : (
                <DonutChart data={donutData} />
              )}
            </div>

            {/* Jadwal Pelaksanaan */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-4 w-4 text-teal-500" />
                <h2 className="text-sm font-bold text-slate-900">Jadwal Pelaksanaan</h2>
              </div>
              {isLoading ? (
                <div className="space-y-2.5">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                </div>
              ) : jadwalItems.length === 0 ? (
                <div className="text-center py-5">
                  <CalendarDays className="h-7 w-7 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Belum ada tanggal pelaksanaan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {jadwalItems.map((w) => {
                    const tgl = new Date(w.tanggalPelaksanaan!);
                    const isPast = tgl < new Date();
                    return (
                      <Link key={w.id} href={`/dashboard/wbp/${w.id}/edit`}>
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center border ${isPast ? "bg-slate-50 border-slate-100" : "bg-teal-50 border-teal-100"}`}>
                            <span className={`text-[12px] font-bold leading-none ${isPast ? "text-slate-400" : "text-teal-700"}`}>
                              {tgl.getDate()}
                            </span>
                            <span className={`text-[8px] uppercase font-semibold leading-none mt-0.5 ${isPast ? "text-slate-400" : "text-teal-500"}`}>
                              {tgl.toLocaleDateString("id-ID", { month: "short" })}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-teal-700 transition-colors">{w.nama}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                              {JENIS_LAYANAN_LABELS[w.jenisLayanan]}{w.perkara ? ` · ${w.perkara}` : ""}
                            </p>
                          </div>
                          {isPast && <span className="text-[10px] sm:text-xs text-slate-300 font-semibold flex-shrink-0">Lewat</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 4: Sebaran Tahapan (1/2) + Akses Cepat (1/2) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

          {/* Sebaran Tahapan */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Sebaran Tahapan</h2>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {TAHAP_ORDER.map((tahap, index) => {
                  const item = stats?.byTahap?.find((t) => t.tahap === tahap);
                  const itemCount = item?.count ?? 0;
                  const total = stats?.totalWbp || 1;
                  const pct = Math.round((itemCount / total) * 100);
                  return (
                    <Tooltip key={tahap}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                          <span className="w-5 h-5 flex-shrink-0 rounded-full bg-slate-100 text-slate-400 text-[10px] sm:text-xs font-bold flex items-center justify-center mr-2">{index + 1}</span>
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-500 truncate leading-snug">{TAHAP_LABELS[tahap]}</span>
                              <span className="bg-teal-50 text-teal-700 border border-teal-100 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ml-1.5 flex-shrink-0">{itemCount}</span>
                            </div>
                            <Progress value={pct} className="h-1" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-semibold tabular-nums">{pct}% dari total Warga Binaan</p>
                        <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Proporsi pada tahap ini</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </div>

          {/* Akses Cepat */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
            <p className="text-sm font-bold text-slate-900 mb-4">Akses Cepat</p>
            <div className="grid grid-cols-3 gap-3">
              {aksesItems.map(({ href, label, desc, icon: Icon, color, text }) => (
                <Link key={href} href={href}>
                  <button className={`w-full flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-2xl bg-gradient-to-br ${color} ${text} transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5`}>
                    <Icon className="h-5 w-5" />
                    <div className="text-center">
                      <p className="font-bold text-xs leading-tight">{label}</p>
                      <p className="text-[10px] sm:text-xs font-normal mt-0.5 opacity-60 leading-tight">{desc}</p>
                    </div>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
