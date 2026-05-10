export interface WAPayload {
  target: string;
  message: string;
}

export interface WAResponse {
  status: boolean;
  detail?: string;
  reason?: string;
}

export async function kirimWhatsApp(payload: WAPayload): Promise<WAResponse> {
  const token = process.env["FONNTE_TOKEN"];
  if (!token) {
    return { status: false, reason: "FONNTE_TOKEN tidak dikonfigurasi" };
  }

  const nomor = payload.target.replace(/^0/, "62").replace(/\D/g, "");

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: nomor,
        message: payload.message,
        countryCode: "62",
      }),
    });

    return (await response.json()) as WAResponse;
  } catch (err) {
    return { status: false, reason: String(err) };
  }
}

const JENIS_LAYANAN_LABEL: Record<string, string> = {
  PB: "Pembebasan Bersyarat",
  CB: "Cuti Bersyarat",
  CMB: "Cuti Menjelang Bebas",
};

const TAHAP_LABEL: Record<string, string> = {
  verifikasi_rutan: "Verifikasi Berkas di Rutan/Lapas",
  upload_sdp: "Upload ke SDP",
  verifikasi_kanwil: "Verifikasi Kanwil",
  proses_ditjen_pas: "Proses di Ditjen PAS",
  sk_terbit: "SK Terbit",
};

export function buatPesan(
  namaWargaBinaan: string,
  jenisLayanan: string,
  tahap: string,
  trackingUrl: string
): string {
  return `*SITARA - Update Status Reintegrasi*

Assalamu'alaikum wr. wb.

Status proses reintegrasi atas nama *${namaWargaBinaan}* telah diperbarui.

Jenis Layanan: ${JENIS_LAYANAN_LABEL[jenisLayanan] ?? jenisLayanan}
Tahap Terbaru: ${TAHAP_LABEL[tahap] ?? tahap}

Pantau status lengkap melalui tautan berikut:
${trackingUrl}

Terima kasih atas kepercayaan Anda.

_Sistem Informasi Tracking Reintegrasi Warga Binaan (SITARA)_`;
}
