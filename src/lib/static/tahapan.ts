export interface TahapanItem {
  id: string;
  num: string;
  title: string;
  sub: string;
  desc: string;
  sortOrder: number;
  isActive: boolean;
}

export const TAHAPAN_DATA: TahapanItem[] = [
  {
    id: "617f8423-8626-462f-89a3-6166e0dd620e",
    num: "01",
    title: "Verifikasi Berkas di Rutan/Lapas",
    sub: "Rutan / Lapas",
    desc: "Petugas memeriksa kelengkapan dan keabsahan dokumen persyaratan Warga Binaan.",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "7019fe18-7079-4f7a-8cb3-41f2581bc25d",
    num: "02",
    title: "Pengusulan Litmas",
    sub: "Pembimbing Kemasyarakatan",
    desc: "Permohonan litmas diajukan untuk menjadi dasar pertimbangan reintegrasi.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "771e9927-3da3-4e17-8891-d78cc74047c9",
    num: "03",
    title: "Sidang TPP UPT",
    sub: "Tim Pengamat Pemasyarakatan",
    desc: "TPP UPT membahas hasil pemeriksaan dan kelayakan usulan Warga Binaan.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "02b59b06-2cc1-4ad4-88ad-1b09eb99e70c",
    num: "04",
    title: "Pengusulan Berkas Melalui SDP",
    sub: "Sistem Database",
    desc: "Berkas yang lolos sidang diunggah ke Sistem Database Pemasyarakatan.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "12a82ed2-cdbd-4587-bbf9-34cca6af049a",
    num: "05",
    title: "Verifikasi Kanwil",
    sub: "Kantor Wilayah",
    desc: "Kanwil memeriksa dan memvalidasi berkas secara digital.",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cbf26588-2c3a-43b0-a255-9bceb1a97af7",
    num: "06",
    title: "Verifikasi Ditjen PAS",
    sub: "Pusat Jakarta",
    desc: "Direktorat Jenderal Pemasyarakatan meninjau dan memproses berkas.",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "044c798f-e4c1-488d-86c3-f86ad3579570",
    num: "07",
    title: "Proses Penerbitan SK oleh Ditjen PAS",
    sub: "Pusat Jakarta",
    desc: "SK diproses untuk diterbitkan sebagai dasar pelaksanaan reintegrasi.",
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "c7f8810d-2ab3-4ed0-bd92-264a8d476ec3",
    num: "08",
    title: "Turun SK",
    sub: "Selesai",
    desc: "Surat Keputusan diterbitkan dan Warga Binaan siap menjalani program reintegrasi.",
    sortOrder: 7,
    isActive: true,
  },
];
