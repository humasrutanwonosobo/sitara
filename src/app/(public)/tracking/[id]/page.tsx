import type { Metadata } from "next";
import { getWbpByKodeTracking } from "@/lib/db/queries";
import TrackingDetailContent from "@/components/tracking/TrackingDetailContent";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kode = id?.toUpperCase() ?? "";

  if (!kode) return { title: "Detail Tracking" };

  const wbp = await getWbpByKodeTracking(kode);

  if (!wbp) return { title: "Detail Tracking" };

  return {
    title: `Detail Tracking — ${wbp.nama}`,
  };
}

export default function Page() {
  return <TrackingDetailContent />;
}
