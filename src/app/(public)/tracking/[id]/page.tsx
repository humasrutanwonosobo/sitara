import type { Metadata } from "next";
import { getWbpByKodeTracking } from "@/lib/db/queries";
import TrackingDetailContent from "@/components/tracking/TrackingDetailContent";

type Props = {
  params: Promise<{ id: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sitara.web.id";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kode = id?.toUpperCase() ?? "";

  if (!kode) return { title: "Detail Tracking", robots: { index: false, follow: false } };

  const wbp = await getWbpByKodeTracking(kode);

  if (!wbp) return { title: "Detail Tracking", robots: { index: false, follow: false } };

  return {
    title: `Tracking ${wbp.nama}`,
    description: `Pantau status proses reintegrasi ${wbp.nama} (Kode: ${wbp.kodeTracking}). Lihat tahapan terkini secara real-time di SITARA.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `Tracking Reintegrasi — ${wbp.nama}`,
      description: `Status proses reintegrasi ${wbp.nama} secara real-time. Platform resmi Rutan Wonosobo.`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const kode = id?.toUpperCase() ?? "";
  const wbp = await getWbpByKodeTracking(kode);

  const breadcrumbJsonLd = wbp
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tracking", item: `${SITE_URL}/tracking` },
          { "@type": "ListItem", position: 3, name: wbp.nama, item: `${SITE_URL}/tracking/${kode}` },
        ],
      }
    : null;

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <TrackingDetailContent />
    </>
  );
}
