import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import { findCreatorByLink, listCreators, upsertCreator } from "@/lib/ops/store";

export async function GET() {
  const creators = await listCreators();
  creators.sort((a, b) => {
    if (a.reachedOut !== b.reachedOut) return a.reachedOut ? 1 : -1;
    if (a.active !== b.active) return a.active ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return NextResponse.json({ creators });
}

export async function POST(req: Request) {
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const body = (await req.json()) as Record<string, unknown>;
  const link = String(body.link ?? "").trim();
  if (link) {
    const dup = await findCreatorByLink(link);
    if (dup) {
      return NextResponse.json(
        { error: "That link is already on the list." },
        { status: 409 },
      );
    }
  }
  const name = String(body.name ?? "").trim();
  const creator = await upsertCreator(
    actor,
    {
      name,
      link,
      reachedOut: body.reachedOut === true,
      active: body.active === true,
      dealAmount: Number(body.dealAmount ?? 0),
      videos: Number(body.videos ?? 0),
      posted: Number(body.posted ?? 0),
      paid: body.paid === true,
      note: String(body.note ?? ""),
    },
    `${name || "Creator"} added`,
  );
  return NextResponse.json({ creator });
}
