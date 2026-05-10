import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "SITARA — Pantau Status Reintegrasi Warga Binaan Secara Real-time",
  description:
    "Cek proses Pembebasan Bersyarat, Cuti Bersyarat, Cuti Menjelang Bebas, dan Asimilasi secara langsung tanpa perlu ke kantor. Platform resmi Rutan Wonosobo.",
  openGraph: {
    title: "SITARA — Pantau Status Reintegrasi Warga Binaan",
    description:
      "Platform resmi pelacakan proses reintegrasi narapidana. Cek status PB, CB, CMB, dan Asimilasi secara real-time.",
  },
};

export default function Page() {
  return <HomeContent />;
}
