export const JENIS_LAYANAN_LABELS: Record<string, string> = {
  PB: "Pembebasan Bersyarat",
  CB: "Cuti Bersyarat",
  CMB: "Cuti Menjelang Bebas",
  ASIMILASI: "Asimilasi",
};

export const TAHAP_LABELS: Record<string, string> = {
  verifikasi_rutan: "Verifikasi Berkas di Rutan/Lapas",
  pengusulan_litmas: "Pengusulan Litmas",
  sidang_tpp_upt: "Sidang TPP UPT",
  upload_sdp: "Pengusulan Berkas Melalui SDP",
  verifikasi_kanwil: "Verifikasi Kanwil",
  proses_ditjen_pas: "Verifikasi Ditjen PAS",
  sk_terbit: "Proses Penerbitan SK oleh Ditjen PAS",
  turun_sk: "Turun SK",
};

export const STATUS_LABELS: Record<string, string> = {
  aktif: "Aktif",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export const TAHAP_ORDER = [
  "verifikasi_rutan",
  "pengusulan_litmas",
  "sidang_tpp_upt",
  "upload_sdp",
  "verifikasi_kanwil",
  "proses_ditjen_pas",
  "sk_terbit",
  "turun_sk",
];
