"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useCreateWbp, getListWbpQueryKey } from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, ArrowLeft, Save, User, BarChart2, Phone, Info, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@/lib/safe-react-query";
import { JENIS_LAYANAN_LABELS, TAHAP_LABELS, STATUS_LABELS } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";

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

const TAB_ORDER = ["profil", "status", "kontak"] as const;
const TAB_PROGRESS: Record<string, number> = { profil: 33, status: 67, kontak: 100 };
const TAB_LABEL: Record<string, string> = { profil: "Data Pribadi", status: "Status & Layanan", kontak: "Kontak Keluarga" };

export default function WbpAdd() {
  const router = useRouter();
  const qc = useQueryClient();
  const createMutation = useCreateWbp();
  const [activeTab, setActiveTab] = useState("profil");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nama: "", nomorRegistrasi: "", jenisKelamin: undefined, tempatLahir: "", tanggalLahir: "", perkara: "", alamat: "", nomorHpKeluarga: "", namaKontakKeluarga: "", jenisLayanan: "PB", tahapSaatIni: "verifikasi_rutan", status: "aktif", tanggalPelaksanaan: "", catatan: "" },
  });

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
      createMutation.mutateAsync({ data: payload }),
      {
        loading: "Menyimpan data Warga Binaan baru...",
        success: (result) => {
          qc.invalidateQueries({ queryKey: getListWbpQueryKey() });
          setTimeout(() => router.push("/dashboard/wbp"), 600);
          return `Data Warga Binaan "${result?.data?.nama || values.nama}" berhasil ditambahkan!`;
        },
        error: (e) => `Gagal: ${e?.error?.error || "Terjadi kesalahan saat menyimpan"}`,
      }
    );
  };

  const currentTabIndex = TAB_ORDER.indexOf(activeTab as typeof TAB_ORDER[number]);

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell
          title="Tambah Data Warga Binaan Baru"
          breadcrumbItems={[{ label: "Data Warga Binaan", href: "/dashboard/wbp" }, { label: "Tambah Baru" }]}
          subtitle="Isi data lengkap Warga Binaan Pemasyarakatan."
        >
          <Link href="/dashboard/wbp">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </PageShell>

        {/* Progress indicator */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Langkah {currentTabIndex + 1} dari {TAB_ORDER.length}</span>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 font-semibold">{TAB_LABEL[activeTab]}</Badge>
            </div>
            <span className="text-xs font-bold text-teal-600">{TAB_PROGRESS[activeTab]}%</span>
          </div>
          <Progress value={TAB_PROGRESS[activeTab]} className="h-2" />
          <div className="flex items-center gap-3 mt-3">
            {TAB_ORDER.map((tab, idx) => (
              <div key={tab} className="flex items-center gap-2 flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${idx <= currentTabIndex ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}>
                      {idx < currentTabIndex ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{TAB_LABEL[tab]}</TooltipContent>
                </Tooltip>
                <span className={`text-[10px] sm:text-xs font-semibold hidden sm:block ${idx <= currentTabIndex ? "text-teal-700" : "text-slate-400"}`}>{TAB_LABEL[tab]}</span>
                {idx < TAB_ORDER.length - 1 && <div className={`flex-1 h-px ${idx < currentTabIndex ? "bg-teal-300" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-5 pt-5 border-b border-slate-100">
                  <TabsList className="bg-slate-100/80 h-9 p-1 rounded-xl">
                    <TabsTrigger value="profil" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-700 gap-1.5">
                      <User className="h-3.5 w-3.5" /> Data Pribadi
                    </TabsTrigger>
                    <TabsTrigger value="status" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-700 gap-1.5">
                      <BarChart2 className="h-3.5 w-3.5" /> Status & Layanan
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
                        <FormLabel className="text-xs font-semibold text-slate-600">Nama Lengkap <span className="text-red-400">*</span></FormLabel>
                        <FormControl><Input placeholder="Masukkan nama lengkap Warga Binaan" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nomorRegistrasi" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Nomor Registrasi <span className="text-red-400">*</span></FormLabel>
                        <FormControl><Input placeholder="B.I.0000/2024" className="rounded-xl border-slate-200 h-10 text-sm font-mono focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="rounded-xl border-slate-200 h-10 text-sm"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-xl"><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tempatLahir" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Tempat Lahir</FormLabel>
                        <FormControl><Input placeholder="Kota/Kabupaten" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tanggalLahir" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Tanggal Lahir</FormLabel>
                        <FormControl><Input type="date" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="perkara" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Perkara / Tindak Pidana</FormLabel>
                        <FormControl><Input placeholder="cth: Pencurian, Narkotika..." className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="alamat" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs font-semibold text-slate-600">Alamat Lengkap</FormLabel>
                        <FormControl><Textarea placeholder="Jl. ... Desa/Kel. ... Kec. ... Kab/Kota ... Provinsi ..." className="rounded-xl border-slate-200 min-h-18 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab("status")}
                      className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-9 text-sm font-semibold shadow-sm">
                      Lanjut: Status & Layanan →
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="status" className="mt-0 p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "jenisLayanan" as const, label: "Jenis Layanan *", items: Object.entries(JENIS_LAYANAN_LABELS) },
                      { name: "tahapSaatIni" as const, label: "Tahap Awal", items: Object.entries(TAHAP_LABELS) },
                      { name: "status" as const, label: "Status Awal", items: Object.entries(STATUS_LABELS) },
                    ].map(({ name, label, items }) => (
                      <FormField key={name} control={form.control} name={name} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600">{label}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="rounded-xl border-slate-200 h-10 text-sm"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-xl">{items.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="tanggalPelaksanaan" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Tanggal Pelaksanaan</FormLabel>
                        <FormControl><Input type="date" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="catatan" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-600">Catatan / Keterangan Proses</FormLabel>
                      <FormControl><Textarea placeholder="Keterangan proses yang ditampilkan di portal publik keluarga..." className="rounded-xl border-slate-200 min-h-20 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("profil")}
                      className="rounded-xl h-9 text-sm border-slate-200">← Sebelumnya</Button>
                    <Button type="button" onClick={() => setActiveTab("kontak")}
                      className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-9 text-sm font-semibold shadow-sm">
                      Lanjut: Kontak →
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="kontak" className="mt-0 p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="namaKontakKeluarga" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Nama Keluarga / Penjamin</FormLabel>
                        <FormControl><Input placeholder="Nama lengkap penjamin" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nomorHpKeluarga" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600">Nomor WhatsApp Keluarga</FormLabel>
                        <FormControl><Input placeholder="08xxxxxxxxxx" className="rounded-xl border-slate-200 h-10 text-sm focus-visible:ring-teal-500/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-teal-700 space-y-1">
                      <p className="font-semibold">Nomor WA untuk Notifikasi Otomatis</p>
                      <p>Nomor ini digunakan untuk mengirim pembaruan status via WhatsApp (Fonnte). Pastikan nomor aktif dan terdaftar di WhatsApp.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("status")}
                      className="rounded-xl h-10 text-sm border-slate-200">← Sebelumnya</Button>
                    <div className="flex gap-2">
                      <Link href="/dashboard/wbp">
                        <Button type="button" variant="ghost" className="rounded-xl h-10 text-sm text-slate-500">Batal</Button>
                      </Link>
                      <Button type="submit" disabled={createMutation.isPending}
                        className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-10 text-sm font-semibold shadow-sm shadow-teal-500/25">
                        {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Simpan Data Warga Binaan
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

      </div>
    </>
  );
}
