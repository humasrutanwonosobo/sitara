-- ============================================================
-- SITARA: Add app_role enum, rename admin_users → profiles,
-- enhance columns, update RLS for role-based access
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CREATE app_role ENUM
-- ────────────────────────────────────────────────────────────

CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'operator');

-- ────────────────────────────────────────────────────────────
-- 2. RENAME admin_users → profiles & enhance columns
-- ────────────────────────────────────────────────────────────

ALTER TABLE admin_users RENAME TO profiles;

-- Change id from serial to uuid (matches auth.users.id)
ALTER TABLE profiles DROP CONSTRAINT admin_users_pkey;
ALTER TABLE profiles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN id TYPE uuid USING id::text::uuid;
ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- Add new columns
ALTER TABLE profiles ADD COLUMN role app_role NOT NULL DEFAULT 'admin';
ALTER TABLE profiles ADD COLUMN avatar_url text;
ALTER TABLE profiles ADD COLUMN phone varchar(30);
ALTER TABLE profiles ADD COLUMN nip varchar(30);
ALTER TABLE profiles ADD COLUMN jabatan varchar(100);
ALTER TABLE profiles ADD COLUMN is_active boolean NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

-- Remove password_hash (auth handled by Supabase Auth)
ALTER TABLE profiles DROP COLUMN password_hash;

-- Rename unique constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS admin_users_email_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);

-- ────────────────────────────────────────────────────────────
-- 3. DROP OLD RLS POLICIES (admin_users)
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated read admin_users" ON profiles;
DROP POLICY IF EXISTS "Authenticated insert admin_users" ON profiles;
DROP POLICY IF EXISTS "Authenticated update admin_users" ON profiles;
DROP POLICY IF EXISTS "Authenticated delete admin_users" ON profiles;
DROP POLICY IF EXISTS "admin_users:read" ON profiles;
DROP POLICY IF EXISTS "admin_users:create" ON profiles;
DROP POLICY IF EXISTS "admin_users:update" ON profiles;
DROP POLICY IF EXISTS "admin_users:delete" ON profiles;

-- ────────────────────────────────────────────────────────────
-- 4. CREATE NEW RLS POLICIES FOR profiles (role-based)
-- ────────────────────────────────────────────────────────────

-- profiles: super_admin can CRUD all, admin/operator can read/update own profile
CREATE POLICY "profiles:read" ON profiles FOR SELECT USING (
  auth.role() = 'authenticated'
);
CREATE POLICY "profiles:create" ON profiles FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);
CREATE POLICY "profiles:update" ON profiles FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND (
    id = auth.uid()  -- users can update own profile
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  )
);
CREATE POLICY "profiles:delete" ON profiles FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);

-- ────────────────────────────────────────────────────────────
-- 5. UPDATE ALL OTHER TABLE RLS POLICIES (role-based)
-- ────────────────────────────────────────────────────────────

-- Helper: authenticated user with role check
-- super_admin + admin: full CRUD on all data
-- operator: read + limited write (can manage WBP, not konten/settings)

