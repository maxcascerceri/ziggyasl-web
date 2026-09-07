import { NextResponse } from "next/server";
import { getRevenueOverview } from "@/lib/ops/revenuecat";

export async function GET() {
  const overview = await getRevenueOverview();
  return NextResponse.json(overview);
}
