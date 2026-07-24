-- ============================================================
-- SITARA: Keep-alive cron job
-- Mencegah Supabase free tier pause (7 hari inaktivitas)
-- Hit REST API sendiri via pg_net agar dihitung sebagai activity
-- ============================================================

-- NOTE: Jalankan scripts/setup-cron.mjs untuk deploy cron dengan key asli.
-- Key tidak di-hardcode di sini untuk mencegah bocor di git.

-- Unschedule old job jika ada
SELECT cron.unschedule('keep-alive-daemon');

-- Schedule: tiap 6 jam (0:00, 6:00, 12:00, 18:00 UTC)
-- Command di-set via script setup-cron.mjs
SELECT cron.schedule(
  'keep-alive-daemon',
  '0 */6 * * *',
  'SELECT 1'
);

