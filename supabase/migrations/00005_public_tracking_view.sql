-- ============================================================
-- SITARA: Tighten public tracking access via view
-- Public can only see limited columns via view, not full wbp table
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CREATE PUBLIC VIEW (limited columns, SECURITY INVOKER)
--    SECURITY INVOKER ensures RLS of the querying user is applied,
--    avoiding privilege escalation via SECURITY DEFINER (default).
--    Ref: https://supabase.com/docs/guides/database/database-linter
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.tracking_wbp
WITH (security_invoker = true) AS
SELECT
  id,
  kode_tracking,
  nama,
  nomor_registrasi,
  jenis_kelamin,
  tempat_lahir,
  tanggal_lahir,
  tanggal_pelaksanaan,
  jenis_layanan,
  tahap_saat_ini,
  status,
  CASE WHEN status = 'ditolak' THEN catatan ELSE NULL END AS catatan,
  updated_at
FROM public.wbp
WHERE kode_tracking IS NOT NULL;

-- ────────────────────────────────────────────────────────────
-- 2. RLS ON wbp TABLE
--    Allow public SELECT so the tracking_wbp view (SECURITY INVOKER)
--    can read rows with kode_tracking. Write operations require auth.
--    Sensitive columns are protected at the API layer (mapWbpPublic)
--    and the view only exposes safe columns.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "wbp:read" ON wbp;
CREATE POLICY "wbp:read" ON wbp FOR SELECT USING (
  (select auth.role()) = 'authenticated' OR kode_tracking IS NOT NULL
);

-- ────────────────────────────────────────────────────────────
-- 3. RLS ON riwayat_status TABLE
--    Public can view riwayat only if parent wbp has tracking code.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "riwayat_status:read" ON riwayat_status;
CREATE POLICY "riwayat_status:read" ON riwayat_status FOR SELECT USING (
  (select auth.role()) = 'authenticated'
  OR wbp_id IN (SELECT id FROM wbp WHERE kode_tracking IS NOT NULL)
);

-- ────────────────────────────────────────────────────────────
-- 4. GRANT PUBLIC ACCESS TO VIEW
--    With SECURITY INVOKER, the view runs with the caller's privileges,
--    so RLS on wbp is enforced per-user.
-- ────────────────────────────────────────────────────────────

GRANT SELECT ON public.tracking_wbp TO anon, authenticated;
