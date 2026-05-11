export type ChangelogCategory = "added" | "changed" | "fixed" | "removed";

export interface ChangelogEntry {
  category: ChangelogCategory;
  text: string;
}

export interface ChangelogItem {
  id: string; // gunakan format version tanpa titik: "v2-1-0"
  version: string;
  date: string;
  summary?: string;
  items: (string | ChangelogEntry)[];
  isPublished: boolean;
}

export const CHANGELOG_DATA: ChangelogItem[] = [
  {
    id: "v2-1-0",
    version: "v2.1.0",
    date: "11 Mei 2026",
    summary: "QR Code, sanitasi data, perbaikan tracking & dashboard, rename instansi.",
    items: [
      { category: "added", text: "QR Code tracking di halaman dashboard (preview sheet dan edit lengkap) dengan download PNG." },
      { category: "added", text: "Kolom `Status` terpisah di tabel Buku Analisa dengan badge berwarna." },
      { category: "added", text: "Tombol **Cetak** di Buku Analisa dan Laporan — print hanya area tabel, tanpa sidebar." },
      { category: "added", text: "Route API baru: `/api/dashboard/stats`, `/api/dashboard/recent`, `/api/tracking/[id]`." },
      { category: "added", text: "Calendar picker (`shadcn/ui`) untuk input tanggal lahir." },
      { category: "added", text: "Sanitasi otomatis data input: `toTitleCase()` nama, `toUpperCase()` nomor registrasi, normalisasi HP ke format `628xxx`." },
      { category: "added", text: "Dynamic page title (`generateMetadata`) di halaman tracking detail dan edit Warga Binaan." },
      { category: "added", text: "Shared utilities: `lib/db/queries.ts`, `lib/utils/wbp-helpers.ts`, `lib/utils/sanitize-wbp.ts`." },
      { category: "changed", text: "Istilah `WBP` diganti `Warga Binaan` di seluruh aplikasi." },
      { category: "changed", text: "Nama instansi diubah ke **Rumah Tahanan Negara Kelas IIB Wonosobo**." },
      { category: "changed", text: "Calendar component di-redesign: cell `2.75rem`, `hover:scale-105`, dropdown bulan/tahun format Indonesia." },
      { category: "changed", text: "Tabel Buku Analisa: header merge `rowSpan`, nama tanpa `truncate`." },
      { category: "changed", text: "Export XLSX disesuaikan dengan kolom Status baru (`TOTAL_COLS = 18`)." },
      { category: "fixed", text: "Tracking search tidak menampilkan data — parameter mismatch: backend baca `kode`, frontend kirim `q`." },
      { category: "fixed", text: "Dashboard stats dan recent activity tidak tampil — route `/api/dashboard/stats` belum ada." },
      { category: "fixed", text: "Notifikasi WA gagal kirim — `nomorTujuan` required, sekarang fallback ke `nomorHpKeluarga`." },
      { category: "fixed", text: "Duplikasi fungsi `generateKodeTracking` dan `mapWbp` — di-extract ke shared module." },
      { category: "fixed", text: "Double fetch di `generateMetadata` + client component — menggunakan React `cache()` untuk deduplikasi." },
    ],
    isPublished: true,
  },
  {
    id: "v2-0-0",
    version: "v2.0.0",
    date: "10 Mei 2026",
    summary: "Redesign total, SEO maksimal, security headers, performa database.",
    items: [
      { category: "added", text: "Redesign total landing page dengan animasi modern (`tw-animate-css`)." },
      { category: "added", text: "Header dan footer publik dengan desain **glassmorphism**." },
      { category: "added", text: "Halaman baru: `/tentang`, `/panduan`, `/kontak`." },
      { category: "added", text: "Open Graph image generated untuk semua halaman publik." },
      { category: "added", text: "SEO maksimal: `sitemap.xml`, `robots.txt`, JSON-LD structured data, meta lengkap." },
      { category: "added", text: "Security headers: `HSTS`, `X-Frame-Options`, `CSP`, `Permissions-Policy`." },
      { category: "added", text: "Database indexes (11 index) untuk optimasi query." },
      { category: "added", text: "Loading skeleton untuk semua halaman data dinamis." },
      { category: "added", text: "Back to top button pada halaman publik." },
      { category: "added", text: "Error pages lengkap (`404`, `500`, `global-error`) per route group." },
      { category: "changed", text: "Data statis dipindahkan ke codebase (`lib/static/`)." },
      { category: "changed", text: "6 tabel database dihapus untuk performa maksimal." },
      { category: "changed", text: "Navigasi menggunakan `next/link` (client-side navigation)." },
      { category: "changed", text: "Pengecekan auth dipindahkan ke `middleware.ts` (tanpa loading UI)." },
      { category: "changed", text: "Admin layout full-width dengan footer kredit pembuat." },
      { category: "changed", text: "Semua icon menggunakan `lucide-react` secara konsisten." },
      { category: "fixed", text: "Double header/footer di halaman publik." },
      { category: "fixed", text: "Double sidebar di halaman admin." },
      { category: "fixed", text: "React Hook order error (`safe-react-query`)." },
      { category: "fixed", text: "Supabase `search_path` mutable, bucket policy, RLS `initplan`." },
    ],
    isPublished: true,
  },
  {
    id: "v1-0-1",
    version: "v1.0.1",
    date: "03 Mei 2026",
    summary: "Perbaikan layout dan tampilan admin.",
    items: [
      { category: "changed", text: "Pembaruan layout admin dengan `PageShell` component." },
      { category: "changed", text: "Penyelarasan breadcrumb dan header halaman." },
      { category: "fixed", text: "Perbaikan tampilan halaman pengaturan." },
    ],
    isPublished: true,
  },
  {
    id: "v1-0-0",
    version: "v1.0.0",
    date: "03 Mei 2026",
    summary: "Rilis awal SITARA.",
    items: [
      { category: "added", text: "Tracking publik Warga Binaan." },
      { category: "added", text: "Dashboard admin dan manajemen data Warga Binaan." },
      { category: "added", text: "Notifikasi WhatsApp via **Fonnte API**." },
      { category: "added", text: "Laporan dan buku analisa proses." },
    ],
    isPublished: true,
  },
];
