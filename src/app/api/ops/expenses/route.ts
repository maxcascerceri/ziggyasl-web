import { NextResponse } from "next/server";
import { parseActor } from "@/lib/ops/actors";
import { listExpenses, upsertExpense } from "@/lib/ops/store";
import { usd } from "@/lib/ops/format";

export async function GET() {
  const expenses = await listExpenses();
  expenses.sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));
  return NextResponse.json({ expenses });
}

export async function POST(req: Request) {
  const actor = parseActor(req.headers.get("x-ops-actor"));
  const body = (await req.json()) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const amount = Number(body.amount ?? 0);
  const expense = await upsertExpense(
    actor,
    {
      name,
      amount,
      cadence: (body.cadence as never) ?? "monthly",
      category: (body.category as never) ?? "Other",
      note: String(body.note ?? ""),
      active: body.active !== false,
    },
    `Added ${name || "an expense"} ${usd(amount)}`,
  );
  return NextResponse.json({ expense });
}
