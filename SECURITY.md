# Security Policy

## Versi yang Didukung

| Versi | Didukung |
|-------|----------|
| 2.0.x | ✅ |
| 1.0.x | ❌ |

## Melaporkan Kerentanan

Jika Anda menemukan kerentanan keamanan pada SITARA, silakan laporkan secara bertanggung jawab:

1. **Jangan** membuat issue publik di GitHub
2. Hubungi administrator melalui kontak resmi Rutan Wonosobo
3. Sertakan deskripsi detail tentang kerentanan yang ditemukan
4. Berikan waktu yang wajar untuk perbaikan sebelum disclosure publik

## Langkah Keamanan yang Diterapkan

- **Authentication**: Supabase Auth dengan session management
- **Authorization**: Row Level Security (RLS) di database
- **Middleware**: Proteksi route admin dan API
- **Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Input Validation**: Zod schema validation di semua endpoint
- **SQL Injection**: Parameterized queries via Drizzle ORM
- **Rate Limiting**: Built-in Supabase Auth rate limiting
- **CORS**: Same-origin policy (Next.js default)
- **Secrets**: Environment variables, tidak di-commit ke repository
