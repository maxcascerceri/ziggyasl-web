import { NextResponse } from "next/server";
import { listCreators, listExpenses, listTasks } from "@/lib/ops/store";
import { remainingCreatorCash } from "@/lib/ops/format";

export async function GET() {
  const [creators, tasks, expenses] = await Promise.all([
    listCreators(),
    listTasks(),
    listExpenses(),
  ]);
  return NextResponse.json({
    creators,
    tasks,
    expenses,
    money: {
      creatorRemaining: remainingCreatorCash(creators),
    },
    needs: {
      toReach: creators.filter((c) => !c.reachedOut),
      unpaidDeals: creators.filter((c) => c.active && !c.paid),
    },
  });
}
