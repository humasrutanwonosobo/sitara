import type { Metadata } from "next";
import { MapPin, Phone, Clock, Mail, Building2, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Informasi kontak dan alamat Rumah Tahanan Negara Kelas IIB Wonosobo.",
};

const contactInfo = [
  { icon: Building2, label: "Instansi", value: "Rumah Tahanan Negara Kelas IIB Wonosobo" },
  { icon: MapPin, label: "Alamat", value: "Jl. Pramuka No.1, Sumberan Barat, Wonosobo Bar., Kec. Wonosobo, Kabupaten Wonosobo, Jawa Tengah 56311" },
  { icon: Phone, label: "Telepon", value: "(0286) 321030" },
  { icon: MessageCircle, label: "Layanan & Pengaduan", value: "0851-3856-8795" },
  { icon: Mail, label: "Email", value: "rutanwsb@gmail.com" },
  { icon: Clock, label: "Jam Operasional", value: "Senin – Jumat · 09.00 – 11.30 WIB" },
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

      <div className="relative max-w-4xl mx-auto px-5 pt-12 sm:pt-16 pb-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact info */}
          <div className="space-y-3">
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

          {/* Map */}
          <div className="space-y-3">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.123!2d109.9017874!3d-7.3603312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa056029da10b%3A0x1ae278eb49746082!2sRutan%20Klas%20IIB%20Wonosobo!5e0!3m2!1sid!2sid!4v1715000000000!5m2!1sid!2sid"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Lokasi Rutan Kelas IIB Wonosobo"
              />
            </div>
            <a
              href="https://www.google.com/maps/place/Rutan+Klas+IIB+Wonosobo/@-7.3603312,109.9017874,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.07] hover:border-teal-500/30 hover:bg-white/[0.06] rounded-xl px-4 py-3 transition-all"
            >
              <MapPin className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/50 font-medium">Buka di Google Maps</span>
            </a>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
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
