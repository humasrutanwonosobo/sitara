"use client";

import { useGetWbp, getGetWbpQueryKey, useUpdateWbp, useDeleteWbp, getListWbpQueryKey, useSendNotifikasi, useRegenerateKodeTracking } from "@/lib/api-client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JenisLayananBadge } from "@/components/ui/jenis-layanan-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Loader2, ArrowLeft, Save, Trash2, AlertTriangle, Send, History, User, Phone, Info, Copy, RefreshCw, CheckCircle2, ExternalLink, ShieldCheck, Download, CalendarIcon } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useQueryClient } from "@/lib/safe-react-query";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS, TAHAP_ORDER } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

const formSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  nomorRegistrasi: z.string().min(1, "Nomor registrasi wajib diisi"),
  jenisKelamin: z.enum(["L", "P"]).optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  perkara: z.string().optional(),
  alamat: z.string().optional(),
  nomorHpKeluarga: z.string().optional(),
  namaKontakKeluarga: z.string().optional(),
  jenisLayanan: z.enum(["PB", "CB", "CMB", "ASIMILASI"]),
  tahapSaatIni: z.enum(["verifikasi_rutan", "pengusulan_litmas", "sidang_tpp_upt", "upload_sdp", "verifikasi_kanwil", "proses_ditjen_pas", "sk_terbit", "turun_sk"]).optional(),
  status: z.enum(["aktif", "selesai", "ditolak"]).optional(),
  tanggalPelaksanaan: z.string().optional(),
  catatan: z.string().optional(),
});

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    aktif: "bg-blue-50 text-blue-700 border-blue-100",
    selesai: "bg-green-50 text-green-700 border-green-100",
    ditolak: "bg-red-50 text-red-700 border-red-100",
  };
  const dot: Record<string, string> = { aktif: "bg-blue-500", selesai: "bg-green-500", ditolak: "bg-red-500" };
  return (
    <Badge variant="outline" className={`gap-1.5 ${map[status] || ""}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || "bg-slate-400"}`} />
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <FormLabel className="text-xs font-semibold text-slate-600">{label}</FormLabel>
      {children}
    </div>
  );
}

