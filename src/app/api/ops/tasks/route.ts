import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import { listTasks, upsertTask } from "@/lib/ops/store";

export async function GET() {
  const tasks = await listTasks();
  tasks.sort((a, b) => {
    const order = { not_started: 1, working: 0, completed: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999");
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const body = (await req.json()) as Record<string, unknown>;
  const title = String(body.title ?? "").trim();
  const task = await upsertTask(
    actor,
    {
      title,
      status: (body.status as never) ?? "not_started",
      assignee: (body.assignee as never) ?? "Bernie",
      dueAt: (body.dueAt as string | null) ?? null,
    },
    `Added “${title || "a task"}”`,
  );
  return NextResponse.json({ task });
}
