export interface DocsItem {
  id: string;
  sectionTitle: string;
  items: string[];
  sortOrder: number;
  isActive: boolean;
}

export const DOCS_DATA: DocsItem[] = [
  {
    id: "849a3188-d25a-4f68-bf91-0c9aedb5eff4",
    sectionTitle: "Apa itu SITARA?",
    items: [
      "SITARA adalah Sistem Informasi Tracking Reintegrasi Narapidana.",
      "Dipakai untuk memantau proses reintegrasi Warga Binaan di Rumah Tahanan Negara Kelas IIB Wonosobo.",
      "Mendukung pemantauan status, notifikasi WhatsApp, dan rekap analisa proses.",
    ],
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "95e79f4b-7729-46b3-99ff-5491dd5eac63",
    sectionTitle: "Fitur Utama",
    items: [
      "Tracking kode Warga Binaan untuk keluarga.",
      "Dashboard ringkasan proses dan status.",
      "Data Warga Binaan, notifikasi WA, laporan, dan buku analisa.",
      "Pengaturan akun dan sistem admin.",
    ],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "8b7f4e1e-8615-43c1-8719-24056b5a8fa6",
    sectionTitle: "Panduan Penggunaan",
    items: [
      "Masukkan kode tracking dari WhatsApp di halaman utama.",
      "Admin kelola data Warga Binaan dari halaman dashboard.",
      "Gunakan laporan untuk ekspor data dan analisa proses.",
    ],
    sortOrder: 2,
    isActive: true,
  },
];
