import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";
import { FEATURES_DATA, LAYANAN_DATA, SITE_CONFIG, TAHAPAN_DATA } from "@/lib/static";

export const dynamic = "force-static";

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
  const layanan = LAYANAN_DATA.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const tahapan = TAHAPAN_DATA.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const keunggulan = FEATURES_DATA.filter((item) => item.isActive && item.section === "keunggulan").sort((a, b) => a.sortOrder - b.sortOrder);
  const howTo = FEATURES_DATA.filter((item) => item.isActive && item.section === "how_to").sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <HomeContent
      layanan={layanan}
      tahapan={tahapan}
      keunggulan={keunggulan}
      howTo={howTo}
      siteConfig={SITE_CONFIG}
    />
  );
}
