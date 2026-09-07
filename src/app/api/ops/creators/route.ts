import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import { findCreatorByHandle, listCreators, upsertCreator } from "@/lib/ops/store";

export async function GET() {
  const creators = await listCreators();
  creators.sort((a, b) => {
    const af = a.nextFollowUp ?? "9999";
    const bf = b.nextFollowUp ?? "9999";
    if (af !== bf) return af.localeCompare(bf);
    return a.name.localeCompare(b.name);
  });
  return NextResponse.json({ creators });
}

export async function POST(req: Request) {
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const body = (await req.json()) as Record<string, unknown>;
  const handle = String(body.handle ?? "").replace(/^@/, "");
  if (handle) {
    const dup = await findCreatorByHandle(handle);
    if (dup) {
      return NextResponse.json(
        { error: `Handle @${handle} is already on the list.` },
        { status: 409 },
      );
    }
  }
  const creator = await upsertCreator(
    actor,
    {
      name: String(body.name ?? ""),
      handle,
      platform: body.platform as never,
      targetRate: Number(body.targetRate ?? 0),
      quotedRate: Number(body.quotedRate ?? 0),
      dealTotal: Number(body.dealTotal ?? 0),
      postsExpected: Number(body.postsExpected ?? 0),
      postsDelivered: Number(body.postsDelivered ?? 0),
      payment: (body.payment as never) ?? "n/a",
      owner: (body.owner as never) ?? "Bernie",
      lastContact: (body.lastContact as string | null) ?? null,
      nextFollowUp: (body.nextFollowUp as string | null) ?? null,
      notes: String(body.notes ?? ""),
      stage: (body.stage as never) ?? "wishlist",
    },
    `${actor} added @${handle || String(body.name ?? "creator")}`,
  );
  return NextResponse.json({ creator });
}
