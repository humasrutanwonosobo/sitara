import type { Metadata } from "next";
import { ShieldCheck, Target, Eye, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Informasi tentang Sistem Informasi Tracking Reintegrasi Narapidana — platform resmi Rumah Tahanan Negara Wonosobo.",
};

export default function TentangPage() {
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
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Tentang</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Apa itu SITARA?
          </h1>
          <p className="text-sm sm:text-base text-white/40 max-w-lg mx-auto leading-relaxed">
            Sistem Informasi Tracking Reintegrasi Narapidana — platform digital resmi untuk memantau proses reintegrasi Warga Binaan Pemasyarakatan di Rumah Tahanan Negara Kelas IIB Wonosobo.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Target, title: "Misi", desc: "Menyediakan akses informasi proses reintegrasi yang transparan, akurat, dan real-time bagi keluarga Warga Binaan." },
            { icon: Eye, title: "Visi", desc: "Mewujudkan layanan pemasyarakatan yang terbuka, akuntabel, dan berorientasi pada keluarga." },
            { icon: Users, title: "Untuk Siapa", desc: "Keluarga Warga Binaan yang ingin memantau proses Pembebasan Bersyarat, Cuti Bersyarat, CMB, dan Asimilasi." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                <Icon className="h-4 w-4 text-teal-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4">Tentang Instansi</h2>
          <div className="space-y-3 text-sm text-white/40 leading-relaxed">
            <p>
              <span className="text-white/70 font-semibold">Rumah Tahanan Negara Kelas IIB Wonosobo</span> merupakan Unit Pelaksana Teknis di bawah Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia.
            </p>
            <p>
              SITARA dikembangkan untuk menjembatani kebutuhan informasi keluarga Warga Binaan terkait proses reintegrasi yang sedang berjalan, tanpa perlu datang langsung ke kantor.
            </p>
            <p>
              Seluruh data bersumber dari Sistem Database Pemasyarakatan (SDP) yang terverifikasi dan dikelola oleh petugas resmi.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-teal-400 flex-shrink-0" />
            <p className="text-xs text-white/25">Platform ini bersifat resmi dan data yang ditampilkan telah diverifikasi oleh petugas pemasyarakatan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
