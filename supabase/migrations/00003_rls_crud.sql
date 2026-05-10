-- ============================================================
-- SITARA: Normalize RLS — exactly 4 CRUD policies per table
-- :read combines authenticated + public access via OR
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. DROP ALL EXISTING POLICIES
-- ────────────────────────────────────────────────────────────

-- Drop all old-style policies (from 00001 and leftovers)
DROP POLICY IF EXISTS "Authenticated read admin_users" ON profiles;
DROP POLICY IF EXISTS "Authenticated insert admin_users" ON profiles;
DROP POLICY IF EXISTS "Authenticated update admin_users" ON profiles;
DROP POLICY IF EXISTS "Authenticated delete admin_users" ON profiles;
DROP POLICY IF EXISTS "Public search via tracking code" ON wbp;
DROP POLICY IF EXISTS "Authenticated read wbp" ON wbp;
DROP POLICY IF EXISTS "Authenticated insert wbp" ON wbp;
DROP POLICY IF EXISTS "Authenticated update wbp" ON wbp;
DROP POLICY IF EXISTS "Authenticated delete wbp" ON wbp;
DROP POLICY IF EXISTS "Public view riwayat via tracking" ON riwayat_status;
DROP POLICY IF EXISTS "Authenticated read riwayat" ON riwayat_status;
DROP POLICY IF EXISTS "Authenticated insert riwayat" ON riwayat_status;
DROP POLICY IF EXISTS "Authenticated update riwayat" ON riwayat_status;
DROP POLICY IF EXISTS "Authenticated delete riwayat" ON riwayat_status;
DROP POLICY IF EXISTS "Authenticated read notifikasi" ON log_notifikasi;
DROP POLICY IF EXISTS "Authenticated insert notifikasi" ON log_notifikasi;
DROP POLICY IF EXISTS "Authenticated update notifikasi" ON log_notifikasi;
DROP POLICY IF EXISTS "Authenticated delete notifikasi" ON log_notifikasi;
DROP POLICY IF EXISTS "Public read site config" ON site_config;
DROP POLICY IF EXISTS "Authenticated insert site config" ON site_config;
DROP POLICY IF EXISTS "Authenticated update site config" ON site_config;
DROP POLICY IF EXISTS "Authenticated delete site config" ON site_config;
DROP POLICY IF EXISTS "Public read docs" ON docs;
DROP POLICY IF EXISTS "Authenticated insert docs" ON docs;
DROP POLICY IF EXISTS "Authenticated update docs" ON docs;
DROP POLICY IF EXISTS "Authenticated delete docs" ON docs;
DROP POLICY IF EXISTS "Public read changelog" ON changelog;
DROP POLICY IF EXISTS "Authenticated insert changelog" ON changelog;
DROP POLICY IF EXISTS "Authenticated update changelog" ON changelog;
DROP POLICY IF EXISTS "Authenticated delete changelog" ON changelog;
DROP POLICY IF EXISTS "Public read layanan" ON layanan;
DROP POLICY IF EXISTS "Authenticated insert layanan" ON layanan;
DROP POLICY IF EXISTS "Authenticated update layanan" ON layanan;
DROP POLICY IF EXISTS "Authenticated delete layanan" ON layanan;
DROP POLICY IF EXISTS "Public read tahapan" ON tahapan;
DROP POLICY IF EXISTS "Authenticated insert tahapan" ON tahapan;
DROP POLICY IF EXISTS "Authenticated update tahapan" ON tahapan;
DROP POLICY IF EXISTS "Authenticated delete tahapan" ON tahapan;
DROP POLICY IF EXISTS "Public read features" ON features;
DROP POLICY IF EXISTS "Authenticated insert features" ON features;
DROP POLICY IF EXISTS "Authenticated update features" ON features;
DROP POLICY IF EXISTS "Authenticated delete features" ON features;
DROP POLICY IF EXISTS "Public read QR codes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload QR codes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update QR codes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete QR codes" ON storage.objects;
-- Leftover auto-generated policies
DROP POLICY IF EXISTS "changelog_admin_all" ON changelog;
DROP POLICY IF EXISTS "changelog_public_read" ON changelog;
DROP POLICY IF EXISTS "docs_admin_all" ON docs;
DROP POLICY IF EXISTS "docs_public_read" ON docs;
DROP POLICY IF EXISTS "features_admin_all" ON features;
DROP POLICY IF EXISTS "features_public_read" ON features;
DROP POLICY IF EXISTS "layanan_admin_all" ON layanan;
DROP POLICY IF EXISTS "layanan_public_read" ON layanan;
DROP POLICY IF EXISTS "site_config_admin_all" ON site_config;
DROP POLICY IF EXISTS "site_config_public_read" ON site_config;
DROP POLICY IF EXISTS "tahapan_admin_all" ON tahapan;
DROP POLICY IF EXISTS "tahapan_public_read" ON tahapan;

