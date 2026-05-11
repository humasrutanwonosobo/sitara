import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sitara.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080c14",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SITARA — Sistem Informasi Tracking Reintegrasi Narapidana",
    template: "%s | SITARA",
  },
  description:
    "Platform resmi Rumah Tahanan Negara Wonosobo untuk memantau proses reintegrasi Warga Binaan Pemasyarakatan. Cek status Pembebasan Bersyarat, Cuti Bersyarat, Cuti Menjelang Bebas, dan Asimilasi secara real-time.",
  keywords: [
    "SITARA",
    "tracking reintegrasi",
    "narapidana",
    "warga binaan",
    "pembebasan bersyarat",
    "cuti bersyarat",
    "cuti menjelang bebas",
    "asimilasi",
    "rutan wonosobo",
    "pemasyarakatan",
    "kemenimipas",
    "ditjen pas",
    "status warga binaan",
    "tracking warga binaan",
  ],
  authors: [{ name: "Eliyanto Sarage" }],
  creator: "Eliyanto Sarage",
  publisher: "Rumah Tahanan Negara Wonosobo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "SITARA",
    title: "SITARA — Sistem Informasi Tracking Reintegrasi Narapidana",
    description:
      "Platform resmi untuk memantau proses reintegrasi Warga Binaan Pemasyarakatan di Rutan Wonosobo. Cek status PB, CB, CMB, dan Asimilasi secara real-time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SITARA — Tracking Reintegrasi Narapidana",
    description:
      "Pantau status reintegrasi Warga Binaan secara real-time. Platform resmi Rutan Wonosobo.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "Government",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: "SITARA — Sistem Informasi Tracking Reintegrasi Narapidana",
    description:
      "Platform resmi pelacakan proses reintegrasi Warga Binaan Pemasyarakatan di Rumah Tahanan Negara Wonosobo.",
    url: SITE_URL,
    provider: {
      "@type": "GovernmentOrganization",
      name: "Rumah Tahanan Negara Kelas IIB Wonosobo",
      parentOrganization: {
        "@type": "GovernmentOrganization",
        name: "Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Wonosobo",
        addressRegion: "Jawa Tengah",
        addressCountry: "ID",
      },
    },
    serviceType: "Tracking Reintegrasi Narapidana",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Wonosobo, Jawa Tengah, Indonesia",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: SITE_URL,
      availableLanguage: { "@type": "Language", name: "Indonesian" },
    },
  };

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
