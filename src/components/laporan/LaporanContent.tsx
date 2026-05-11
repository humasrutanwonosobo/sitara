"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useListWbp, useGetDashboardStats, getGetDashboardStatsQueryKey } from "@/lib/api-client";
import type { WbpItem, DashboardStats } from "@/lib/api-client/generated/api.schemas";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Download, Printer, FileText, Users, CheckCircle2, Activity,
  XCircle, BarChart2, Search, ExternalLink, TrendingUp,
} from "lucide-react";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS, TAHAP_ORDER } from "@/lib/constants";
import Link from "next/link";
import { JenisLayananBadge } from "@/components/ui/jenis-layanan-badge";
import * as XLSX from "xlsx";

const JENIS_COLORS: Record<string, { bar: string; dot: string; bg: string; text: string }> = {
  PB:        { bar: "from-teal-400 to-teal-500",    dot: "bg-teal-500",    bg: "bg-teal-50",    text: "text-teal-700" },
  CB:        { bar: "from-amber-400 to-amber-500",  dot: "bg-amber-400",   bg: "bg-amber-50",   text: "text-amber-700" },
  CMB:       { bar: "from-indigo-400 to-indigo-500",dot: "bg-indigo-400",  bg: "bg-indigo-50",  text: "text-indigo-700" },
  ASIMILASI: { bar: "from-orange-400 to-orange-500",dot: "bg-orange-400",  bg: "bg-orange-50",  text: "text-orange-700" },
};

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    aktif:   "bg-blue-50 text-blue-700 border-blue-100",
    selesai: "bg-green-50 text-green-700 border-green-100",
    ditolak: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${map[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function exportXLSX(rows: WbpItem[], stats: DashboardStats, statusFilter: string, layananFilter: string, search: string) {
  const now = new Date();
  const tsDisplay = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    + " · " + now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const tsFile = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");

  const filterInfo = [
    statusFilter !== "all" ? `Status: ${STATUS_LABELS[statusFilter] ?? statusFilter}` : null,
    layananFilter !== "all" ? `Layanan: ${JENIS_LAYANAN_LABELS[layananFilter] ?? layananFilter}` : null,
    search ? `Pencarian: "${search}"` : null,
  ].filter(Boolean).join(" · ") || "Semua data";

  const TOTAL_COLS = 10;
  const empty = Array(TOTAL_COLS).fill("");

  const aoa: (string | number)[][] = [
    ["SITARA — Sistem Informasi Tracking Reintegrasi Narapidana", ...Array(TOTAL_COLS - 1).fill("")],
    ["Rumah Tahanan Negara Kelas IIB Wonosobo · Kementerian Imigrasi dan Pemasyarakatan RI", ...Array(TOTAL_COLS - 1).fill("")],
    empty,
    ["LAPORAN DATA WARGA BINAAN PEMASYARAKATAN", ...Array(TOTAL_COLS - 1).fill("")],
    empty,
    ["Tanggal Cetak", ":", tsDisplay, "", "", "Filter", ":", filterInfo, "", ""],
    ["Total Data", ":", rows.length, "", "", "Aktif", ":", stats?.aktif ?? 0, "Selesai", stats?.selesai ?? 0],
    empty,
    ["DISTRIBUSI JENIS LAYANAN", ...Array(TOTAL_COLS - 1).fill("")],
    ["Jenis Layanan", "Jumlah", "Persentase", ...Array(TOTAL_COLS - 3).fill("")],
    ...(["PB", "CB", "CMB", "ASIMILASI"] as const).map(k => {
      const c = stats?.byJenisLayanan?.[k] ?? 0;
      const pct = stats?.totalWbp ? `${Math.round((c / stats.totalWbp) * 100)}%` : "0%";
      return [JENIS_LAYANAN_LABELS[k] ?? k, c, pct, ...Array(TOTAL_COLS - 3).fill("")];
    }),
    empty,
    ["DAFTAR WARGA BINAAN", ...Array(TOTAL_COLS - 1).fill("")],
    ["#", "Nama", "No. Registrasi", "Jenis Kelamin", "Jenis Layanan", "Tahap Saat Ini", "Status", "Kontak Keluarga", "No. WA", "Diperbarui"],
    ...rows.map((r, i) => [
      i + 1,
      r.nama,
      r.nomorRegistrasi,
      r.jenisKelamin || "-",
      JENIS_LAYANAN_LABELS[r.jenisLayanan] || r.jenisLayanan,
      TAHAP_LABELS[r.tahapSaatIni] || r.tahapSaatIni,
      STATUS_LABELS[r.status] || r.status,
      r.namaKontakKeluarga || "-",
      r.nomorHpKeluarga || "-",
      new Date(r.updatedAt).toLocaleDateString("id-ID"),
    ]),
    empty,
    [`Dokumen ini dibuat secara otomatis oleh SITARA pada ${tsDisplay}`, ...Array(TOTAL_COLS - 1).fill("")],
    ["Data bersumber dari Sistem Database Pemasyarakatan (SDP) Kemenimipas RI", ...Array(TOTAL_COLS - 1).fill("")],
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const headerRow = 13; // 0-indexed row of data table header
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: TOTAL_COLS - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: TOTAL_COLS - 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: TOTAL_COLS - 1 } },
    { s: { r: 5, c: 2 }, e: { r: 5, c: 4 } },
    { s: { r: 5, c: 7 }, e: { r: 5, c: TOTAL_COLS - 1 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: TOTAL_COLS - 1 } },
    { s: { r: 12, c: 0 }, e: { r: 12, c: TOTAL_COLS - 1 } },
    { s: { r: aoa.length - 2, c: 0 }, e: { r: aoa.length - 2, c: TOTAL_COLS - 1 } },
    { s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: TOTAL_COLS - 1 } },
  ];

  ws["!cols"] = [
    { wch: 5 }, { wch: 28 }, { wch: 16 }, { wch: 12 },
    { wch: 22 }, { wch: 32 }, { wch: 10 }, { wch: 22 }, { wch: 16 }, { wch: 14 },
  ];

  ws["!rows"] = [];
  ws["!rows"][0] = { hpt: 22 };
  ws["!rows"][3] = { hpt: 20 };
  ws["!rows"][headerRow] = { hpt: 28 };

  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Laporan Data Warga Binaan",
    Subject: "Laporan Reintegrasi Narapidana",
    Author: "SITARA — Rumah Tahanan Negara Kelas IIB Wonosobo",
    Company: "Kementerian Imigrasi dan Pemasyarakatan RI",
    CreatedDate: now,
  };
  XLSX.utils.book_append_sheet(wb, ws, "Laporan Warga Binaan");
  XLSX.writeFile(wb, `SITARA_Laporan_${tsFile}.xlsx`);
}

