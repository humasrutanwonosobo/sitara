"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useListWbp, getListWbpQueryKey, useSendNotifikasi, useGetWbp, getGetWbpQueryKey } from "@/lib/api-client";
import type { ListWbpStatus, ListWbpJenisLayanan, ListWbpTahap } from "@/lib/api-client/generated/api.schemas";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, FileEdit, FileText, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Send, Loader2, Users, X, RefreshCw } from "lucide-react";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS } from "@/lib/constants";
import { JenisLayananBadge } from "@/components/ui/jenis-layanan-badge";
import { toast } from "sonner";
import { useQueryClient } from "@/lib/safe-react-query";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    aktif: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50",
    selesai: "bg-green-50 text-green-700 border-green-100 hover:bg-green-50",
    ditolak: "bg-red-50 text-red-700 border-red-100 hover:bg-red-50",
  };
  const dot: Record<string, string> = {
    aktif: "bg-blue-500", selesai: "bg-green-500", ditolak: "bg-red-500",
  };
  return (
    <Badge variant="outline" className={`gap-1.5 text-xs font-semibold ${map[status] || "border-slate-200 text-slate-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot[status] || "bg-slate-400"}`} />
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

function WbpPreviewSheet({ id, open, onClose }: { id: string | null; open: boolean; onClose: () => void }) {
  const { data, isLoading } = useGetWbp(id!, {
    query: { enabled: !!id && open, queryKey: getGetWbpQueryKey(id!) }
  });
  const sendNotif = useSendNotifikasi();

  const handleSend = () => {
    if (!id) return;
    toast.promise(
      sendNotif.mutateAsync({ data: { wbpId: id } }),
      {
        loading: "Mengirim notifikasi WA...",
        success: "Notifikasi berhasil dikirim ke keluarga!",
        error: (e) => `Gagal mengirim: ${e?.error?.error || "Periksa nomor WA keluarga"}`,
      }
    );
  };

  const wbp = data?.data;
  const currentIdx = wbp ? Object.keys(TAHAP_LABELS).indexOf(wbp.tahapSaatIni) : 0;
  const totalSteps = Object.keys(TAHAP_LABELS).length;
  const progress = totalSteps > 0 ? Math.round(((currentIdx + 1) / totalSteps) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:w-md md:w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <SheetTitle className="text-base">Detail WBP</SheetTitle>
          <SheetDescription className="text-xs">Informasi cepat data warga binaan</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-5">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : wbp ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 rounded-2xl">
                    <AvatarFallback className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-lg font-bold">
                      {wbp.nama.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{wbp.nama}</h3>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">{wbp.nomorRegistrasi}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusPill status={wbp.status} />
                      <JenisLayananBadge code={wbp.jenisLayanan} size="xs" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Progress Tahap */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Progress Tahap</span>
                    <span className="text-slate-400 font-mono">{currentIdx + 1}/{totalSteps}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-slate-500">{TAHAP_LABELS[wbp.tahapSaatIni]}</p>
                </div>

                <Separator />

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Jenis Layanan", value: JENIS_LAYANAN_LABELS[wbp.jenisLayanan] },
                    { label: "Jenis Kelamin", value: wbp.jenisKelamin === "L" ? "Laki-laki" : wbp.jenisKelamin === "P" ? "Perempuan" : "—" },
                    { label: "Tempat Lahir", value: wbp.tempatLahir || "—" },
                    { label: "Tanggal Lahir", value: wbp.tanggalLahir ? new Date(wbp.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                    { label: "Tgl. Pelaksanaan", value: wbp.tanggalPelaksanaan ? new Date(wbp.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5">{label}</p>
                      <p className="text-xs font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                  {wbp.kodeTracking && (
                    <div className="bg-teal-50 rounded-xl p-3 border border-teal-100">
                      <p className="text-[10px] sm:text-xs text-teal-500 mb-0.5">Kode Tracking</p>
                      <p className="text-xs font-mono font-bold text-teal-700 tracking-wider">{wbp.kodeTracking}</p>
                    </div>
                  )}
                </div>

                {/* Perkara */}
                {wbp.perkara && (
                  <>
                    <Separator />
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Perkara / Tindak Pidana</p>
                      <p className="text-xs text-slate-700 font-semibold leading-snug">{wbp.perkara}</p>
                    </div>
                  </>
                )}

                {/* Alamat */}
                {wbp.alamat && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alamat</p>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">{wbp.alamat}</p>
                    </div>
                  </>
                )}

                {/* Kontak */}
                {(wbp.namaKontakKeluarga || wbp.nomorHpKeluarga) && (
                  <>
                    <Separator />
                    <div className="bg-teal-50 rounded-xl p-3 border border-teal-100">
                      <p className="text-[10px] sm:text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Kontak Keluarga</p>
                      <p className="text-sm font-semibold text-teal-900">{wbp.namaKontakKeluarga || "—"}</p>
                      <p className="font-mono text-xs text-teal-700 mt-0.5">{wbp.nomorHpKeluarga || "—"}</p>
                    </div>
                  </>
                )}

                {wbp.catatan && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Catatan</p>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">{wbp.catatan}</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">Data tidak ditemukan.</div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {wbp && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-2 bg-slate-50/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSend} disabled={sendNotif.isPending}
                  className="h-9 w-9 rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 flex-shrink-0">
                  {sendNotif.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Kirim Notifikasi WhatsApp</p>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Kirim status proses ke nomorarga Binaan</p>
              </TooltipContent>
            </Tooltip>
            <Link href={`/dashboard/wbp/${id}/edit`} className="flex-1">
              <Button className="w-full gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-9 text-sm font-semibold shadow-sm">
                <FileEdit className="h-3.5 w-3.5" /> Edit Data Lengkap
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function WbpList() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [layananFilter, setLayananFilter] = useState<string>("all");
  const [tahapFilter, setTahapFilter] = useState<string>("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const limit = 10;

  const qc = useQueryClient();
  const sendNotif = useSendNotifikasi();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = {
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? (statusFilter as ListWbpStatus) : undefined,
    jenisLayanan: layananFilter !== "all" ? (layananFilter as ListWbpJenisLayanan) : undefined,
    tahap: tahapFilter !== "all" ? (tahapFilter as ListWbpTahap) : undefined,
  };

  const { data, isLoading, isFetching } = useListWbp(params, {
    query: { queryKey: getListWbpQueryKey(params) }
  });

  const handleSendNotif = (wbpId: string, nama: string) => {
    toast.promise(
      sendNotif.mutateAsync({ data: { wbpId } }),
      {
        loading: `Mengirim notifikasi untuk ${nama}...`,
        success: `Notifikasi WA berhasil dikirim ke keluarga ${nama}!`,
        error: (e) => `Gagal: ${e?.error?.error || "Periksa nomor WA keluarga"}`,
      }
    );
  };

  const hasActiveFilter = statusFilter !== "all" || layananFilter !== "all" || tahapFilter !== "all" || !!debouncedSearch;
  const resetFilters = () => { setSearchInput(""); setDebouncedSearch(""); setStatusFilter("all"); setLayananFilter("all"); setTahapFilter("all"); setPage(1); };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const aktifCount = data?.summary?.aktif ?? 0;
  const selesaiCount = data?.summary?.selesai ?? 0;
  const ditolakCount = data?.summary?.ditolak ?? 0;
  const completionRate = data?.total ? Math.round((selesaiCount / data.total) * 100) : 0;

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Data Warga Binaan"
          breadcrumbItems={[{ label: "Data Warga Binaan" }]}
          subtitle="Kelola data Warga Binaan Pemasyarakatan."
        >
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200"
                  onClick={() => qc.invalidateQueries({ queryKey: getListWbpQueryKey() })}>
                  <Users className="h-4 w-4 text-slate-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Perbarui Daftar</p>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Muat ulang data terbaru dari server</p>
              </TooltipContent>
            </Tooltip>
            <Link href="/dashboard/wbp/tambah">
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white gap-2 shadow-sm shadow-teal-500/20 rounded-xl font-semibold">
                <Plus className="h-4 w-4" /> Tambah WBP
              </Button>
            </Link>
          </div>
        </PageShell>

        {/* Summary strip */}
        {!isLoading && data && data.total > 0 && (
          <div className="bg-white rounded-xl ring-1 ring-slate-200/60 px-4 py-3 shadow-sm">
            {/* sm: 2x2 grid + bar; md+: single row */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:items-center sm:gap-4 sm:flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Total:</span>
                <span className="text-sm font-bold text-slate-900">{data.total}</span>
              </div>
              <div className="hidden sm:block"><Separator orientation="vertical" className="h-4" /></div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-xs text-slate-500">Aktif:</span>
                <span className="text-xs font-bold text-blue-700">{aktifCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-xs text-slate-500">Selesai:</span>
                <span className="text-xs font-bold text-green-700">{selesaiCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-xs text-slate-500">Ditolak:</span>
                <span className="text-xs font-bold text-red-700">{ditolakCount}</span>
              </div>
              <div className="col-span-2 sm:flex-1 sm:min-w-36">
                <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mb-1">
                  <span>Tingkat Keberhasilan</span>
                  <span className="font-semibold text-slate-600">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
            {/* Row 1: search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                {isFetching
                  ? <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-teal-500 animate-spin" />
                  : <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                }
                <Input
                  placeholder="Cari nama, nomor registrasi, atau kode tracking..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 h-9 bg-white border-slate-200 text-sm rounded-xl focus-visible:ring-teal-500/30"
                />
              </div>
              {searchInput && (
                <Button type="button" variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-400 hover:text-red-500 flex-shrink-0"
                  onClick={() => { setSearchInput(""); setDebouncedSearch(""); setPage(1); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Row 2: dropdowns — stack on sm, row on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="h-9 bg-white border-slate-200 text-sm rounded-xl">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>

              <Select value={layananFilter} onValueChange={(v) => { setLayananFilter(v); setPage(1); }}>
                <SelectTrigger className="h-9 bg-white border-slate-200 text-sm rounded-xl">
                  <SelectValue placeholder="Semua Layanan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  <SelectItem value="PB">PB — Pembebasan Bersyarat</SelectItem>
                  <SelectItem value="CB">CB — Cuti Bersyarat</SelectItem>
                  <SelectItem value="CMB">CMB — Cuti Menjelang Bebas</SelectItem>
                  <SelectItem value="ASIMILASI">Asimilasi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tahapFilter} onValueChange={(v) => { setTahapFilter(v); setPage(1); }}>
                <SelectTrigger className="h-9 bg-white border-slate-200 text-sm rounded-xl">
                  <SelectValue placeholder="Semua Tahap" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Tahap</SelectItem>
                  <SelectItem value="verifikasi_rutan">Verifikasi Berkas di Rutan</SelectItem>
                  <SelectItem value="pengusulan_litmas">Pengusulan Litmas</SelectItem>
                  <SelectItem value="sidang_tpp_upt">Sidang TPP UPT</SelectItem>
                  <SelectItem value="upload_sdp">Pengusulan via SDP</SelectItem>
                  <SelectItem value="verifikasi_kanwil">Verifikasi Kanwil</SelectItem>
                  <SelectItem value="proses_ditjen_pas">Verifikasi Ditjen PAS</SelectItem>
                  <SelectItem value="sk_terbit">Proses Penerbitan SK</SelectItem>
                  <SelectItem value="turun_sk">Turun SK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset all filters */}
            {hasActiveFilter && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-red-500 gap-1.5 px-2"
                  onClick={resetFilters}>
                  <X className="h-3 w-3" /> Reset semua filter
                </Button>
              </div>
            )}
          </div>

          {/* ── TABLE (lg+) ── */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-slate-100">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 min-w-0 sm:min-w-60">Nama & Registrasi</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400">Layanan</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 min-w-0 sm:min-w-44">Perkara</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 min-w-0 sm:min-w-[170px]">Tahap Saat Ini</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 min-w-0 sm:min-w-28">Tgl. Pelaksanaan</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 text-right pr-5">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="border-slate-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-xl flex-shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-22" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-10 rounded-lg" /></TableCell>
                      <TableCell><Skeleton className="h-3.5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-3.5 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-16 rounded-full mx-auto" /></TableCell>
                      <TableCell className="text-right pr-5"><Skeleton className="h-7 w-7 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-5 w-5 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm">Tidak ada data ditemukan.</p>
                      {debouncedSearch && <Button variant="link" className="text-xs text-teal-600 mt-1 h-auto p-0" onClick={() => { setSearchInput(""); setDebouncedSearch(""); }}>Hapus filter pencarian</Button>}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((item) => (
                    <TableRow key={item.id}
                      className="border-slate-100 hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setPreviewId(item.id)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-xl flex-shrink-0">
                            <AvatarFallback className="rounded-xl bg-teal-50 text-teal-700 text-xs font-bold">
                              {item.nama.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">{item.nama}</p>
                            <span className="font-mono text-[10px] sm:text-xs text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                              {item.nomorRegistrasi}
                            </span>
                            {item.kodeTracking && (
                              <p className="font-mono text-[10px] sm:text-xs text-teal-600 mt-0.5">{item.kodeTracking}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <JenisLayananBadge code={item.jenisLayanan} />
                      </TableCell>
                      <TableCell className="min-w-0 sm:min-w-44" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-slate-600 truncate">{item.perkara || <span className="text-slate-300">—</span>}</p>
                      </TableCell>
                      <TableCell className="min-w-0 sm:min-w-[170px]" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-slate-500 truncate">{TAHAP_LABELS[item.tahapSaatIni]}</p>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-slate-500 tabular-nums">
                          {item.tanggalPelaksanaan ? new Date(item.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : <span className="text-slate-300">—</span>}
                        </p>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <StatusPill status={item.status} />
                      </TableCell>
                      <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"
                              className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100 hover:bg-slate-100">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-slate-200/60">
                            <DropdownMenuItem className="cursor-pointer rounded-lg text-sm" onClick={() => setPreviewId(item.id)}>
                              <Eye className="mr-2 h-3.5 w-3.5" /> Lihat Cepat
                            </DropdownMenuItem>
                            <Link href={`/dashboard/wbp/${item.id}/edit`}>
                              <DropdownMenuItem className="cursor-pointer rounded-lg text-sm">
                                <FileEdit className="mr-2 h-3.5 w-3.5" /> Edit Lengkap
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-teal-700 focus:text-teal-700 focus:bg-teal-50 rounded-lg text-sm"
                              onClick={() => handleSendNotif(item.id, item.nama)}>
                              <Send className="mr-2 h-3.5 w-3.5" /> Kirim Notif WA
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── CARD LIST (sm & md) ── */}
          <div className="lg:hidden">
            {isLoading ? (
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                    <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-52" />
                    </div>
                    <Skeleton className="h-6 w-14 rounded-full flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">Tidak ada data ditemukan.</p>
                {debouncedSearch && (
                  <Button variant="link" className="text-xs text-teal-600 h-auto p-0"
                    onClick={() => { setSearchInput(""); setDebouncedSearch(""); }}>
                    Hapus filter pencarian
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data?.data?.map((item) => (
                  <div key={item.id}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer active:bg-slate-100"
                    onClick={() => setPreviewId(item.id)}>
                    <Avatar className="h-10 w-10 rounded-xl flex-shrink-0 mt-0.5">
                      <AvatarFallback className="rounded-xl bg-teal-50 text-teal-700 text-xs font-bold">
                        {item.nama.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{item.nama}</p>
                        <StatusPill status={item.status} />
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-mono text-[10px] sm:text-xs text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                          {item.nomorRegistrasi}
                        </span>
                        <JenisLayananBadge code={item.jenisLayanan} size="xs" />
                      </div>
                      {item.perkara && (
                        <p className="text-xs text-slate-500 mt-1 truncate">{item.perkara}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <p className="text-xs text-slate-400 truncate flex-1 min-w-0">
                          <span className="text-slate-300 mr-1">Tahap:</span>
                          {TAHAP_LABELS[item.tahapSaatIni]}
                        </p>
                        {item.tanggalPelaksanaan && (
                          <p className="text-xs text-slate-400 tabular-nums flex-shrink-0">
                            {new Date(item.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                      {item.kodeTracking && (
                        <p className="font-mono text-[10px] sm:text-xs text-teal-600 mt-1">{item.kodeTracking}</p>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon"
                          className="h-7 w-7 rounded-lg flex-shrink-0 hover:bg-slate-100 text-slate-400 mt-0.5">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-slate-200/60">
                        <DropdownMenuItem className="cursor-pointer rounded-lg text-sm" onClick={() => setPreviewId(item.id)}>
                          <Eye className="mr-2 h-3.5 w-3.5" /> Lihat Cepat
                        </DropdownMenuItem>
                        <Link href={`/dashboard/wbp/${item.id}/edit`}>
                          <DropdownMenuItem className="cursor-pointer rounded-lg text-sm">
                            <FileEdit className="mr-2 h-3.5 w-3.5" /> Edit Lengkap
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-teal-700 focus:text-teal-700 focus:bg-teal-50 rounded-lg text-sm"
                          onClick={() => handleSendNotif(item.id, item.nama)}>
                          <Send className="mr-2 h-3.5 w-3.5" /> Kirim Notif WA
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Hal. <span className="font-semibold text-slate-700">{page}</span> / {totalPages}
                {data?.total ? <span className="ml-2 text-slate-400">· {data.total} total</span> : ""}
              </p>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-slate-200"
                      onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Halaman Sebelumnya</p>
                    <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Kembali ke hal. {page - 1}</p>
                  </TooltipContent>
                </Tooltip>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                  <Button key={n} variant={page === n ? "default" : "outline"} size="icon"
                    className={`h-7 w-7 rounded-lg text-xs ${page === n ? "bg-teal-600 border-teal-600 hover:bg-teal-700" : "border-slate-200"}`}
                    onClick={() => setPage(n)}>
                    {n}
                  </Button>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-slate-200"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Halaman Berikutnya</p>
                    <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Lanjut ke hal. berikutnya</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Sheet Preview */}
      <WbpPreviewSheet id={previewId} open={!!previewId} onClose={() => setPreviewId(null)} />
    </>
  );
}