-- ────────────────────────────────────────────────────────────
-- 2. RE-CREATE POLICIES — exactly 4 per table
--    :read combines authenticated + public access via OR
-- ────────────────────────────────────────────────────────────

-- profiles (role-based: super_admin can CRUD all, users can read/update own)
CREATE POLICY "profiles:read"   ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "profiles:create" ON profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'));
CREATE POLICY "profiles:update" ON profiles FOR UPDATE USING (auth.role() = 'authenticated' AND (id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')));
CREATE POLICY "profiles:delete" ON profiles FOR DELETE USING (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'));

-- wbp (authenticated CRUD + public can search via tracking code)
CREATE POLICY "wbp:read"   ON wbp FOR SELECT USING (auth.role() = 'authenticated' OR kode_tracking IS NOT NULL);
CREATE POLICY "wbp:create" ON wbp FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "wbp:update" ON wbp FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "wbp:delete" ON wbp FOR DELETE USING (auth.role() = 'authenticated');

-- riwayat_status (authenticated CRUD + public can view via tracking)
CREATE POLICY "riwayat_status:read"   ON riwayat_status FOR SELECT USING (auth.role() = 'authenticated' OR wbp_id IN (SELECT id FROM wbp WHERE kode_tracking IS NOT NULL));
CREATE POLICY "riwayat_status:create" ON riwayat_status FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "riwayat_status:update" ON riwayat_status FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "riwayat_status:delete" ON riwayat_status FOR DELETE USING (auth.role() = 'authenticated');

-- log_notifikasi (authenticated only)
CREATE POLICY "log_notifikasi:read"   ON log_notifikasi FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "log_notifikasi:create" ON log_notifikasi FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "log_notifikasi:update" ON log_notifikasi FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "log_notifikasi:delete" ON log_notifikasi FOR DELETE USING (auth.role() = 'authenticated');

-- site_config (authenticated CRUD + public read)
CREATE POLICY "site_config:read"   ON site_config FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "site_config:create" ON site_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "site_config:update" ON site_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "site_config:delete" ON site_config FOR DELETE USING (auth.role() = 'authenticated');

-- docs (authenticated CRUD + public read)
CREATE POLICY "docs:read"   ON docs FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "docs:create" ON docs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "docs:update" ON docs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "docs:delete" ON docs FOR DELETE USING (auth.role() = 'authenticated');

-- changelog (authenticated CRUD + public read)
CREATE POLICY "changelog:read"   ON changelog FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "changelog:create" ON changelog FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "changelog:update" ON changelog FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "changelog:delete" ON changelog FOR DELETE USING (auth.role() = 'authenticated');

-- layanan (authenticated CRUD + public read)
CREATE POLICY "layanan:read"   ON layanan FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "layanan:create" ON layanan FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "layanan:update" ON layanan FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "layanan:delete" ON layanan FOR DELETE USING (auth.role() = 'authenticated');

-- tahapan (authenticated CRUD + public read)
CREATE POLICY "tahapan:read"   ON tahapan FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "tahapan:create" ON tahapan FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tahapan:update" ON tahapan FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "tahapan:delete" ON tahapan FOR DELETE USING (auth.role() = 'authenticated');

-- features (authenticated CRUD + public read)
CREATE POLICY "features:read"   ON features FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "features:create" ON features FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "features:update" ON features FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "features:delete" ON features FOR DELETE USING (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────
-- 3. STORAGE: qrcodes bucket (public read + authenticated CUD)
-- ────────────────────────────────────────────────────────────

CREATE POLICY "qrcodes:read"   ON storage.objects FOR SELECT USING (bucket_id = 'qrcodes');
CREATE POLICY "qrcodes:create" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qrcodes' AND auth.role() = 'authenticated');
CREATE POLICY "qrcodes:update" ON storage.objects FOR UPDATE USING (bucket_id = 'qrcodes' AND auth.role() = 'authenticated');
CREATE POLICY "qrcodes:delete" ON storage.objects FOR DELETE USING (bucket_id = 'qrcodes' AND auth.role() = 'authenticated');
