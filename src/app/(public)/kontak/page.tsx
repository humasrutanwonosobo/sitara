import type { Metadata } from "next";
import { MapPin, Phone, Clock, Mail, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Informasi kontak dan alamat Rumah Tahanan Negara Kelas IIB Wonosobo.",
};

const contactInfo = [
  { icon: Building2, label: "Instansi", value: "Rumah Tahanan Negara Kelas IIB Wonosobo" },
  { icon: MapPin, label: "Alamat", value: "Jl. Raya Wonosobo, Kab. Wonosobo, Jawa Tengah" },
  { icon: Phone, label: "Telepon", value: "(0286) 321XXX · Ext. 404" },
  { icon: Mail, label: "Email", value: "rutan.wonosobo@kemenkumham.go.id" },
  { icon: Clock, label: "Jam Operasional", value: "Senin – Jumat · 08.00 – 16.00 WIB" },
];

export default function KontakPage() {
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
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Kontak</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Hubungi Kami
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Jika Anda membutuhkan bantuan terkait proses reintegrasi atau kode tracking, silakan hubungi kami.
          </p>
        </div>

        {/* Contact cards */}
        <div className="space-y-3 mb-12">
          {contactInfo.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-white/70 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Catatan Penting</h2>
          <ul className="space-y-2 text-xs text-white/35 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0 mt-1.5" />
              Layanan informasi tracking tersedia 24/7 melalui platform ini tanpa perlu datang ke kantor.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0 mt-1.5" />
              Untuk permintaan kode tracking baru, kunjungi kantor pada jam operasional dengan membawa identitas diri.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0 mt-1.5" />
              Seluruh layanan SITARA tidak dipungut biaya. Waspadai pihak yang mengatasnamakan instansi untuk meminta pembayaran.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
