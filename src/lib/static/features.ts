export interface FeatureItem {
  id: string;
  section: string;
  data: Record<string, string>;
  sortOrder: number;
  isActive: boolean;
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "0166bf77-64ba-4654-b57f-54196d2d1840",
    section: "keunggulan",
    data: {
      icon: "FileCheck2",
      title: "Transparan",
      desc: "Seluruh dokumen dan tahapan terpantau secara langsung, tanpa perantara tidak resmi.",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "b5ce9811-8c90-4006-bf5e-9931231a83c7",
    section: "keunggulan",
    data: {
      icon: "Zap",
      title: "Real-time",
      desc: "Pembaruan status dikirim langsung oleh petugas saat setiap tahap selesai diproses.",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "2826ab4b-c09d-48aa-be20-c5efa4ac1665",
    section: "keunggulan",
    data: {
      icon: "MessageSquare",
      title: "Notif WhatsApp",
      desc: "Keluarga menerima pesan otomatis via WhatsApp setiap kali ada pembaruan status.",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "83bb973e-786e-4189-9a0c-d36c8c6f47bb",
    section: "keunggulan",
    data: {
      icon: "ShieldCheck",
      title: "Data Resmi",
      desc: "Bersumber dari SDP (Sistem Database Pemasyarakatan) yang terverifikasi.",
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/20",
    },
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "a362ebfe-b105-4cc0-a704-e1857dab3c45",
    section: "how_to",
    data: {
      n: "1",
      title: "Gunakan Kode Tracking",
      desc: "Masukkan kode unik format SITARA-XX-XXXXXXXX yang dikirim via WhatsApp ke nomor keluarga terdaftar.",
    },
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "6a27e395-a9d0-403d-acbf-25d6270df2a2",
    section: "how_to",
    data: {
      n: "2",
      title: "Temukan Data Warga Binaan",
      desc: "Sistem mencocokkan kode secara langsung — hanya pemegang kode yang dapat mengakses data.",
    },
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "09120519-f712-4698-b7bf-83e0f79b826e",
    section: "how_to",
    data: {
      n: "3",
      title: "Lihat Status Terkini",
      desc: "Pantau tahapan proses, baca catatan petugas, dan simpan QR Code untuk akses cepat berikutnya.",
    },
    sortOrder: 2,
    isActive: true,
  },
];
