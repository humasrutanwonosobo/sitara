"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useListWbp, getListWbpQueryKey } from "@/lib/api-client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { JENIS_LAYANAN_LABELS, TAHAP_ORDER } from "@/lib/constants";
import { Search, Download, ExternalLink, CheckCircle2, Circle, Calendar } from "lucide-react";
import * as XLSX from "xlsx";

const ANALISA_COLS = [
  { key: "verifikasi_rutan",  short: "Verifikasi\nBerkas Rutan" },
  { key: "pengusulan_litmas", short: "Pengusulan\nLitmas" },
  { key: "sidang_tpp_upt",   short: "Sidang\nTPP UPT" },
  { key: "upload_sdp",       short: "Pengusulan\nBerkas SDP" },
  { key: "verifikasi_kanwil",short: "Verifikasi\nKanwil" },
  { key: "proses_ditjen_pas",short: "Verifikasi\nDitjen PAS" },
  { key: "sk_terbit",        short: "Penerbitan\nSK Ditjen PAS" },
  { key: "turun_sk",         short: "Turun\nSK" },
];

const LAYANAN_COLOR: Record<string, string> = {
  PB: "bg-blue-50 text-blue-700 border-blue-200",
  CB: "bg-violet-50 text-violet-700 border-violet-200",
  CMB: "bg-teal-50 text-teal-700 border-teal-200",
  ASIMILASI: "bg-orange-50 text-orange-700 border-orange-200",
};

function isStepDone(wbpTahap: string, colKey: string): boolean {
  const wbpIdx = TAHAP_ORDER.indexOf(wbpTahap);
  const colIdx = TAHAP_ORDER.indexOf(colKey);
  return colIdx <= wbpIdx;
}

function CheckCell({ done }: { done: boolean }) {
  return (
    <td className="px-2 py-3 text-center border-r border-slate-100 min-w-18">
      {done ? (
        <div className="flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center">
            <Circle className="h-4 w-4 text-slate-200" />
          </div>
        </div>
      )}
    </td>
  );
}

