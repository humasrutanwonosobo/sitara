-- ============================================================
-- SITARA: RLS Policies, Storage Bucket, Triggers & Functions
-- Run this against the Supabase project database
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ────────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbp ENABLE ROW LEVEL SECURITY;
ALTER TABLE riwayat_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE tahapan ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 2. RLS POLICIES — exactly 4 per table (CRUD)
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
-- 3. STORAGE BUCKET: qrcodes
-- ────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('qrcodes', 'qrcodes', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage.objects in qrcodes bucket (4 authenticated CRUD + 1 public read)
CREATE POLICY "qrcodes:read"        ON storage.objects FOR SELECT USING (bucket_id = 'qrcodes');
CREATE POLICY "qrcodes:create"      ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qrcodes' AND auth.role() = 'authenticated');
CREATE POLICY "qrcodes:update"      ON storage.objects FOR UPDATE USING (bucket_id = 'qrcodes' AND auth.role() = 'authenticated');
CREATE POLICY "qrcodes:delete"      ON storage.objects FOR DELETE USING (bucket_id = 'qrcodes' AND auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────
-- 4. TRIGGERS & FUNCTIONS
-- ────────────────────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON wbp FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON docs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON layanan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tahapan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON features FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-insert riwayat when tahap changes on WBP
CREATE OR REPLACE FUNCTION log_tahap_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.tahap_saat_ini IS DISTINCT FROM NEW.tahap_saat_ini THEN
    INSERT INTO riwayat_status (wbp_id, tahap, keterangan)
    VALUES (NEW.id, NEW.tahap_saat_ini, 'Tahap diubah ke ' || NEW.tahap_saat_ini);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_tahap_change AFTER UPDATE ON wbp FOR EACH ROW EXECUTE FUNCTION log_tahap_change();

-- Auto-generate kode_tracking on WBP insert
CREATE OR REPLACE FUNCTION generate_kode_tracking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.kode_tracking IS NULL THEN
    NEW.kode_tracking := 'SITARA-' ||
      CASE WHEN NEW.jenis_layanan = 'ASIMILASI' THEN 'AS' ELSE NEW.jenis_layanan END ||
      '-' || upper(substring(md5(random()::text) from 1 for 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_kode_tracking BEFORE INSERT ON wbp FOR EACH ROW EXECUTE FUNCTION generate_kode_tracking();
