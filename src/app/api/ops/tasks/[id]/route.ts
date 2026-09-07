import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import { deleteTask, listTasks, upsertTask } from "@/lib/ops/store";
import { statusLabel } from "@/lib/ops/format";
import type { Task } from "@/lib/ops/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = (await listTasks()).find((t) => t.id === id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as Record<string, unknown>;
  const patch: Partial<Task> & { id: string } = { id };
  for (const key of ["title", "status", "assignee", "dueAt"] as const) {
    if (key in body) (patch as Record<string, unknown>)[key] = body[key];
  }
  let summary = `${actor} edited “${existing.title}”`;
  if (patch.status && patch.status !== existing.status) {
    summary =
      patch.status === "completed"
        ? `${actor} completed ${existing.title}`
        : `${actor} set ${existing.title} to ${statusLabel[patch.status]}`;
  }
  const task = await upsertTask(actor, patch, summary);
  return NextResponse.json({ task });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const existing = (await listTasks()).find((t) => t.id === id);
  await deleteTask(actor, id, `${actor} deleted “${existing?.title ?? "a task"}”`);
  return NextResponse.json({ ok: true });
}