export default function BukuAnalisa() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<string>("semua");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey || e.ctrlKey) {
        e.preventDefault();
        el.scrollLeft += e.deltaY || e.deltaX;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragStartX.current = e.pageX - el.offsetLeft;
      scrollStartLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollStartLeft.current - (x - dragStartX.current);
    };
    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const { data, isLoading } = useListWbp(
    { limit: 100, page: 1 },
    { query: { queryKey: getListWbpQueryKey({ limit: 100, page: 1 }) } }
  );

  const rows = (data?.data || []).filter((w) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      w.nama.toLowerCase().includes(q) ||
      w.nomorRegistrasi.toLowerCase().includes(q) ||
      (w.perkara || "").toLowerCase().includes(q) ||
      (w.alamat || "").toLowerCase().includes(q);
    const matchJenis = jenisFilter === "semua" || w.jenisLayanan === jenisFilter;
    return matchSearch && matchJenis;
  });

  const handleExportXLSX = () => {
    const now = new Date();
    const tsDisplay = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      + " · " + now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const tsFile = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");

    const aktifCount  = rows.filter(r => r.status === "aktif").length;
    const selesaiCount = rows.filter(r => r.status === "selesai").length;
    const ditolakCount = rows.filter(r => r.status === "ditolak").length;

    const filterInfo = [
      jenisFilter !== "semua" ? `Layanan: ${JENIS_LAYANAN_LABELS[jenisFilter] ?? jenisFilter}` : null,
      search ? `Pencarian: "${search}"` : null,
    ].filter(Boolean).join(" · ") || "Semua data";

    // Total columns = 17 (A..Q)
    // A=No, B=Nama, C=No.Reg, D=Alamat, E=Perkara, F=Jenis Layanan,
    // G-N = 8 tahap, O=Tgl Pelaksanaan, P=Keterangan, Q=Tgl Update
    const TOTAL_COLS = 17;
    const empty = Array(TOTAL_COLS).fill("");

    const aoa: (string | number)[][] = [
      // ── Kop surat ──
      ["SITARA — Sistem Informasi Tracking Reintegrasi Narapidana", ...Array(TOTAL_COLS - 1).fill("")],
      ["Rutan Kelas IIB Wonosobo · Kementerian Imigrasi dan Pemasyarakatan RI", ...Array(TOTAL_COLS - 1).fill("")],
      empty,
      // ── Judul dokumen ──
      ["BUKU ANALISA PROSES REINTEGRASI WARGA BINAAN PEMASYARAKATAN", ...Array(TOTAL_COLS - 1).fill("")],
      empty,
      // ── Metadata ──
      ["Tanggal Cetak", ":", tsDisplay,  "", "", "", "Filter", ":", filterInfo, ...Array(TOTAL_COLS - 9).fill("")],
      ["Total Data",    ":", rows.length, "", "", "", "Aktif",  ":", aktifCount,  "Selesai", ":", selesaiCount, "Ditolak", ":", ditolakCount, "", ""],
      empty,
      // ── Header kolom baris 1 ──
      ["No", "Nama Narapidana", "No. Registrasi", "Alamat", "Perkara", "Jenis Layanan",
        "STATUS PROSES (8 Tahap)", "", "", "", "", "", "", "",
        "Tgl. Pelaksanaan", "Keterangan Proses", "Tgl. Update"],
      // ── Header kolom baris 2 (sub-header status proses) ──
      ["", "", "", "", "", "",
        ...ANALISA_COLS.map(c => c.short.replace("\n", " ")),
        "", "", ""],
      // ── Data ──
      ...rows.map((w, i) => [
        i + 1,
        w.nama,
        w.nomorRegistrasi,
        w.alamat || "-",
        w.perkara || "-",
        JENIS_LAYANAN_LABELS[w.jenisLayanan] || w.jenisLayanan,
        ...ANALISA_COLS.map(c => isStepDone(w.tahapSaatIni, c.key) ? "✓" : ""),
        w.tanggalPelaksanaan ? new Date(w.tanggalPelaksanaan).toLocaleDateString("id-ID") : "-",
        w.catatan || "-",
        new Date(w.updatedAt).toLocaleDateString("id-ID"),
      ]),
      // ── Pemisah ──
      empty,
      // ── Ringkasan ──
      ["RINGKASAN STATISTIK", ...Array(TOTAL_COLS - 1).fill("")],
      ["Total Warga Binaan", rows.length, "", "Aktif", aktifCount, "", "Selesai", selesaiCount, "", "Ditolak", ditolakCount, "", "Tingkat Keberhasilan",
        rows.length ? `${Math.round((selesaiCount / rows.length) * 100)}%` : "0%", "", "", ""],
      empty,
      // ── Legenda ──
      ["KETERANGAN:", ...Array(TOTAL_COLS - 1).fill("")],
      ["✓ = Tahap telah diselesaikan", "", "", "- = Tahap belum dicapai / tidak berlaku", ...Array(TOTAL_COLS - 4).fill("")],
      ["Status Aktif = Proses sedang berjalan", "", "", "Status Selesai = SK sudah turun dan diterima", ...Array(TOTAL_COLS - 4).fill("")],
      empty,
      // ── Footer ──
      [`Dokumen ini dibuat secara otomatis oleh SITARA pada ${tsDisplay}`, ...Array(TOTAL_COLS - 1).fill("")],
      ["Data bersumber dari Sistem Database Pemasyarakatan (SDP) Kemenimipas RI", ...Array(TOTAL_COLS - 1).fill("")],
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Merge cells
    const dataStartRow = 9; // 0-indexed row of first data header
    ws["!merges"] = [
      // Kop
      { s: { r: 0, c: 0 }, e: { r: 0, c: TOTAL_COLS - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: TOTAL_COLS - 1 } },
      // Judul
      { s: { r: 3, c: 0 }, e: { r: 3, c: TOTAL_COLS - 1 } },
      // Metadata kiri label+colon+value
      { s: { r: 5, c: 2 }, e: { r: 5, c: 5 } },
      { s: { r: 5, c: 8 }, e: { r: 5, c: TOTAL_COLS - 1 } },
      // Header: "STATUS PROSES" span 8 cols (G-N = index 6-13)
      { s: { r: dataStartRow - 1, c: 6 }, e: { r: dataStartRow - 1, c: 13 } },
      // Header baris 1: No, Nama, No.Reg, Alamat, Perkara, Jenis Layanan — span 2 rows
      { s: { r: dataStartRow - 1, c: 0 }, e: { r: dataStartRow, c: 0 } },
      { s: { r: dataStartRow - 1, c: 1 }, e: { r: dataStartRow, c: 1 } },
      { s: { r: dataStartRow - 1, c: 2 }, e: { r: dataStartRow, c: 2 } },
      { s: { r: dataStartRow - 1, c: 3 }, e: { r: dataStartRow, c: 3 } },
      { s: { r: dataStartRow - 1, c: 4 }, e: { r: dataStartRow, c: 4 } },
      { s: { r: dataStartRow - 1, c: 5 }, e: { r: dataStartRow, c: 5 } },
      { s: { r: dataStartRow - 1, c: 14 }, e: { r: dataStartRow, c: 14 } },
      { s: { r: dataStartRow - 1, c: 15 }, e: { r: dataStartRow, c: 15 } },
      { s: { r: dataStartRow - 1, c: 16 }, e: { r: dataStartRow, c: 16 } },
      // Ringkasan title
      { s: { r: aoa.length - 9, c: 0 }, e: { r: aoa.length - 9, c: TOTAL_COLS - 1 } },
      // Legenda title
      { s: { r: aoa.length - 6, c: 0 }, e: { r: aoa.length - 6, c: TOTAL_COLS - 1 } },
      // Footer
      { s: { r: aoa.length - 2, c: 0 }, e: { r: aoa.length - 2, c: TOTAL_COLS - 1 } },
      { s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: TOTAL_COLS - 1 } },
    ];

    // Column widths
    ws["!cols"] = [
      { wch: 5 },   // A: No
      { wch: 28 },  // B: Nama
      { wch: 16 },  // C: No. Reg
      { wch: 30 },  // D: Alamat
      { wch: 22 },  // E: Perkara
      { wch: 18 },  // F: Jenis Layanan
      { wch: 14 },  // G: Verifikasi Rutan
      { wch: 14 },  // H: Pengusulan Litmas
      { wch: 14 },  // I: Sidang TPP
      { wch: 14 },  // J: Upload SDP
      { wch: 14 },  // K: Verifikasi Kanwil
      { wch: 14 },  // L: Ditjen PAS
      { wch: 16 },  // M: SK Terbit
      { wch: 12 },  // N: Turun SK
      { wch: 18 },  // O: Tgl Pelaksanaan
      { wch: 30 },  // P: Keterangan
      { wch: 14 },  // Q: Tgl Update
    ];

    // Row heights for header rows
    ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 22 };
    ws["!rows"][1] = { hpt: 18 };
    ws["!rows"][3] = { hpt: 20 };
    ws["!rows"][dataStartRow - 1] = { hpt: 32 };
    ws["!rows"][dataStartRow]     = { hpt: 28 };

    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "Buku Analisa Proses Reintegrasi Warga Binaan",
      Subject: "Reintegrasi Narapidana",
      Author: "SITARA — Rutan Kelas IIB Wonosobo",
      Company: "Kementerian Imigrasi dan Pemasyarakatan RI",
      CreatedDate: now,
    };
    XLSX.utils.book_append_sheet(wb, ws, "Buku Analisa");
    XLSX.writeFile(wb, `SITARA_BukuAnalisa_${tsFile}.xlsx`);
  };

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Buku Analisa Proses"
          breadcrumbItems={[{ label: "Buku Analisa" }]}
          subtitle="Rekapitulasi tahap proses reintegrasi Warga Binaan — Rutan Kelas IIB Wonosobo"
        >
          <button
            onClick={handleExportXLSX}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0"
          >
            <Download className="h-4 w-4" />
            Unduh XLSX
          </button>
        </PageShell>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, nomor registrasi, perkara, alamat..."
              className="pl-9 h-9 text-sm rounded-xl border-slate-200 focus-visible:ring-teal-500/30"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[{ v: "semua", l: "Semua" }, { v: "PB", l: "PB" }, { v: "CB", l: "CB" }, { v: "CMB", l: "CMB" }, { v: "ASIMILASI", l: "Asimilasi" }].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setJenisFilter(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${jenisFilter === v ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
          {/* Summary row */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex-wrap">
            <span className="text-xs text-slate-500">
              Menampilkan <span className="font-bold text-slate-800">{rows.length}</span> data
              {search && <> untuk "<span className="text-teal-700">{search}</span>"</>}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 hidden sm:inline-flex items-center gap-1.5">
              <span className="font-mono font-bold">Shift</span> + scroll · atau klik &amp; geser tabel
            </span>
            <span className="ml-auto text-[10px] sm:text-xs text-slate-400">
              Diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Scrollable table */}
          <div ref={scrollRef} className="overflow-x-auto cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "thin" }}>
            <table className="w-full border-collapse text-xs min-w-[1200px]">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 sticky left-0 bg-slate-700 z-10 min-w-8">No</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 sticky left-8 bg-slate-700 z-10 min-w-40">Nama Narapidana</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 min-w-0 sm:min-w-28">No. Registrasi</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 min-w-40">Alamat</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 min-w-28">Perkara</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 min-w-20">Jenis Layanan</th>

                  {/* Status proses sub-header */}
                  <th colSpan={8} className="px-3 py-2 text-center font-bold text-xs border-r border-slate-600 bg-teal-700">
                    STATUS PROSES
                  </th>

                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 min-w-0 sm:min-w-28">Tgl. Pelaksanaan</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs border-r border-slate-600 min-w-0 sm:min-w-44">Keterangan Proses</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs min-w-24">Tgl. Update</th>
                </tr>
                <tr className="bg-slate-600 text-white">
                  <th className="border-r border-slate-500 sticky left-0 bg-slate-600 z-10" />
                  <th className="border-r border-slate-500 sticky left-8 bg-slate-600 z-10" />
                  <th className="border-r border-slate-500" />
                  <th className="border-r border-slate-500" />
                  <th className="border-r border-slate-500" />
                  <th className="border-r border-slate-500" />
                  {ANALISA_COLS.map((col) => (
                    <th key={col.key} className="px-1.5 py-2 text-center font-semibold text-[10px] sm:text-xs border-r border-slate-500 min-w-18 leading-tight whitespace-pre-line bg-teal-600/80">
                      {col.short}
                    </th>
                  ))}
                  <th className="border-r border-slate-500" />
                  <th className="border-r border-slate-500" />
                  <th />
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-3 py-3 border-r border-slate-100 sticky left-0 bg-white"><div className="h-4 w-6 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-3 py-3 border-r border-slate-100 sticky left-8 bg-white"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-slate-100 animate-pulse" /><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></div></td>
                        <td className="px-3 py-3 border-r border-slate-100"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-3 py-3 border-r border-slate-100"><div className="h-4 w-28 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-3 py-3 border-r border-slate-100"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-3 py-3 border-r border-slate-100"><div className="h-5 w-12 bg-slate-100 rounded-full animate-pulse" /></td>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-2 py-3 border-r border-slate-100 text-center"><div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse mx-auto" /></td>
                        ))}
                        <td className="px-3 py-3 border-r border-slate-100"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-3 py-3 border-r border-slate-100"><div className="h-4 w-28 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-3 py-3"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                      </tr>
                    ))}
                  </>
                )}
                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center py-16 text-slate-400 text-sm">
                      {search ? `Tidak ada data untuk "${search}"` : "Belum ada data Warga Binaan"}
                    </td>
                  </tr>
                )}
                {rows.map((w, idx) => {
                  const isDitolak = w.status === "ditolak";
                  const isSelesai = w.status === "selesai";
                  const rowBg = isDitolak ? "bg-red-50" : isSelesai ? "bg-emerald-50" : idx % 2 === 0 ? "bg-white" : "bg-slate-50";
                  const stickyBg = isDitolak ? "bg-red-50" : isSelesai ? "bg-emerald-50" : idx % 2 === 0 ? "bg-white" : "bg-slate-50";

                  return (
                    <tr key={w.id} className={`${rowBg} hover:bg-teal-50 transition-colors border-b border-slate-100 group`}>
                      {/* No */}
                      <td className={`px-3 py-3 text-center text-slate-400 font-medium border-r border-slate-100 sticky left-0 ${stickyBg} z-10 group-hover:bg-teal-50`}>
                        {idx + 1}
                      </td>

                      {/* Nama */}
                      <td className={`px-3 py-3 border-r border-slate-100 sticky left-8 ${stickyBg} z-10 group-hover:bg-teal-50`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0 ${
                            isDitolak ? "bg-red-100 text-red-700" : isSelesai ? "bg-emerald-100 text-emerald-700" : "bg-teal-100 text-teal-700"
                          }`}>
                            {w.nama.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link href={`/dashboard/wbp/${w.id}/edit`}>
                              <span className="font-semibold text-slate-800 hover:text-teal-700 cursor-pointer group-hover:underline decoration-teal-500/40 text-xs block truncate max-w-32">
                                {w.nama}
                              </span>
                            </Link>
                            {isDitolak && <span className="text-[10px] sm:text-xs font-bold text-red-500 uppercase">Ditolak</span>}
                            {isSelesai && <span className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase">Selesai</span>}
                          </div>
                        </div>
                      </td>

                      {/* No. Reg */}
                      <td className="px-3 py-3 border-r border-slate-100">
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">{w.nomorRegistrasi}</span>
                      </td>

                      {/* Alamat */}
                      <td className="px-3 py-3 border-r border-slate-100">
                        <span className="text-slate-600 text-xs leading-snug line-clamp-2 max-w-36 block">
                          {w.alamat || <span className="text-slate-300 italic">—</span>}
                        </span>
                      </td>

                      {/* Perkara */}
                      <td className="px-3 py-3 border-r border-slate-100">
                        <span className="text-slate-700 text-xs capitalize">
                          {w.perkara || <span className="text-slate-300 italic">—</span>}
                        </span>
                      </td>

                      {/* Jenis Layanan */}
                      <td className="px-3 py-3 border-r border-slate-100">
                        <span className={`inline-block text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${LAYANAN_COLOR[w.jenisLayanan] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                          {w.jenisLayanan}
                        </span>
                      </td>

                      {/* Checkmark columns */}
                      {ANALISA_COLS.map((col) => (
                        <CheckCell key={col.key} done={isStepDone(w.tahapSaatIni, col.key)} />
                      ))}

                      {/* Tanggal Pelaksanaan */}
                      <td className="px-3 py-3 border-r border-slate-100">
                        {w.tanggalPelaksanaan ? (
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Calendar className="h-3 w-3 text-slate-400 flex-shrink-0" />
                            {new Date(w.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-xs">—</span>
                        )}
                      </td>

                      {/* Keterangan */}
                      <td className="px-3 py-3 border-r border-slate-100">
                        <p className="text-xs text-slate-600 leading-snug line-clamp-2 max-w-0 sm:max-w-[170px]">
                          {w.catatan || <span className="text-slate-300 italic">—</span>}
                        </p>
                      </td>

                      {/* Tanggal Update */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">
                            {new Date(w.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <Link href={`/dashboard/wbp/${w.id}/edit`}>
                            <ExternalLink className="h-3 w-3 text-slate-300 hover:text-teal-500 cursor-pointer transition-colors" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-[10px] sm:text-xs text-slate-400">
              <span className="font-semibold">✓</span> = Tahap telah diselesaikan · Data bersumber dari SDP Kemenimipas
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400">
              Rutan Kelas IIB Wonosobo · SITARA
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
