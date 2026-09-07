import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import { deleteExpense, listExpenses, upsertExpense } from "@/lib/ops/store";
import { usd } from "@/lib/ops/format";
import type { Expense } from "@/lib/ops/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = (await listExpenses()).find((e) => e.id === id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as Record<string, unknown>;
  const patch: Partial<Expense> & { id: string } = { id };
  for (const key of ["name", "amount", "cadence", "category", "note", "active"] as const) {
    if (key in body) (patch as Record<string, unknown>)[key] = body[key];
  }
  let summary = `${actor} edited ${existing.name}`;
  if (patch.amount !== undefined && patch.amount !== existing.amount) {
    summary = `${actor} changed ${existing.name} ${usd(existing.amount)} → ${usd(Number(patch.amount))}`;
  }
  const expense = await upsertExpense(actor, patch, summary);
  return NextResponse.json({ expense });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = (await listExpenses()).find((e) => e.id === id);
  await deleteExpense(actor, id, `${actor} deleted ${existing?.name ?? "an expense"}`);
  return NextResponse.json({ ok: true });
}
