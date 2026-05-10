import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquare, Search, Eye, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Panduan Penggunaan",
  description: "Cara menggunakan SITARA untuk memantau status reintegrasi Warga Binaan Pemasyarakatan.",
};

const steps = [
  {
    num: "1",
    title: "Dapatkan Kode Tracking",
    desc: "Saat Warga Binaan didaftarkan ke sistem oleh petugas, kode tracking unik (format: SITARA-XX-XXXXXXXX) akan dikirim otomatis via WhatsApp ke nomor keluarga yang terdaftar.",
    icon: MessageSquare,
  },
  {
    num: "2",
    title: "Masukkan Kode di Halaman Tracking",
    desc: "Buka halaman Cek Status, lalu masukkan kode tracking yang Anda terima. Sistem akan langsung menampilkan data Warga Binaan yang sesuai.",
    icon: Search,
  },
  {
    num: "3",
    title: "Pantau Status Terkini",
    desc: "Lihat tahapan proses yang sedang berjalan, catatan dari petugas, dan riwayat perubahan status. Anda juga bisa menyimpan QR Code untuk akses cepat di kemudian hari.",
    icon: Eye,
  },
];

const faqs = [
  { q: "Bagaimana jika kode tracking hilang?", a: "Hubungi petugas Rutan Wonosobo untuk meminta pengiriman ulang kode ke nomor WhatsApp yang terdaftar." },
  { q: "Apakah data saya aman?", a: "Ya. Data hanya bisa diakses oleh pemegang kode tracking. Tanpa kode, tidak ada yang bisa melihat informasi Warga Binaan." },
  { q: "Berapa lama proses reintegrasi?", a: "Durasi bervariasi tergantung jenis layanan dan kelengkapan berkas. Rata-rata 2–6 bulan dari verifikasi hingga SK terbit." },
  { q: "Apakah ada biaya?", a: "Tidak. Seluruh layanan SITARA dan proses reintegrasi tidak dipungut biaya apapun." },
];

export default function PanduanPage() {
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
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-teal-500/[0.05] blur-[100px]" />

      <div className="relative max-w-3xl mx-auto px-5 pt-12 sm:pt-16 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Panduan</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Cara Menggunakan SITARA
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Ikuti langkah-langkah berikut untuk memantau status reintegrasi anggota keluarga Anda.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-0 mb-14">
          {steps.map(({ num, title, desc, icon: Icon }, i) => (
            <div key={num} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm shadow-teal-500/30">
                  {num}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 min-h-8 my-2 bg-gradient-to-b from-teal-500/30 to-transparent" />}
              </div>
              <div className={i < steps.length - 1 ? "pb-8" : ""}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="h-4 w-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-14">
          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-500/30 active:scale-95"
          >
            Cek Status Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-4 w-4 text-teal-400" />
            <h2 className="text-lg font-bold text-white">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4">
                <p className="text-sm font-semibold text-white/70 mb-1.5">{q}</p>
                <p className="text-xs text-white/35 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
