-- ============================================================
-- SITARA: Keep-alive cron job
-- Mencegah Supabase free tier pause (7 hari inaktivitas)
-- Hit REST API sendiri via pg_net agar dihitung sebagai activity
-- ============================================================

-- Unschedule old job jika ada
SELECT cron.unschedule('keep-alive-daemon');

-- Schedule: tiap 6 jam (0:00, 6:00, 12:00, 18:00 UTC)
SELECT cron.schedule(
  'keep-alive-daemon',
  '0 */6 * * *',
  $$
  SELECT net.http_get(
    url := 'https://***REMOVED***.supabase.co/rest/v1/wbp?select=id&limit=1',
    headers := jsonb_build_object(
      'apikey', '***REMOVED***',
      'Authorization', 'Bearer ***REMOVED***'
    ),
    timeout_milliseconds := 5000
  );
  $$
);
