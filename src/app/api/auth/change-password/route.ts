import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Password lama dan baru wajib diisi" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
    }

    // Verify current password by re-authenticating
    const supabase = await createClient();
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: session.email,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json({ error: "Password lama tidak sesuai" }, { status: 401 });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      return NextResponse.json({ error: "Gagal mengubah password" }, { status: 500 });
    }

    return NextResponse.json({ message: "Password berhasil diubah" });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
