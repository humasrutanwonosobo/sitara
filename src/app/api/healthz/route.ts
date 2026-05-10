import { NextResponse } from "next/server";
import { HealthCheckResponse } from "@/lib/api-zod";

export async function GET() {
  const data = HealthCheckResponse.parse({ status: "ok" });
  return NextResponse.json(data);
}
