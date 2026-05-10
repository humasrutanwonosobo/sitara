"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useListNotifikasiLog, getListNotifikasiLogQueryKey, useSendNotifikasi } from "@/lib/api-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Send, Loader2, CheckCircle2, Clock, XCircle, Search, MessageSquare,
  X, RefreshCw, Eye, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@/lib/safe-react-query";
import { toast } from "sonner";

interface LogItem {
  id: string;
  wbpId: string;
  wbpNama?: string;
  nomorHp: string;
  pesan: string;
  statusKirim: string;
  sentAt: string;
}

function StatusPill({ status }: { status: string }) {
  if (status === "berhasil") return (
    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-100 hover:bg-green-50 text-xs whitespace-nowrap">
      <CheckCircle2 className="h-3 w-3" /> Berhasil
    </Badge>
  );
  if (status === "pending") return (
    <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 text-xs whitespace-nowrap">
      <Clock className="h-3 w-3" /> Pending
    </Badge>
  );
  return (
    <Badge variant="outline" className="gap-1 bg-red-50 text-red-700 border-red-100 hover:bg-red-50 text-xs whitespace-nowrap">
      <XCircle className="h-3 w-3" /> Gagal
    </Badge>
  );
}

function MessageSheet({ log, open, onClose }: { log: LogItem | null; open: boolean; onClose: () => void }) {
  if (!log) return null;
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[92vw] sm:w-md md:w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <SheetTitle className="text-base">Detail Pesan</SheetTitle>
          <SheetDescription className="text-xs">Log notifikasi WhatsApp via Fonnte</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-2xl flex-shrink-0">
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-sm font-bold">
                  {(log.wbpNama || "WB").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900">{log.wbpNama || "Warga Binaan " + log.wbpId.slice(0, 8)}</h3>
                <p className="font-mono text-xs text-slate-400 mt-0.5">{log.nomorHp}</p>
                <div className="mt-1.5"><StatusPill status={log.statusKirim} /></div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5">Waktu Kirim</p>
                <p className="text-xs font-semibold text-slate-800">
                  {new Date(log.sentAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="font-mono text-[10px] sm:text-xs text-slate-500">
                  {new Date(log.sentAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5">ID Log</p>
                <p className="font-mono text-[10px] sm:text-xs text-slate-600 break-all">{log.id.slice(0, 8)}...</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Isi Pesan Terkirim</p>
              <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl p-4 relative">
                <div className="absolute top-4 left-[-6px] w-3 h-3 bg-green-100 rotate-45" />
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-[system-ui]">{log.pesan}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-3 text-right flex items-center justify-end gap-1">
                  {new Date(log.sentAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  {log.statusKirim === "berhasil" && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-2 text-center">Dikirim via Fonnte WhatsApp API</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function LogCard({ item, onClick }: { item: LogItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl ring-1 ring-slate-200/70 shadow-sm px-4 py-3.5 flex items-start gap-3 hover:ring-teal-300 hover:shadow-md transition-all active:scale-[0.99] group"
    >
      <Avatar className="h-9 w-9 rounded-xl flex-shrink-0 mt-0.5">
        <AvatarFallback className="rounded-xl bg-teal-50 text-teal-700 text-xs font-bold">
          {(item.wbpNama || "WB").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
              {item.wbpNama || "Warga Binaan " + item.wbpId.slice(0, 8)}
            </p>
            <p className="font-mono text-[10px] sm:text-xs text-slate-400 mt-0.5">{item.nomorHp}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <StatusPill status={item.statusKirim} />
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono whitespace-nowrap">
              {new Date(item.sentAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
              {" · "}
              {new Date(item.sentAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.pesan}</p>
      </div>
    </button>
  );
}

const LIMIT = 15;

export default function NotificationLog() {
  const [page, setPage] = useState(1);
  const [wbpIdFilter, setWbpIdFilter] = useState("");
  const [wbpIdInput, setWbpIdInput] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useListNotifikasiLog(
    { page, limit: LIMIT, wbpId: wbpIdFilter || undefined },
    { query: { queryKey: getListNotifikasiLogQueryKey({ page, limit: LIMIT, wbpId: wbpIdFilter || undefined }) } }
  );

  const sendNotifMutation = useSendNotifikasi();

  const totalPages = Math.ceil((data?.total ?? 0) / LIMIT);
  const startEntry = (page - 1) * LIMIT + 1;
  const endEntry = Math.min(page * LIMIT, data?.total ?? 0);

  const summary = data?.summary ?? { berhasil: 0, gagal: 0, pending: 0 };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setWbpIdFilter(wbpIdInput);
    setPage(1);
  };

  const handleClearFilter = () => {
    setWbpIdFilter("");
    setWbpIdInput("");
    setPage(1);
  };

  const handleRefresh = () => {
    toast.promise(
      qc.invalidateQueries({ queryKey: getListNotifikasiLogQueryKey() }),
      { loading: "Memperbarui log...", success: "Log diperbarui!", error: "Gagal." }
    );
  };

  const handleSendManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = new FormData(e.currentTarget).get("wbpId") as string;
    if (!id.trim()) { toast.warning("ID Warga Binaan kosong", { description: "Masukkan ID Warga Binaan yang valid." }); return; }
    toast.promise(
      sendNotifMutation.mutateAsync({ data: { wbpId: id.trim() } }),
      {
        loading: "Mengirim notifikasi WhatsApp...",
        success: () => {
          qc.invalidateQueries({ queryKey: getListNotifikasiLogQueryKey() });
          (e.target as HTMLFormElement).reset();
          return "Notifikasi berhasil dikirim!";
        },
        error: (err) => `Gagal: ${err?.error?.error || "Periksa ID Warga Binaan"}`,
      }
    );
  };

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Notifikasi WhatsApp"
          breadcrumbItems={[{ label: "Notifikasi WhatsApp" }]}
          subtitle="Log pengiriman pesan via Fonnte ke keluarga Warga Binaan"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 flex-shrink-0" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 text-slate-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Perbarui Log</p>
              <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Muat ulang data log notifikasi</p>
            </TooltipContent>
          </Tooltip>
        </PageShell>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Log", value: data?.total ?? 0, icon: MessageSquare, color: "text-teal-600", bg: "bg-teal-50", loading: isLoading },
            { label: "Berhasil", value: summary.berhasil, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", loading: isLoading },
            { label: "Gagal", value: summary.gagal, icon: XCircle, color: "text-red-600", bg: "bg-red-50", loading: isLoading },
            { label: "Pending", value: summary.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", loading: isLoading },
          ].map(({ label, value, icon: Icon, color, bg, loading }) => (
            <div key={label} className="bg-white rounded-xl ring-1 ring-slate-200/60 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{label}</p>
                {loading ? (
                  <Skeleton className="h-5 w-10 mt-0.5" />
                ) : (
                  <p className="text-lg font-bold text-slate-900 leading-tight">{value.toLocaleString("id-ID")}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* ── Log table/cards — 2/3 width on lg ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">

            {/* Filter bar */}
            <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Filter berdasarkan Warga Binaan ID..."
                    value={wbpIdInput}
                    onChange={(e) => setWbpIdInput(e.target.value)}
                    className="pl-9 h-9 bg-white border-slate-200 text-xs sm:text-sm rounded-xl focus-visible:ring-teal-500/30"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" className="rounded-xl h-9 text-xs font-semibold px-3 sm:px-4">
                  Filter
                </Button>
                {wbpIdFilter && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-400 hover:text-red-500" onClick={handleClearFilter}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p className="font-semibold">Hapus Filter</p></TooltipContent>
                  </Tooltip>
                )}
              </form>
              {wbpIdFilter && (
                <p className="text-[10px] sm:text-xs text-teal-600 font-medium mt-2 ml-1">
                  Filter aktif: ID WBP <span className="font-mono">{wbpIdFilter.slice(0, 16)}…</span>
                </p>
              )}
            </div>

            {/* ── Card view — visible on < md ── */}
            <div className="md:hidden">
              {isLoading ? (
                <div className="p-3 space-y-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl ring-1 ring-slate-200/60 px-4 py-3.5 flex items-start gap-3">
                      <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between gap-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.data?.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Belum ada log notifikasi</p>
                  <p className="text-slate-300 text-xs mt-1">Coba hapus filter atau kirim notifikasi baru</p>
                </div>
              ) : (
                <div className="p-3 space-y-2.5">
                  {data?.data?.map((item) => (
                    <LogCard key={item.id} item={item as LogItem} onClick={() => setSelectedLog(item as LogItem)} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Table view — visible on md+ ── */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-slate-100">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 w-28 pl-4">Waktu</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400">Penerima</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Pratinjau Pesan</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center w-28">Status</TableHead>
                    <TableHead className="w-10 pr-4" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i} className="border-slate-100">
                        <TableCell className="pl-4"><Skeleton className="h-3.5 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Skeleton className="h-8 w-8 rounded-xl flex-shrink-0" />
                            <div className="space-y-1.5">
                              <Skeleton className="h-3.5 w-28" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-3.5 w-full" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-5 w-16 rounded-full mx-auto" /></TableCell>
                        <TableCell className="pr-4"><Skeleton className="h-6 w-6 rounded-lg" /></TableCell>
                      </TableRow>
                    ))
                  ) : data?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <MessageSquare className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Belum ada log notifikasi</p>
                        <p className="text-slate-300 text-xs mt-1">Coba hapus filter atau kirim notifikasi baru</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer group"
                        onClick={() => setSelectedLog(item as LogItem)}
                      >
                        <TableCell className="whitespace-nowrap pl-4">
                          <p className="text-xs font-semibold text-slate-700">
                            {new Date(item.sentAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
                          </p>
                          <p className="font-mono text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            {new Date(item.sentAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 rounded-xl flex-shrink-0">
                              <AvatarFallback className="rounded-xl bg-teal-50 text-teal-700 text-[10px] sm:text-xs font-bold">
                                {(item.wbpNama || "WB").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate max-w-40">
                                {item.wbpNama || "Warga Binaan " + item.wbpId.slice(0, 8)}
                              </p>
                              <p className="font-mono text-[10px] sm:text-xs text-slate-400 mt-0.5">{item.nomorHp}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs">
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.pesan}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusPill status={item.statusKirim} />
                        </TableCell>
                        <TableCell className="pr-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost" size="icon"
                                className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-50 hover:text-teal-700"
                                onClick={(e) => { e.stopPropagation(); setSelectedLog(item as LogItem); }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-semibold">Lihat Detail Pesan</p></TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ── Pagination ── */}
            {!isLoading && (data?.total ?? 0) > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  Menampilkan <span className="font-semibold text-slate-600">{startEntry}–{endEntry}</span> dari{" "}
                  <span className="font-semibold text-slate-600">{data?.total}</span> log
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline" size="icon"
                    className="h-7 w-7 rounded-lg border-slate-200 disabled:opacity-40"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs text-slate-600 font-semibold px-2 min-w-20 text-center">
                    Hal {page} / {totalPages || 1}
                  </span>
                  <Button
                    variant="outline" size="icon"
                    className="h-7 w-7 rounded-lg border-slate-200 disabled:opacity-40"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Side panel — sticky on lg, below table on sm/md ── */}
          <div className="space-y-4 lg:sticky lg:top-6">

            {/* Kirim Manual */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Send className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Kirim Manual</h2>
                  <p className="text-xs text-slate-400">Kirim ulang notifikasi ke keluarga Warga Binaan</p>
                </div>
              </div>
              <form onSubmit={handleSendManual} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">ID Warga Binaan (UUID)</label>
                  <Input
                    name="wbpId"
                    required
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="bg-slate-50 border-slate-200 text-xs rounded-xl h-9 font-mono focus-visible:ring-teal-500/30"
                  />
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 leading-snug">
                    ID WBP tersedia di halaman edit data WBP atau URL browser.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-semibold h-9 text-sm shadow-sm"
                  disabled={sendNotifMutation.isPending}
                >
                  {sendNotifMutation.isPending
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Send className="h-3.5 w-3.5" />}
                  Kirim Pesan WA
                </Button>
              </form>
            </div>

            {/* Keterangan Status */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-4">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Keterangan Status</p>
              <div className="space-y-2.5">
                {[
                  { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Berhasil", desc: "Pesan terkirim ke WhatsApp tujuan" },
                  { icon: Clock,        color: "text-amber-600", bg: "bg-amber-50", label: "Pending",  desc: "Menunggu konfirmasi dari Fonnte" },
                  { icon: XCircle,      color: "text-red-600",   bg: "bg-red-50",   label: "Gagal",    desc: "Nomor tidak valid atau tidak aktif" },
                ].map(({ icon: Icon, color, bg, label, desc }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-3.5 w-3.5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{label}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Fonnte */}
            <div className="bg-teal-50 rounded-2xl ring-1 ring-teal-100 p-4">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">Tentang Fonnte</p>
              <p className="text-xs text-teal-700 leading-relaxed">
                Notifikasi dikirim melalui <span className="font-semibold">Fonnte WhatsApp API</span>.
                Pastikan saldo Fonnte mencukupi dan nomor HP keluarga Warga Binaan aktif dan terdaftar di WhatsApp.
              </p>
            </div>
          </div>
        </div>

      </div>

      <MessageSheet log={selectedLog} open={!!selectedLog} onClose={() => setSelectedLog(null)} />
    </>
  );
}
