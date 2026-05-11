# Changelog

Semua perubahan penting pada proyek SITARA didokumentasikan di file ini.

## [2.1.0] - 2026-05-11

### Ditambahkan
- QR Code tracking di halaman dashboard (preview sheet dan edit lengkap) dengan tombol download PNG
- Kolom "Status" terpisah di tabel Buku Analisa dengan badge berwarna per status
- Tombol "Cetak" di Buku Analisa — print hanya area tabel (landscape, tanpa sidebar/filter)
- Route API baru: `GET /api/dashboard/stats` dan `GET /api/dashboard/recent`
- Route API baru: `GET /api/tracking/[id]` untuk detail tracking publik
- Calendar picker (shadcn UI) untuk input tanggal lahir di form edit Warga Binaan
- Sanitasi otomatis data input Warga Binaan (Title Case nama, UPPERCASE nomor registrasi, normalisasi nomor HP ke format 628xxx)
- Dynamic page title (`generateMetadata`) di halaman tracking detail dan edit Warga Binaan
- Shared utilities: `lib/db/queries.ts` (cached queries), `lib/utils/wbp-helpers.ts`, `lib/utils/sanitize-wbp.ts`

### Diubah
- Istilah "WBP" diganti "Warga Binaan" di seluruh aplikasi (UI, komentar, error messages, README)
- Istilah "Rutan Kelas IIB Wonosobo" diganti "Rumah Tahanan Negara Kelas IIB Wonosobo"
- Calendar component di-redesign: cell lebih besar, hover scale effect, dropdown bulan/tahun format Indonesia, rounded modern
- Tabel Buku Analisa: header non-hijau menggunakan rowSpan merge, nama ditampilkan penuh tanpa truncate
- Export XLSX Buku Analisa disesuaikan dengan kolom Status baru (18 kolom)
- Normalisasi nomor HP mendukung semua format input (+62, 08, 62, tanpa prefix) di sanitasi dan pengiriman WhatsApp
- Sidebar menu: label "Data WBP" → "Data Warga Binaan", focus outline dihilangkan
- Route `regenerate-tracking` di-rename ke `regenerate-kode` sesuai API client

### Diperbaiki
- Tracking search tidak menampilkan data (parameter mismatch: backend baca `kode`, frontend kirim `q`)
- Response shape tracking search tidak sesuai (backend return object, frontend expect array)
- Dashboard stats dan recent activity tidak tampil (route `/api/dashboard/stats` dan `/api/dashboard/recent` belum ada)
- Notifikasi WhatsApp gagal kirim (field `nomorTujuan` required tapi client hanya kirim `wbpId` — sekarang fallback ke nomor HP keluarga)
- Duplikasi fungsi `generateKodeTracking` dan `mapWbp` di multiple files — di-extract ke shared module
- Double database fetch di `generateMetadata` + client component — menggunakan React `cache()` untuk deduplikasi

## [2.0.0] - 2026-05-10

### Ditambahkan
- Redesign total landing page dengan animasi modern (tw-animate-css)
- Header dan footer publik dengan desain glassmorphism
- Halaman baru: Tentang, Panduan, Kontak
- Open Graph image generated untuk semua halaman publik
- SEO maksimal: sitemap, robots.txt, JSON-LD structured data, meta lengkap
- Security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- Web manifest (PWA-ready)
- Back to top button pada halaman publik
- Error pages lengkap (404, 500, global-error) per route group
- Loading skeleton untuk semua halaman data dinamis
- Admin footer dengan kredit pembuat
- Database indexes untuk optimasi query (11 index)
- AnimateOnScroll component untuk scroll-triggered animations

### Diubah
- Data statis dipindahkan ke codebase (layanan, tahapan, features, docs, changelog, site-config)
- 6 tabel database dihapus untuk performa maksimal
- Navigasi menggunakan Next.js Link (client-side navigation)
- Pengecekan auth dipindahkan ke middleware (tanpa loading UI)
- Admin layout full-width tanpa max-w constraint
- Semua icon menggunakan lucide-react secara konsisten
- Title browser dinamis dengan template `%s | SITARA`
- Istilah "WBP" diganti "Warga Binaan" di halaman publik

### Diperbaiki
- Double header/footer di halaman publik
- Double sidebar di halaman admin
- React Hook order error (safe-react-query)
- Supabase function search_path mutable
- Supabase bucket policy (broad SELECT)
- RLS policies initplan optimization
- Proxy blocking /api/auth/login dan /api/pengaturan GET
- legacyBehavior deprecation warning
- Unused imports dan variables (zero lint warnings)

## [1.0.1] - 2026-05-03

### Diubah
- Pembaruan layout admin dengan PageShell
- Penyelarasan breadcrumb dan header halaman
- Perbaikan tampilan halaman pengaturan

## [1.0.0] - 2026-05-03

### Ditambahkan
- Rilis awal SITARA
- Tracking publik Warga Binaan
- Dashboard admin dan manajemen data Warga Binaan
- Notifikasi WhatsApp via Fonnte
- Laporan dan buku analisa proses
