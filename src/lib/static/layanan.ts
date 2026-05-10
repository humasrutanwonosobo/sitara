export interface LayananItem {
  id: string;
  code: string;
  label: string;
  desc: string;
  color: string;
  glow: string;
  dot: string;
  sortOrder: number;
  isActive: boolean;
}

export const LAYANAN_DATA: LayananItem[] = [
  {
    id: "ad44707b-0372-4add-b587-2299e14d49bf",
    code: "PB",
    label: "Pembebasan Bersyarat",
    desc: "Proses pembebasan Warga Binaan yang telah menjalani 2/3 masa pidana dengan persyaratan tertentu.",
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
    dot: "bg-blue-400",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "cbe71a9d-ca66-4637-96bb-2aaaae3b7465",
    code: "CB",
    label: "Cuti Bersyarat",
    desc: "Pemberian izin kepada Warga Binaan untuk menjalani sisa pidana di luar lembaga pemasyarakatan.",
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    dot: "bg-violet-400",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "1630a548-5bad-43cc-9b1f-5effad72da92",
    code: "CMB",
    label: "Cuti Menjelang Bebas",
    desc: "Hak Warga Binaan untuk cuti sebelum bebas guna mempersiapkan diri kembali ke masyarakat.",
    color: "from-teal-500 to-emerald-600",
    glow: "shadow-teal-500/20",
    dot: "bg-teal-400",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "26fd5caa-b255-4850-a7a7-ca0b09a665d3",
    code: "ASIMILASI",
    label: "Asimilasi",
    desc: "Pembinaan Warga Binaan di luar lembaga pemasyarakatan agar lebih siap kembali ke masyarakat.",
    color: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
    dot: "bg-amber-400",
    sortOrder: 3,
    isActive: true,
  },
];