export default function Laporan() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [layananFilter, setLayananFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() },
  });
  const { data: allWbp, isLoading: wbpLoading } = useListWbp(
    { page: 1, limit: 500 },
    { query: { queryKey: ["listWbp", "laporan-all"] } }
  );

  const isLoading = statsLoading || wbpLoading;

  const filtered = useMemo(() => (allWbp?.data || []).filter((r) => {
    const matchStatus  = statusFilter === "all" || r.status === statusFilter;
    const matchLayanan = layananFilter === "all" || r.jenisLayanan === layananFilter;
    const matchSearch  = !search || r.nama.toLowerCase().includes(search.toLowerCase())
      || r.nomorRegistrasi.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchLayanan && matchSearch;
  }), [allWbp, statusFilter, layananFilter, search]);

  const tahapData = useMemo(() => TAHAP_ORDER.map(key => ({
    key,
    label: TAHAP_LABELS[key] || key,
    count: stats?.byTahap?.find(t => t.tahap === key)?.count ?? 0,
  })), [stats]);
  const maxTahap = Math.max(...tahapData.map(t => t.count), 1);

  const hasActiveFilter = statusFilter !== "all" || layananFilter !== "all" || search;

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Laporan Data Warga Binaan"
          breadcrumbItems={[{ label: "Laporan" }]}
          subtitle={`Rekap per ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-slate-200 h-9 text-xs sm:text-sm"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-xl h-9 text-xs sm:text-sm font-semibold shadow-sm"
              onClick={() => stats && exportXLSX(filtered, stats, statusFilter, layananFilter, search)}
              disabled={isLoading || filtered.length === 0}
            >
              <Download className="h-3.5 w-3.5" />
              Unduh XLSX
            </Button>
          </div>
        </PageShell>

        {/* ── Loading ── */}
        {isLoading ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
                  <div className="h-1 bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-12" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Total Warga Binaan",     value: stats?.totalWbp ?? 0,  icon: Users,         grad: "from-slate-400 to-slate-500",    bg: "bg-slate-50",   color: "text-slate-500" },
                { label: "Aktif Diproses",value: stats?.aktif ?? 0,     icon: Activity,      grad: "from-blue-400 to-blue-500",      bg: "bg-blue-50",    color: "text-blue-600" },
                { label: "Selesai",       value: stats?.selesai ?? 0,   icon: CheckCircle2,  grad: "from-green-400 to-emerald-500",  bg: "bg-green-50",   color: "text-green-600" },
                { label: "Ditolak",       value: stats?.ditolak ?? 0,   icon: XCircle,       grad: "from-red-400 to-rose-500",       bg: "bg-red-50",     color: "text-red-600" },
              ].map(({ label, value, icon: Icon, grad, bg, color }) => (
                <div key={label} className="bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/60 shadow-sm">
                  <div className={`h-1 bg-gradient-to-r ${grad}`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-500">{label}</p>
                      <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{value.toLocaleString("id-ID")}</p>
                    {stats?.totalWbp ? (
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                        {Math.round((value / stats.totalWbp) * 100)}% dari total
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Distribution panels ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Jenis Layanan */}
              <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="h-4 w-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-800">Distribusi Jenis Layanan</h2>
                </div>
                <div className="space-y-3">
                  {(["PB", "CB", "CMB", "ASIMILASI"] as const).map((key) => {
                    const count = stats?.byJenisLayanan?.[key] ?? 0;
                    const total = stats?.totalWbp || 1;
                    const pct = Math.round((count / total) * 100);
                    const c = JENIS_COLORS[key];
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                            <span className="text-xs font-semibold text-slate-700">{JENIS_LAYANAN_LABELS[key]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold tabular-nums ${c.text}`}>{count}</span>
                            <span className="text-[10px] sm:text-xs text-slate-400 w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${c.bar} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Warga Binaan terdaftar</span>
                  <span className="text-sm font-bold text-slate-900">{stats?.totalWbp ?? 0}</span>
                </div>
              </div>

              {/* Distribusi per Tahap */}
              <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-800">Distribusi per Tahap Proses</h2>
                  <span className="ml-auto text-[10px] sm:text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    Warga Binaan Aktif
                  </span>
                </div>
                <div className="space-y-2.5">
                  {tahapData.map(({ key, label, count }, idx) => {
                    const pct = Math.round((count / maxTahap) * 100);
                    const isLate = idx >= 5;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-[10px] sm:text-xs font-mono text-slate-300 w-4 flex-shrink-0">{idx + 1}</span>
                            <span className="text-xs text-slate-600 truncate">{label}</span>
                          </div>
                          <span className={`text-xs font-bold tabular-nums ml-2 flex-shrink-0 ${count > 0 ? (isLate ? "text-teal-600" : "text-blue-600") : "text-slate-300"}`}>
                            {count}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${count > 0 ? (isLate ? "bg-gradient-to-r from-teal-400 to-teal-500" : "bg-gradient-to-r from-blue-400 to-blue-500") : ""}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-4 text-[10px] sm:text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />Tahap awal–menengah</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-400" />Tahap lanjut–selesai</span>
                </div>
              </div>
            </div>

            {/* ── Table section ── */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">

              {/* Filter bar */}
              <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <h2 className="text-sm font-bold text-slate-800">Daftar Warga Binaan</h2>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-1">{filtered.length} data</span>
                  {hasActiveFilter && (
                    <button
                      onClick={() => { setStatusFilter("all"); setLayananFilter("all"); setSearch(""); }}
                      className="ml-auto text-xs text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      Reset filter
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Cari nama atau no. registrasi..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-xl focus-visible:ring-teal-500/30"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs border-slate-200 bg-white rounded-xl">
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={layananFilter} onValueChange={setLayananFilter}>
                    <SelectTrigger className="h-8 text-xs border-slate-200 bg-white rounded-xl">
                      <SelectValue placeholder="Semua Layanan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Semua Layanan</SelectItem>
                      <SelectItem value="PB">{JENIS_LAYANAN_LABELS.PB}</SelectItem>
                      <SelectItem value="CB">{JENIS_LAYANAN_LABELS.CB}</SelectItem>
                      <SelectItem value="CMB">{JENIS_LAYANAN_LABELS.CMB}</SelectItem>
                      <SelectItem value="ASIMILASI">{JENIS_LAYANAN_LABELS.ASIMILASI}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Card view — sm only ── */}
              <div className="sm:hidden">
                {filtered.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm">Tidak ada data sesuai filter.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filtered.map((item, idx) => (
                      <div key={item.id} className="px-4 py-3.5 hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] sm:text-xs font-mono text-slate-300">{idx + 1}</span>
                              <p className="text-sm font-bold text-slate-900 truncate">{item.nama}</p>
                            </div>
                            <p className="font-mono text-[10px] sm:text-xs text-slate-400 mt-0.5">{item.nomorRegistrasi}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <StatusPill status={item.status} />
                            <Link href={`/dashboard/wbp/${item.id}/edit`}>
                              <button className="text-[10px] sm:text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-0.5">
                                Edit <ExternalLink className="h-2.5 w-2.5" />
                              </button>
                            </Link>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <JenisLayananBadge code={item.jenisLayanan} />
                          <span className="text-xs text-slate-500 truncate flex-1">{TAHAP_LABELS[item.tahapSaatIni] || item.tahapSaatIni}</span>
                        </div>
                        {item.namaKontakKeluarga && (
                          <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5">
                            Keluarga: <span className="font-semibold">{item.namaKontakKeluarga}</span>
                            {item.nomorHpKeluarga && <span className="font-mono ml-1">{item.nomorHpKeluarga}</span>}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Table view — sm+ ── */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-slate-100">
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 w-8 pl-4">#</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Nama</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">No. Reg</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Layanan</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Tahap</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Keluarga</TableHead>
                      <TableHead className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell whitespace-nowrap">Diperbarui</TableHead>
                      <TableHead className="w-8 pr-4" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-40 text-center">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl mx-auto mb-2 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-slate-300" />
                          </div>
                          <p className="text-slate-400 text-sm">Tidak ada data sesuai filter.</p>
                        </TableCell>
                      </TableRow>
                    ) : filtered.map((item, idx) => (
                      <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/60 transition-colors group">
                        <TableCell className="text-[10px] sm:text-xs text-slate-400 font-mono pl-4">{idx + 1}</TableCell>
                        <TableCell>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">{item.nama}</p>
                          {item.jenisKelamin && <span className="text-[10px] sm:text-xs text-slate-400">{item.jenisKelamin}</span>}
                          <p className="font-mono text-[10px] sm:text-xs text-slate-400 md:hidden mt-0.5">{item.nomorRegistrasi}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="font-mono text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                            {item.nomorRegistrasi}
                          </span>
                        </TableCell>
                        <TableCell>
                          <JenisLayananBadge code={item.jenisLayanan} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell min-w-0 sm:min-w-44">
                          <p className="text-xs text-slate-500 truncate">{TAHAP_LABELS[item.tahapSaatIni] || item.tahapSaatIni}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusPill status={item.status} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="text-xs text-slate-700 font-medium">{item.namaKontakKeluarga || "—"}</p>
                          {item.nomorHpKeluarga && (
                            <p className="font-mono text-[10px] sm:text-xs text-slate-400 mt-0.5">{item.nomorHpKeluarga}</p>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">
                          {new Date(item.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}
                        </TableCell>
                        <TableCell className="pr-4">
                          <Link href={`/dashboard/wbp/${item.id}/edit`}>
                            <button className="h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-50 flex items-center justify-center">
                              <ExternalLink className="h-3 w-3 text-violet-500" />
                            </button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Table footer */}
              {filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Menampilkan <span className="font-semibold text-slate-600">{filtered.length}</span> dari{" "}
                    <span className="font-semibold text-slate-600">{allWbp?.data?.length ?? 0}</span> Warga Binaan terdaftar
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Dibuat: {new Date().toLocaleString("id-ID")} · SITARA · Rumah Tahanan Negara Kelas IIB Wonosobo
                  </p>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </>
  );
}
