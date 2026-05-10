import { NextResponse } from "next/server";

// Static data — CRUD no longer needed
export async function PUT() {
  return NextResponse.json({ error: "Data layanan bersifat statis" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Data layanan bersifat statis" }, { status: 405 });
}
