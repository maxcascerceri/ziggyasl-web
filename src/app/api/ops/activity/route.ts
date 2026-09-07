import { NextResponse } from "next/server";
import { listActivity } from "@/lib/ops/store";

export async function GET() {
  const activity = await listActivity();
  return NextResponse.json({ activity });
}
