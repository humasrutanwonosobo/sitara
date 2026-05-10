export interface ChangelogItem {
  id: string;
  version: string;
  date: string;
  items: string[];
  isPublished: boolean;
}

export const CHANGELOG_DATA: ChangelogItem[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    version: "v2.0.0",
    date: "10 Mei 2026",
    items: [
      "Redesign total landing page dengan animasi modern (tw-animate-css).",
      "Header dan footer publik diperbarui dengan desain glassmorphism.",
      "Halaman baru: Tentang, Panduan, Kontak.",
      "Open Graph image generated untuk semua halaman publik.",
      "SEO maksimal: sitemap, robots, JSON-LD, meta lengkap.",
      "Security headers: HSTS, X-Frame-Options, CSP, Permissions-Policy.",
      "Data statis dipindahkan ke codebase (layanan, tahapan, features, docs, changelog, site-config).",
      "6 tabel database dihapus, performa meningkat signifikan.",
      "Database indexes ditambahkan untuk optimasi query.",
      "RLS policies diperbaiki (initplan optimization).",
      "Semua icon menggunakan lucide-react secara konsisten.",
      "Loading skeleton untuk semua halaman data dinamis.",
      "Back to top button pada halaman publik.",
      "Error pages lengkap (404, 500, global-error) per route group.",
      "Navigasi menggunakan Next.js Link (client-side navigation).",
      "Pengecekan auth dipindahkan ke middleware (tanpa loading UI).",
      "Admin layout full-width dengan footer kredit pembuat.",
      "Fix: double header/footer, double sidebar, hook order error.",
      "Fix: Supabase function search_path, bucket policy, RLS initplan.",
    ],
    isPublished: true,
  },
  {
    id: "e340eb7f-169d-40b7-b83e-829c62d69693",
    version: "v1.0.1",
    date: "03 Mei 2026",
    items: [
      "Pembaruan layout admin dengan PageShell.",
      "Penyelarasan breadcrumb dan header halaman.",
      "Perbaikan tampilan halaman pengaturan.",
    ],
    isPublished: true,
  },
  {
    id: "9436ac88-9c5e-41a4-8c52-ab30679b66ff",
    version: "v1.0.0",
    date: "03 Mei 2026",
    items: [
      "Rilis awal SITARA.",
      "Tracking publik Warga Binaan.",
      "Dashboard admin dan manajemen data Warga Binaan.",
      "Notifikasi WhatsApp dan laporan analisa.",
    ],
    isPublished: true,
  },
];
