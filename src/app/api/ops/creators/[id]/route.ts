import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import {
  deleteCreator,
  findCreatorByHandle,
  getCreator,
  upsertCreator,
} from "@/lib/ops/store";
import { addDaysIso, paymentLabel, stageLabel, todayIso } from "@/lib/ops/format";
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
  const body = (await req.json()) as Record<string, unknown> & { outreach?: boolean };

  if (body.outreach) {
    const creator = await upsertCreator(
      actor,
      {
        id,
        lastContact: todayIso(),
        nextFollowUp: addDaysIso(3),
      },
      `${actor} logged outreach with @${existing.handle || existing.name}`,
    );
    return NextResponse.json({ creator });
  }

  const handle =
    body.handle !== undefined
      ? String(body.handle).replace(/^@/, "")
      : existing.handle;
  if (handle) {
    const dup = await findCreatorByHandle(handle, id);
    if (dup) {
      return NextResponse.json(
        { error: `Handle @${handle} is already on the list.` },
        { status: 409 },
      );
    }
  }

  const patch: Partial<Creator> & { id: string } = { id };
  for (const key of [
    "name",
    "handle",
    "platform",
    "targetRate",
    "quotedRate",
    "dealTotal",
    "postsExpected",
    "postsDelivered",
    "payment",
    "owner",
    "lastContact",
    "nextFollowUp",
    "notes",
    "stage",
  ] as const) {
    if (key in body) (patch as Record<string, unknown>)[key] = body[key];
  }
  if (body.handle !== undefined) patch.handle = handle;

  const summary = summaryFor(actor, existing, patch);
  const creator = await upsertCreator(actor, patch, summary);
  return NextResponse.json({ creator });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = await getCreator(id);
  await deleteCreator(
    actor,
    id,
    `${actor} deleted @${existing?.handle || existing?.name || "creator"}`,
  );
  return NextResponse.json({ ok: true });
}

function summaryFor(
  actor: string,
  existing: Creator,
  patch: Partial<Creator>,
): string {
  const who = `@${existing.handle || existing.name}`;
  if (patch.stage && patch.stage !== existing.stage) {
    return `${actor} moved ${who} to ${stageLabel[patch.stage]}`;
  }
  if (patch.payment && patch.payment !== existing.payment) {
    return `${actor} marked ${who} ${paymentLabel[patch.payment]}`;
  }
  if (
    patch.quotedRate !== undefined &&
    patch.quotedRate !== existing.quotedRate
  ) {
    return `${actor} changed ${who} quote to $${patch.quotedRate}`;
  }
  return `${actor} edited ${who}`;
}
