import { NextResponse } from "next/server";
import { listCreators, listExpenses, listTasks } from "@/lib/ops/store";
import {
  isOverdue,
  monthlyRunRate,
  remainingCreatorCash,
  thisMonthTotal,
} from "@/lib/ops/format";

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
      thisMonth: thisMonthTotal(expenses),
      runRate: monthlyRunRate(expenses),
      creatorRemaining: remainingCreatorCash(creators),
    },
    needs: {
      followUps: creators.filter((c) => isOverdue(c.nextFollowUp)),
      unpaidDeals: creators.filter(
        (c) =>
          (c.stage === "active" || c.stage === "negotiation") &&
          (c.payment === "unpaid" || c.payment === "half"),
      ),
    },
  });
}
