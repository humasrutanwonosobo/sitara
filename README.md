# SITARA

**Sistem Informasi Tracking Reintegrasi Narapidana**

Platform resmi untuk memantau proses reintegrasi Warga Binaan Pemasyarakatan di Rumah Tahanan Negara Kelas IIB Wonosobo.

<p align="center">
  <img src="public/logo.png" alt="SITARA Logo" width="80" />
</p>

## Fitur

- 🔍 **Tracking Publik** — Keluarga Warga Binaan dapat memantau status reintegrasi secara real-time menggunakan kode tracking
- 📊 **Dashboard Admin** — Manajemen data Warga Binaan, statistik, dan monitoring proses
- 📱 **Notifikasi WhatsApp** — Pengiriman status otomatis ke keluarga via Fonnte API
- 📋 **Buku Analisa** — Rekapitulasi tahap proses reintegrasi dalam format tabel
- 📄 **Laporan & Ekspor** — Export data ke XLSX dengan format kop surat resmi
- 🔒 **Keamanan** — RLS, middleware auth, security headers, parameterized queries

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth
- **State**: TanStack React Query
- **Icons**: Lucide React
- **Deployment**: Vercel

## Halaman Publik

| Route | Deskripsi |
|-------|-----------|
| `/` | Landing page |
| `/tracking` | Cek status reintegrasi |
| `/tracking/[id]` | Detail tracking |
| `/tentang` | Tentang SITARA |
| `/panduan` | Panduan penggunaan |
| `/kontak` | Informasi kontak |

## Halaman Admin

| Route | Deskripsi |
|-------|-----------|
| `/dashboard` | Ringkasan statistik |
| `/dashboard/wbp` | Data Warga Binaan |
| `/dashboard/wbp/tambah` | Tambah data Warga Binaan |
| `/dashboard/wbp/[id]/edit` | Edit data Warga Binaan |
| `/dashboard/buku-analisa` | Buku analisa proses |
| `/dashboard/notifikasi` | Log notifikasi WhatsApp |
| `/dashboard/laporan` | Laporan & ekspor |
| `/dashboard/pengaturan` | Pengaturan sistem |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (Supabase)

### Installation

```bash
git clone https://github.com/humasrutanwonosobo/sitara.git
cd sitara
npm install
```

### Environment Variables

Salin `.env.example` ke `.env` dan isi dengan kredensial Anda:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Route group admin (protected)
│   ├── (public)/          # Route group publik
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/            # Layout components
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature components
└── lib/                   # Utilities
    ├── static/            # Static data (layanan, tahapan, dll)
    ├── api-client/        # Generated API client (orval)
    └── supabase/          # Supabase client & proxy
```

## Lisensi

Hak cipta © 2026 Rumah Tahanan Negara Kelas IIB Wonosobo. Seluruh hak dilindungi.

## Pembuat

Dibuat dengan ☕ oleh [Eliyanto Sarage](https://www.instagram.com/eliyantosarage_/)
