---
description: Cek Supabase database (lint, policies, query) langsung via DATABASE_URL
---

Jalankan script `scripts/supabase-check.mjs` dengan argumen berikut: $ARGUMENTS

Mode tersedia:
- `lint` — Jalankan Supabase database linter (default)
- `policies` — Tampilkan semua RLS policies di schema public
- `tables` — List semua tabel di schema public
- `query <SQL>` — Eksekusi SQL query read-only

Gunakan `node` untuk menjalankan script. DATABASE_URL dibaca otomatis dari `.env`.

Setelah dapat hasil, analisa dan jelaskan issue yang ditemukan (jika ada) beserta saran perbaikannya.