-- wbp
DROP POLICY IF EXISTS "wbp:read" ON wbp;
DROP POLICY IF EXISTS "wbp:create" ON wbp;
DROP POLICY IF EXISTS "wbp:update" ON wbp;
DROP POLICY IF EXISTS "wbp:delete" ON wbp;
CREATE POLICY "wbp:read" ON wbp FOR SELECT USING (
  auth.role() = 'authenticated' OR kode_tracking IS NOT NULL
);
CREATE POLICY "wbp:create" ON wbp FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "wbp:update" ON wbp FOR UPDATE USING (
  auth.role() = 'authenticated'
);
CREATE POLICY "wbp:delete" ON wbp FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- riwayat_status
DROP POLICY IF EXISTS "riwayat_status:read" ON riwayat_status;
DROP POLICY IF EXISTS "riwayat_status:create" ON riwayat_status;
DROP POLICY IF EXISTS "riwayat_status:update" ON riwayat_status;
DROP POLICY IF EXISTS "riwayat_status:delete" ON riwayat_status;
CREATE POLICY "riwayat_status:read" ON riwayat_status FOR SELECT USING (
  auth.role() = 'authenticated' OR wbp_id IN (SELECT id FROM wbp WHERE kode_tracking IS NOT NULL)
);
CREATE POLICY "riwayat_status:create" ON riwayat_status FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "riwayat_status:update" ON riwayat_status FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "riwayat_status:delete" ON riwayat_status FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- log_notifikasi
DROP POLICY IF EXISTS "log_notifikasi:read" ON log_notifikasi;
DROP POLICY IF EXISTS "log_notifikasi:create" ON log_notifikasi;
DROP POLICY IF EXISTS "log_notifikasi:update" ON log_notifikasi;
DROP POLICY IF EXISTS "log_notifikasi:delete" ON log_notifikasi;
CREATE POLICY "log_notifikasi:read" ON log_notifikasi FOR SELECT USING (
  auth.role() = 'authenticated'
);
CREATE POLICY "log_notifikasi:create" ON log_notifikasi FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "log_notifikasi:update" ON log_notifikasi FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "log_notifikasi:delete" ON log_notifikasi FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- site_config (only super_admin + admin can CUD)
DROP POLICY IF EXISTS "site_config:read" ON site_config;
DROP POLICY IF EXISTS "site_config:create" ON site_config;
DROP POLICY IF EXISTS "site_config:update" ON site_config;
DROP POLICY IF EXISTS "site_config:delete" ON site_config;
CREATE POLICY "site_config:read" ON site_config FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "site_config:create" ON site_config FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "site_config:update" ON site_config FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "site_config:delete" ON site_config FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- docs (only super_admin + admin can CUD)
DROP POLICY IF EXISTS "docs:read" ON docs;
DROP POLICY IF EXISTS "docs:create" ON docs;
DROP POLICY IF EXISTS "docs:update" ON docs;
DROP POLICY IF EXISTS "docs:delete" ON docs;
CREATE POLICY "docs:read" ON docs FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "docs:create" ON docs FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "docs:update" ON docs FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "docs:delete" ON docs FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- changelog (only super_admin + admin can CUD)
DROP POLICY IF EXISTS "changelog:read" ON changelog;
DROP POLICY IF EXISTS "changelog:create" ON changelog;
DROP POLICY IF EXISTS "changelog:update" ON changelog;
DROP POLICY IF EXISTS "changelog:delete" ON changelog;
CREATE POLICY "changelog:read" ON changelog FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "changelog:create" ON changelog FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "changelog:update" ON changelog FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "changelog:delete" ON changelog FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- layanan (only super_admin + admin can CUD)
DROP POLICY IF EXISTS "layanan:read" ON layanan;
DROP POLICY IF EXISTS "layanan:create" ON layanan;
DROP POLICY IF EXISTS "layanan:update" ON layanan;
DROP POLICY IF EXISTS "layanan:delete" ON layanan;
CREATE POLICY "layanan:read" ON layanan FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "layanan:create" ON layanan FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "layanan:update" ON layanan FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "layanan:delete" ON layanan FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- tahapan (only super_admin + admin can CUD)
DROP POLICY IF EXISTS "tahapan:read" ON tahapan;
DROP POLICY IF EXISTS "tahapan:create" ON tahapan;
DROP POLICY IF EXISTS "tahapan:update" ON tahapan;
DROP POLICY IF EXISTS "tahapan:delete" ON tahapan;
CREATE POLICY "tahapan:read" ON tahapan FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "tahapan:create" ON tahapan FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "tahapan:update" ON tahapan FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "tahapan:delete" ON tahapan FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- features (only super_admin + admin can CUD)
DROP POLICY IF EXISTS "features:read" ON features;
DROP POLICY IF EXISTS "features:create" ON features;
DROP POLICY IF EXISTS "features:update" ON features;
DROP POLICY IF EXISTS "features:delete" ON features;
CREATE POLICY "features:read" ON features FOR SELECT USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "features:create" ON features FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "features:update" ON features FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "features:delete" ON features FOR DELETE USING (
  auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- ────────────────────────────────────────────────────────────
-- 6. ADD updated_at TRIGGER for profiles
-- ────────────────────────────────────────────────────────────

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────
-- 7. SEED: create profile for existing admin auth user
-- ────────────────────────────────────────────────────────────

INSERT INTO profiles (id, email, name, role, is_active)
SELECT id, email, raw_user_meta_data->>'name', 'super_admin', true
FROM auth.users
WHERE email = 'admin@sitara.go.id'
ON CONFLICT (id) DO NOTHING;
