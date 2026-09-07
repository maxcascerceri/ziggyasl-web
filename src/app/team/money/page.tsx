"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActor } from "@/components/ops/OpsChrome";
import { Sheet } from "@/components/ops/Sheet";
import { Field, PrimaryButton, inputClass } from "@/components/ops/fields";
import { opsFetch } from "@/components/ops/api";
import {
  CADENCES,
  EXPENSE_CATEGORIES,
  type Cadence,
  type Expense,
  type ExpenseCategory,
} from "@/lib/ops/types";
import {
  monthlyRunRate,
  remainingCreatorCash,
  thisMonthTotal,
  usd,
} from "@/lib/ops/format";
import type { Creator } from "@/lib/ops/types";

export default function MoneyRoute() {
  return (
    <Suspense>
      <MoneyPage />
    </Suspense>
  );
}

function MoneyPage() {
  const { actor } = useActor();
  const router = useRouter();
  const params = useSearchParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [open, setOpen] = useState<Partial<Expense> | null>(null);

  const load = useCallback(async () => {
    const [e, c] = await Promise.all([
      opsFetch<{ expenses: Expense[] }>("/api/ops/expenses", actor),
      opsFetch<{ creators: Creator[] }>("/api/ops/creators", actor),
    ]);
    setExpenses(e.expenses);
    setCreators(c.creators);
  }, [actor]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const hit = expenses.find((x) => x.id === id);
    if (hit) setOpen(hit);
  }, [params, expenses]);

  const remaining = remainingCreatorCash(creators);

  async function save() {
    if (!open) return;
    if (open.id) {
      await opsFetch(`/api/ops/expenses/${open.id}`, actor, {
        method: "PATCH",
        body: JSON.stringify(open),
      });
    } else {
      await opsFetch("/api/ops/expenses", actor, {
        method: "POST",
        body: JSON.stringify(open),
      });
    }
    await load();
    setOpen(null);
    router.replace("/team/money");
  }

  async function remove(id: string) {
    if (!confirm("Delete this line?")) return;
    await opsFetch(`/api/ops/expenses/${id}`, actor, { method: "DELETE" });
    await load();
    setOpen(null);
  }

  return (
    <div>
      <header className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Money</h1>
          <p className="mt-1 text-sm text-secondary">
            Recurring templates. Amounts stay editable.
          </p>
        </div>
        <PrimaryButton
          onClick={() =>
            setOpen({
              name: "",
              amount: 0,
              cadence: "monthly",
              category: "Other",
              note: "",
              active: true,
            })
          }
        >
          Add
        </PrimaryButton>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="This month" value={usd(thisMonthTotal(expenses))} />
        <Stat label="Monthly run-rate" value={usd(monthlyRunRate(expenses))} />
        <Stat label="Creator deals (from pipeline)" value={usd(remaining)} />
      </div>

      <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-divider bg-white">
        {expenses.length === 0 && (
          <li className="px-4 py-10 text-sm text-secondary">
            Add a line like rent, tools, or ads.
          </li>
        )}
        {expenses.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setOpen(e)}
              className="flex w-full min-h-14 items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span>
                <span className="font-semibold">{e.name}</span>
                <span className="ml-2 text-sm text-secondary">
                  {e.cadence.replace("_", " ")} · {e.category}
                  {!e.active ? " · off" : ""}
                </span>
              </span>
              <span className="font-medium">{usd(e.amount)}</span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet
        open={!!open}
        onClose={() => {
          setOpen(null);
          router.replace("/team/money");
        }}
        title={open?.id ? "Edit line" : "New line"}
      >
        {open && (
          <div>
            <Field label="Name">
              <input
                className={inputClass}
                value={open.name ?? ""}
                onChange={(e) => setOpen({ ...open, name: e.target.value })}
              />
            </Field>
            <Field label="Amount">
              <input
                type="number"
                className={inputClass}
                value={open.amount ?? 0}
                onChange={(e) =>
                  setOpen({ ...open, amount: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Cadence">
              <select
                className={inputClass}
                value={open.cadence}
                onChange={(e) =>
                  setOpen({ ...open, cadence: e.target.value as Cadence })
                }
              >
                {CADENCES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={open.category}
                onChange={(e) =>
                  setOpen({
                    ...open,
                    category: e.target.value as ExpenseCategory,
                  })
                }
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Note">
              <input
                className={inputClass}
                value={open.note ?? ""}
                onChange={(e) => setOpen({ ...open, note: e.target.value })}
              />
            </Field>
            <label className="mb-5 flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={open.active !== false}
                onChange={(e) => setOpen({ ...open, active: e.target.checked })}
              />
              Active
            </label>
            <PrimaryButton className="w-full" onClick={() => void save()}>
              Save
            </PrimaryButton>
            {open.id && (
              <button
                type="button"
                className="mt-2 min-h-11 w-full text-sm text-secondary"
                onClick={() => void remove(open.id!)}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-divider bg-white px-4 py-3">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
