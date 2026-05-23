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

  // Normalisasi nomor ke format 628xxx (tanpa +, tanpa spasi/dash)
  let nomor = payload.target.replace(/\D/g, "");
  if (nomor.startsWith("620")) {
    nomor = "62" + nomor.slice(3);
  } else if (nomor.startsWith("62")) {
    // sudah benar
  } else if (nomor.startsWith("0")) {
    nomor = "62" + nomor.slice(1);
  } else if (nomor.startsWith("8")) {
    nomor = "62" + nomor;
  }

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

    // Validasi HTTP status code
    if (!response.ok) {
      return {
        status: false,
        reason: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = (await response.json()) as WAResponse;

    // Validasi field detail untuk mendeteksi error dari Fonnte
    // Fonnte sering mengembalikan { status: true, detail: "invalid number" }
    if (data.detail) {
      const detailLower = data.detail.toLowerCase();
      // Deteksi berbagai jenis error dari Fonnte
      if (
        detailLower.includes("invalid") ||
        detailLower.includes("not found") ||
        detailLower.includes("failed") ||
        detailLower.includes("error") ||
        detailLower.includes("tidak valid") ||
        detailLower.includes("gagal")
      ) {
        return {
          status: false,
          reason: data.detail,
        };
      }
    }

    return data;
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
  trackingUrl: string,
  namaKontakKeluarga?: string
): string {
  // Format tanggal dalam Bahasa Indonesia
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();
  const formattedDate = `${dayName}, ${date} ${monthName} ${year}`;

  // Personalisasi sapaan
  const greeting = namaKontakKeluarga 
    ? `Yth. Bapak/Ibu *${namaKontakKeluarga}*`
    : 'Yth. Keluarga Warga Binaan';

  return `*SITARA - Update Status Reintegrasi*

Assalamu'alaikum wr. wb.

${greeting},

Dengan hormat kami sampaikan bahwa status proses reintegrasi atas nama *${namaWargaBinaan}* telah diperbarui pada *${formattedDate}*.

📋 *Detail Informasi:*
• Jenis Layanan: *${JENIS_LAYANAN_LABEL[jenisLayanan] ?? jenisLayanan}*
• Tahap Terbaru: *${TAHAP_LABEL[tahap] ?? tahap}*

🔗 *Pantau Status Lengkap:*
Klik tautan berikut untuk melihat detail proses:
${trackingUrl}

Terima kasih atas perhatian dan kepercayaan Anda.

Wassalamu'alaikum wr. wb.

_Sistem Informasi Tracking Reintegrasi Warga Binaan (SITARA)_
_Rumah Tahanan Negara Kelas IIB Wonosobo_`;
}