export default function WbpEdit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const qc = useQueryClient();

  const { data, isLoading } = useGetWbp(id, { query: { enabled: !!id, queryKey: getGetWbpQueryKey(id) } });
  const updateMutation = useUpdateWbp();
  const deleteMutation = useDeleteWbp();
  const sendNotif = useSendNotifikasi();
  const regenerateKode = useRegenerateKodeTracking();
  const [copiedKode, setCopiedKode] = useState(false);
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
      a.download = `SITARA-QR-${data?.data?.kodeTracking || "unknown"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nama: "", nomorRegistrasi: "", jenisKelamin: undefined, tempatLahir: "", tanggalLahir: "", perkara: "", alamat: "", nomorHpKeluarga: "", namaKontakKeluarga: "", jenisLayanan: "PB", tahapSaatIni: "verifikasi_rutan", status: "aktif", tanggalPelaksanaan: "", catatan: "" },
  });

  const initRef = useRef(false);
  useEffect(() => {
    if (data?.data && !initRef.current) {
      const w = data.data;
      form.reset({
        nama: w.nama, nomorRegistrasi: w.nomorRegistrasi, jenisKelamin: w.jenisKelamin as z.infer<typeof formSchema>["jenisKelamin"],
        tempatLahir: w.tempatLahir || "", tanggalLahir: w.tanggalLahir ? w.tanggalLahir.split("T")[0] : "",
        perkara: w.perkara || "", alamat: w.alamat || "",
        nomorHpKeluarga: w.nomorHpKeluarga || "", namaKontakKeluarga: w.namaKontakKeluarga || "",
        jenisLayanan: w.jenisLayanan as z.infer<typeof formSchema>["jenisLayanan"], tahapSaatIni: w.tahapSaatIni as z.infer<typeof formSchema>["tahapSaatIni"],
        status: w.status as z.infer<typeof formSchema>["status"], tanggalPelaksanaan: w.tanggalPelaksanaan ? w.tanggalPelaksanaan.split("T")[0] : "",
        catatan: w.catatan || "",
      });
      initRef.current = true;
    }
  }, [data, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      jenisKelamin: values.jenisKelamin || undefined,
      tempatLahir: values.tempatLahir || undefined,
      tanggalLahir: values.tanggalLahir || undefined,
      perkara: values.perkara || undefined,
      alamat: values.alamat || undefined,
      tanggalPelaksanaan: values.tanggalPelaksanaan || undefined,
      nomorHpKeluarga: values.nomorHpKeluarga || undefined,
      namaKontakKeluarga: values.namaKontakKeluarga || undefined,
      catatan: values.catatan || undefined,
    };
    toast.promise(
      updateMutation.mutateAsync({ id, data: payload }),
      {
        loading: "Menyimpan perubahan...",
        success: () => {
          qc.invalidateQueries({ queryKey: getListWbpQueryKey() });
          qc.invalidateQueries({ queryKey: getGetWbpQueryKey(id) });
          setTimeout(() => router.push("/dashboard/wbp"), 800);
          return "Data Warga Binaan berhasil diperbarui!";
        },
        error: (e) => `Gagal menyimpan: ${e?.error?.error || "Terjadi kesalahan"}`,
      }
    );
  };

  const handleDelete = () => {
    toast.promise(
      deleteMutation.mutateAsync({ id }),
      {
        loading: "Menghapus data Warga Binaan...",
        success: () => {
          qc.invalidateQueries({ queryKey: getListWbpQueryKey() });
          setTimeout(() => router.push("/dashboard/wbp"), 500);
          return "Data Warga Binaan berhasil dihapus.";
        },
        error: (e) => `Gagal menghapus: ${e?.error?.error || "Terjadi kesalahan"}`,
      }
    );
  };

  const handleCopyKode = (kode: string) => {
    navigator.clipboard.writeText(kode);
    setCopiedKode(true);
    setTimeout(() => setCopiedKode(false), 2000);
  };

  const handleRegenerateKode = () => {
    toast.promise(
      regenerateKode.mutateAsync({ id }),
      {
        loading: "Membuat kode tracking baru...",
        success: () => {
          qc.invalidateQueries({ queryKey: getGetWbpQueryKey(id) });
          return "Kode tracking baru berhasil dibuat!";
        },
        error: (e) => `Gagal: ${e?.error?.error || "Terjadi kesalahan"}`,
      }
    );
  };

  const handleSendNotif = () => {
    toast.promise(
      sendNotif.mutateAsync({ data: { wbpId: id } }),
      {
        loading: "Mengirim notifikasi WhatsApp...",
        success: "Notifikasi berhasil dikirim ke keluarga!",
        error: (e) => `Gagal: ${e?.error?.error || "Periksa nomor WA keluarga"}`,
      }
    );
  };

  if (isLoading) {
    return (
      <>
        <div className="space-y-5 w-full">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div><Skeleton className="h-5 w-40 mb-1.5" /><Skeleton className="h-3.5 w-56" /></div>
          </div>
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Skeleton className="lg:col-span-2 h-80 md:h-[500px] rounded-2xl" />
            <Skeleton className="h-64 md:h-[300px] rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  if (!data?.data) {
    return (
      <>
        <div className="text-center max-w-md mx-auto mt-16">
          <Avatar className="h-16 w-16 rounded-2xl mx-auto mb-4">
            <AvatarFallback className="rounded-2xl bg-slate-100 text-slate-400 text-2xl"><User /></AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-slate-400 text-sm mb-6">Data mungkin telah dihapus atau ID tidak valid.</p>
          <Link href="/dashboard/wbp"><Button variant="outline" className="rounded-xl" asChild><span>Kembali ke Daftar</span></Button></Link>
        </div>
      </>
    );
  }

  const wbp = data.data;
  const riwayat = data.riwayat || [];
  const currentIdx = TAHAP_ORDER.indexOf(wbp.tahapSaatIni);
  const progress = Math.round(((currentIdx + 1) / TAHAP_ORDER.length) * 100);
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedStatus = form.watch("status");

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Edit Data Warga Binaan"
          breadcrumbItems={[{ label: "Data Warga Binaan", href: "/dashboard/wbp" }, { label: wbp.nama }]}
          subtitle="Perbarui informasi dan status reintegrasi."
        >
          <Link href="/dashboard/wbp">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleSendNotif} disabled={sendNotif.isPending}
                className="gap-2 rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 h-9 text-sm">
                {sendNotif.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Kirim Notif WA
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Kirim Notifikasi WhatsApp</p>
              <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Status terkini dikirim ke nomor keluarga via Fonnte</p>
            </TooltipContent>
          </Tooltip>

          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 h-9 text-sm">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-semibold text-red-300">Hapus Data Warga Binaan</p>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">Tindakan ini tidak bisa dibatalkan</p>
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="rounded-2xl max-w-md">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <AlertDialogTitle className="text-left text-lg">Konfirmasi Hapus Data</AlertDialogTitle>
                </div>
                <AlertDialogDescription asChild>
                  <div className="space-y-3 text-left">
                    <p className="text-slate-600 text-sm">Anda akan <strong className="text-red-600">menghapus permanen</strong> data berikut dari sistem:</p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-xl">
                          <AvatarFallback className="rounded-xl bg-red-100 text-red-700 text-sm font-bold">
                            {wbp.nama.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{wbp.nama}</p>
                          <p className="font-mono text-xs text-slate-500">{wbp.nomorRegistrasi}</p>
                        </div>
                      </div>
                      <Separator className="bg-red-200" />
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-slate-500">Layanan:</span> <span className="font-semibold">{JENIS_LAYANAN_LABELS[wbp.jenisLayanan]}</span></div>
                        <div><span className="text-slate-500">Status:</span> <span className="font-semibold">{STATUS_LABELS[wbp.status]}</span></div>
                        <div className="col-span-2"><span className="text-slate-500">Tahap:</span> <span className="font-semibold">{TAHAP_LABELS[wbp.tahapSaatIni]}</span></div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">Seluruh riwayat status ({riwayat.length} entri) dan log notifikasi terkait akan ikut terhapus. Tindakan ini <strong>tidak dapat dibatalkan</strong>.</p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl flex-1">Batal, Kembali</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1 gap-2" disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Ya, Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PageShell>

        {/* Info Banner */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-teal-50 to-emerald-50/50 rounded-2xl px-5 py-3.5 border border-teal-100 flex-wrap">
          <Avatar className="h-10 w-10 rounded-xl flex-shrink-0">
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-sm font-bold">
              {wbp.nama.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm">{wbp.nama}</p>
            <p className="font-mono text-[10px] sm:text-xs text-slate-400">{wbp.nomorRegistrasi}</p>
            {wbp.perkara && <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-xs">{wbp.perkara}</p>}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <JenisLayananBadge code={wbp.jenisLayanan} full />
            <StatusBadge status={wbp.status} />
            {wbp.kodeTracking && (
              <span className="font-mono text-[10px] sm:text-xs text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md">{wbp.kodeTracking}</span>
            )}
          </div>
          <div className="w-full sm:w-48">
            <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mb-1">
              <span>Progress tahap</span>
              <span className="font-semibold text-teal-700">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Form with Tabs */}
          <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="profil" className="w-full">
                  <div className="px-5 pt-5 border-b border-slate-100">
                    <TabsList className="bg-slate-100/80 h-9 p-1 rounded-xl">
                      <TabsTrigger value="profil" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-700 gap-1.5">
                        <User className="h-3.5 w-3.5" /> Data Pribadi
                      </TabsTrigger>
                      <TabsTrigger value="status" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-700 gap-1.5">
                        <History className="h-3.5 w-3.5" /> Status & Tahap
                      </TabsTrigger>
                      <TabsTrigger value="kontak" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-700 gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> Kontak
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="profil" className="mt-0 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="nama" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FieldGroup label="Nama Lengkap *">
                            <FormControl><Input className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="nomorRegistrasi" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Nomor Registrasi *">
                            <FormControl><Input className="rounded-xl border-slate-200 h-10 text-sm font-mono focus-visible:ring-teal-500/30" {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Jenis Kelamin">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="rounded-xl border-slate-200 h-10 text-sm"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                              <SelectContent className="rounded-xl"><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent>
                            </Select>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="tempatLahir" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Tempat Lahir">
                            <FormControl><Input className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" placeholder="Kota/Kabupaten" {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="tanggalLahir" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Tanggal Lahir">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className={`w-full rounded-xl border-slate-200 h-10 text-sm justify-start text-left font-normal focus-visible:ring-teal-500/30 ${!field.value ? "text-muted-foreground" : ""}`}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                    {field.value
                                      ? new Date(field.value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                      : "Pilih tanggal"}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-slate-200/80" align="start" sideOffset={8}>
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      const yyyy = date.getFullYear();
                                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                                      const dd = String(date.getDate()).padStart(2, "0");
                                      field.onChange(`${yyyy}-${mm}-${dd}`);
                                    } else {
                                      field.onChange("");
                                    }
                                  }}
                                  defaultMonth={field.value ? new Date(field.value) : undefined}
                                  captionLayout="dropdown"
                                  startMonth={new Date(1940, 0)}
                                  endMonth={new Date()}
                                  disabled={(date) => date > new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="perkara" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Perkara / Tindak Pidana">
                            <FormControl><Input className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" placeholder="cth: Pencurian, Narkotika..." {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="alamat" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FieldGroup label="Alamat Lengkap">
                            <FormControl><Textarea className="rounded-xl border-slate-200 min-h-18 text-sm focus-visible:ring-teal-500/30" placeholder="Jl. ... Desa/Kel. ... Kec. ... Kab/Kota ... Provinsi ..." {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  <TabsContent value="status" className="mt-0 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: "jenisLayanan" as const, label: "Jenis Layanan *", items: Object.entries(JENIS_LAYANAN_LABELS) },
                        { name: "tahapSaatIni" as const, label: "Tahap Saat Ini", items: Object.entries(TAHAP_LABELS) },
                        { name: "status" as const, label: "Status", items: Object.entries(STATUS_LABELS) },
                      ].map(({ name, label, items }) => (
                        <FormField key={name} control={form.control} name={name} render={({ field }) => (
                          <FormItem>
                            <FieldGroup label={label}>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="rounded-xl border-slate-200 h-10 text-sm"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="rounded-xl">{items.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                              </Select>
                            </FieldGroup>
                            <FormMessage />
                          </FormItem>
                        )} />
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="tanggalPelaksanaan" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Tanggal Pelaksanaan">
                            <FormControl><Input type="date" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {watchedStatus === "ditolak" && (
                      <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-red-700 space-y-0.5">
                          <p className="font-bold">Status Ditolak — Wajib isi alasan</p>
                          <p>Alasan penolakan di bawah akan tampil ke keluarga Warga Binaan di portal publik dan dicatat di riwayat status.</p>
                        </div>
                      </div>
                    )}
                    <FormField control={form.control} name="catatan" render={({ field }) => (
                      <FormItem>
                        <FieldGroup label={watchedStatus === "ditolak" ? "Alasan Penolakan *" : "Catatan / Keterangan Publik"}>
                          <FormControl>
                            <Textarea
                              placeholder={watchedStatus === "ditolak"
                                ? "Jelaskan alasan penolakan secara jelas dan informatif untuk keluarga..."
                                : "Keterangan ini akan tampil di portal publik keluarga..."}
                              className={`rounded-xl min-h-20 text-sm ${watchedStatus === "ditolak"
                                ? "border-red-300 focus-visible:ring-red-400/30 bg-red-50/50"
                                : "border-slate-200 focus-visible:ring-teal-500/30"}`}
                              {...field}
                            />
                          </FormControl>
                        </FieldGroup>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {/* Tahap visual stepper */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Urutan Tahapan</p>
                      <div className="flex flex-wrap gap-2">
                        {TAHAP_ORDER.map((tahap, idx) => {
                          const isActive = tahap === wbp.tahapSaatIni;
                          const isDone = idx < currentIdx;
                          return (
                            <div key={tahap} className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border ${isActive ? "bg-teal-50 text-teal-700 border-teal-200" : isDone ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-slate-400 border-slate-200"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-teal-500 animate-pulse" : isDone ? "bg-green-500" : "bg-slate-300"}`} />
                              {idx + 1}. {TAHAP_LABELS[tahap]?.split(" ").slice(0, 2).join(" ")}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="kontak" className="mt-0 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="namaKontakKeluarga" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Nama Keluarga / Penjamin">
                            <FormControl><Input placeholder="Nama lengkap penjamin" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="nomorHpKeluarga" render={({ field }) => (
                        <FormItem>
                          <FieldGroup label="Nomor WhatsApp Keluarga">
                            <FormControl><Input placeholder="08xxxxxxxxxx" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                          </FieldGroup>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-teal-700 space-y-1">
                          <p className="font-semibold">Tentang Notifikasi WhatsApp</p>
                          <p>Notifikasi otomatis dikirim saat status Warga Binaan diperbarui. Pastikan nomor WA aktif dan terdaftar di WhatsApp.</p>
                          <p>Format: <span className="font-mono">628xxxxxxxxx</span> atau <span className="font-mono">08xxxxxxxxx</span></p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
                    <Link href="/dashboard/wbp">
                      <Button type="button" variant="outline" className="rounded-xl border-slate-200 h-10 text-sm">Batal</Button>
                    </Link>
                    <Button type="submit" disabled={updateMutation.isPending}
                      className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-10 text-sm font-semibold shadow-sm">
                      {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Simpan Perubahan
                    </Button>
                  </div>
                </Tabs>
              </form>
            </Form>
          </div>

          {/* Kode Tracking */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Kode Tracking Publik</h2>
            </div>
            <div className="p-5 space-y-4">
              {wbp.kodeTracking ? (
                <>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kode Aktif</p>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <span className="font-mono text-sm font-bold text-teal-700 flex-1 tracking-wider">{wbp.kodeTracking}</span>
                      <button
                        onClick={() => handleCopyKode(wbp.kodeTracking!)}
                        className="text-slate-400 hover:text-teal-600 transition-colors flex-shrink-0"
                        title="Salin kode"
                      >
                        {copiedKode ? <CheckCircle2 className="h-4 w-4 text-teal-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <a
                    href={`/tracking/${wbp.kodeTracking}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Buka halaman publik keluarga
                  </a>

                  {/* QR Code */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">QR Code Tracking</p>
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
                        <QRCodeSVG
                          value={`${typeof window !== "undefined" ? window.location.origin : ""}/tracking/${wbp.kodeTracking}`}
                          size={140}
                          level="H"
                          includeMargin={false}
                          ref={qrRef}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="w-full gap-2 text-xs border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg h-8"
                      onClick={downloadQR}
                    >
                      <Download className="h-3 w-3" /> Download QR
                    </Button>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 space-y-1">
                        <p className="font-semibold">Keamanan Akses</p>
                        <p>Kode ini dikirim via WhatsApp ke keluarga. Hanya pihak yang mengetahui kode yang bisa mengakses data tracking publik.</p>
                      </div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm"
                        className="w-full gap-2 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50 text-xs"
                        disabled={regenerateKode.isPending}>
                        {regenerateKode.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        Buat Kode Baru
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl max-w-sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Buat Kode Tracking Baru?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Kode lama <span className="font-mono font-bold text-slate-800">{wbp.kodeTracking}</span> akan <strong>tidak berlaku</strong>. Keluarga harus menggunakan kode baru untuk mengakses status. Pastikan mengirim ulang notifikasi WhatsApp setelah ini.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRegenerateKode}
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                          Ya, Buat Kode Baru
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 mb-3">Belum ada kode tracking</p>
                  <Button size="sm" onClick={handleRegenerateKode} disabled={regenerateKode.isPending}
                    className="gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs">
                    {regenerateKode.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    Generate Kode
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Riwayat */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden sticky top-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                  <History className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm">Riwayat Status</h2>
              </div>
              {riwayat.length > 0 && (
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 h-4 font-semibold">{riwayat.length} entri</Badge>
              )}
            </div>
            <ScrollArea className="h-64 md:h-[340px]">
              <div className="p-4">
                {riwayat.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <History className="h-5 w-5 text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-400">Belum ada riwayat status.</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {riwayat.map((r, i) => (
                      <div key={r.id} className="flex gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${i === 0 ? "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-sm" : "bg-slate-100 border border-slate-200"}`}>
                            <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-slate-400"}`} />
                          </div>
                          {i < riwayat.length - 1 && <div className="w-px flex-1 min-h-3 my-1 bg-slate-100" />}
                        </div>
                        <div className={`pb-4 flex-1 pt-1 ${i === riwayat.length - 1 ? "pb-0" : ""}`}>
                          <div className="flex items-start justify-between gap-1 flex-wrap">
                            <p className={`text-xs font-bold leading-snug ${i === 0 ? "text-teal-700" : "text-slate-600"}`}>
                              {TAHAP_LABELS[r.tahap] || r.tahap}
                            </p>
                            <time className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0">
                              {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}
                            </time>
                          </div>
                          {r.keterangan && (
                            <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg leading-snug">
                              {r.keterangan}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

      </div>
    </>
  );
}
