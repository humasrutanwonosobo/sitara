/**
 * Sanitasi data Warga Binaan agar konsisten:
 * - Nama: Title Case (setiap kata huruf pertama kapital)
 * - Nomor Registrasi: UPPERCASE
 * - Tempat Lahir: Title Case
 * - Perkara: Capitalize first letter (kalimat)
 * - Alamat: Capitalize first letter per kalimat
 * - Nama Kontak Keluarga: Title Case
 * - Nomor HP: trim whitespace, hapus spasi/dash
 * - Catatan: trim
 */

/** Capitalize setiap kata: "budi santoso" → "Budi Santoso" */
function toTitleCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s|[-/])\S/g, (match) => match.toUpperCase());
}

/** Capitalize huruf pertama kalimat: "pencurian dengan kekerasan" → "Pencurian dengan kekerasan" */
function toSentenceCase(str: string): string {
  const trimmed = str.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/** Normalize nomor HP: hapus semua non-digit, konversi ke format 628xxx */
function normalizePhone(str: string): string {
  // Hapus semua karakter non-digit kecuali + di awal
  let cleaned = str.trim();
  
  // Hapus semua non-digit
  cleaned = cleaned.replace(/\D/g, "");
  
  // Handle berbagai format:
  // +62823... → 62823...  (+ sudah dihapus di atas)
  // 0823...  → 628823... (perlu ganti 0 → 62)
  // 62823... → 62823...  (sudah benar)
  // 823...   → 62823...  (tanpa prefix)
  // 628230823... → terlalu panjang, kemungkinan salah input
  
  if (cleaned.startsWith("620")) {
    // Case: user ketik +620823 atau 620823 (62 + leading 0)
    cleaned = "62" + cleaned.slice(3);
  } else if (cleaned.startsWith("62")) {
    // Sudah format internasional, biarkan
  } else if (cleaned.startsWith("0")) {
    // Format lokal: 0823 → 62823
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    // Tanpa prefix: 823 → 62823
    cleaned = "62" + cleaned;
  }
  
  return cleaned;
}

export function sanitizeWbpData<T extends Record<string, unknown>>(data: T): T {
  const result: Record<string, unknown> = { ...data };

  if (typeof result.nama === "string" && result.nama) {
    result.nama = toTitleCase(result.nama as string);
  }

  if (typeof result.nomorRegistrasi === "string" && result.nomorRegistrasi) {
    result.nomorRegistrasi = (result.nomorRegistrasi as string).trim().toUpperCase();
  }

  if (typeof result.tempatLahir === "string" && result.tempatLahir) {
    result.tempatLahir = toTitleCase(result.tempatLahir as string);
  }

  if (typeof result.perkara === "string" && result.perkara) {
    result.perkara = toSentenceCase(result.perkara as string);
  }

  if (typeof result.alamat === "string" && result.alamat) {
    // Capitalize setiap awal kalimat (setelah titik/koma) dan trim
    result.alamat = (result.alamat as string)
      .trim()
      .replace(/\s+/g, " ")
      .replace(/(^|[.]\s*)([a-z])/g, (_, prefix, char) => prefix + char.toUpperCase());
    // Pastikan huruf pertama kapital
    const alamat = result.alamat as string;
    result.alamat = alamat.charAt(0).toUpperCase() + alamat.slice(1);
  }

  if (typeof result.namaKontakKeluarga === "string" && result.namaKontakKeluarga) {
    result.namaKontakKeluarga = toTitleCase(result.namaKontakKeluarga as string);
  }

  if (typeof result.nomorHpKeluarga === "string" && result.nomorHpKeluarga) {
    result.nomorHpKeluarga = normalizePhone(result.nomorHpKeluarga as string);
  }

  if (typeof result.catatan === "string") {
    result.catatan = (result.catatan as string).trim();
  }

  return result as T;
}
