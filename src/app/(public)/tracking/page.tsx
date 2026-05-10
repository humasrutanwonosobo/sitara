import type { Metadata } from "next";
import TrackingPage from "@/components/tracking/TrackingContent";

export const metadata: Metadata = {
  title: "Cek Status Tracking Reintegrasi",
  description:
    "Masukkan kode tracking SITARA untuk memantau status proses reintegrasi Warga Binaan Pemasyarakatan secara real-time.",
  openGraph: {
    title: "Cek Status Tracking — SITARA",
    description:
      "Lacak proses reintegrasi Warga Binaan dengan kode tracking. Informasi tahapan terkini langsung dari sistem.",
  },
};

export default function Page() {
  return <TrackingPage />;
}
