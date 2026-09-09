import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import {
  deleteCreator,
  findCreatorByLink,
  getCreator,
  upsertCreator,
} from "@/lib/ops/store";
import { usd } from "@/lib/ops/format";
import type { Creator } from "@/lib/ops/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const creator = await getCreator(id);
  if (!creator) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ creator });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = await getCreator(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as Record<string, unknown>;

  if (body.outreach === true) {
    const creator = await upsertCreator(
      actor,
      { id, reachedOut: true },
      `Reached out ${existing.name}`,
    );
    return NextResponse.json({ creator });
  }

  const link =
    body.link !== undefined ? String(body.link).trim() : existing.link;
  if (link) {
    const dup = await findCreatorByLink(link, id);
    if (dup) {
      return NextResponse.json(
        { error: "That link is already on the list." },
        { status: 409 },
      );
    }
  }

  const patch: Partial<Creator> & { id: string } = { id };
  for (const key of [
    "name",
    "link",
    "reachedOut",
    "active",
    "dealAmount",
    "videos",
    "posted",
    "paid",
    "note",
  ] as const) {
    if (key in body) (patch as Record<string, unknown>)[key] = body[key];
  }
  if (body.link !== undefined) patch.link = link;

  const creator = await upsertCreator(actor, patch, summaryFor(existing, patch));
  return NextResponse.json({ creator });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = await getCreator(id);
  await deleteCreator(actor, id, `${existing?.name ?? "Creator"} deleted`);
  return NextResponse.json({ ok: true });
}

function summaryFor(existing: Creator, patch: Partial<Creator>): string {
  const who = existing.name || "Creator";
  if (patch.reachedOut && !existing.reachedOut) return `Reached out ${who}`;
  if (patch.active && !existing.active) return `${who} is active`;
  if (patch.paid && !existing.paid) return `Paid ${who}`;
  if (patch.dealAmount !== undefined && patch.dealAmount !== existing.dealAmount) {
    return `${who} deal ${usd(Number(patch.dealAmount))}`;
  }
  if (patch.posted !== undefined && patch.posted !== existing.posted) {
    return `${who} posted ${patch.posted}/${patch.videos ?? existing.videos}`;
  }
  return `Edited ${who}`;
}
