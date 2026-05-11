import type { wbpTable } from "@/lib/db";

/**
 * Generate kode tracking unik berdasarkan jenis layanan.
 * Format: SITARA-{KODE}-{8 random alphanumeric}
 */
export function generateKodeTracking(jenisLayanan: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const kode = jenisLayanan === "ASIMILASI" ? "AS" : jenisLayanan;
  return `SITARA-${kode}-${random}`;
}

/**
 * Map Warga Binaan database row ke response shape yang konsisten.
 */
export function mapWbp(w: typeof wbpTable.$inferSelect) {
  return {
    id: w.id,
    kodeTracking: w.kodeTracking,
    nama: w.nama,
    nomorRegistrasi: w.nomorRegistrasi,
    jenisKelamin: w.jenisKelamin,
    tempatLahir: w.tempatLahir,
    tanggalLahir: w.tanggalLahir,
    nomorHpKeluarga: w.nomorHpKeluarga,
    namaKontakKeluarga: w.namaKontakKeluarga,
    perkara: w.perkara,
    alamat: w.alamat,
    tanggalPelaksanaan: w.tanggalPelaksanaan,
    jenisLayanan: w.jenisLayanan,
    tahapSaatIni: w.tahapSaatIni,
    status: w.status,
    catatan: w.catatan,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  };
}
