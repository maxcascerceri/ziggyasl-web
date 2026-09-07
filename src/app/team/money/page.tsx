"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet } from "@/components/ops/Sheet";
import {
  Field,
  ListSkeleton,
  PageHeader,
  Pill,
  PrimaryButton,
  Surface,
  inputClass,
} from "@/components/ops/fields";
import { opsFetch } from "@/components/ops/api";
import {
  CADENCES,
  EXPENSE_CATEGORIES,
  type Cadence,
  type Expense,
  type ExpenseCategory,
} from "@/lib/ops/types";
import { remainingCreatorCash, usd } from "@/lib/ops/format";
import type { Creator } from "@/lib/ops/types";

const categoryPill: Record<string, string> = {
  Tools: "bg-pastel-blue text-[#3d6a94]",
  Ads: "bg-pastel-peach text-[#b45a24]",
  People: "bg-pastel-mint text-[#2d7a62]",
  Other: "bg-canvas text-secondary",
};

export default function MoneyRoute() {
  return (
    <Suspense>
      <MoneyPage />
    </Suspense>
  );
}

function MoneyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<Partial<Expense> | null>(null);
  const [baseline, setBaseline] = useState("");

  const load = useCallback(async () => {
    const [e, c] = await Promise.all([
      opsFetch<{ expenses: Expense[] }>("/api/ops/expenses"),
      opsFetch<{ creators: Creator[] }>("/api/ops/creators"),
    ]);
    setExpenses(e.expenses);
    setCreators(c.creators);
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const hit = expenses.find((x) => x.id === id);
    if (hit) {
      setOpen(hit);
      setBaseline(JSON.stringify(hit));
    }
  }, [params, expenses]);

  const remaining = remainingCreatorCash(creators);
  const dirty = !!open && JSON.stringify(open) !== baseline;

  async function save() {
    if (!open) return;
    if (open.id) {
      await opsFetch(`/api/ops/expenses/${open.id}`, {
        method: "PATCH",
        body: JSON.stringify(open),
      });
    } else {
      await opsFetch("/api/ops/expenses", {
        method: "POST",
        body: JSON.stringify(open),
      });
    }
    await load();
    setOpen(null);
    setBaseline("");
    router.replace("/team/money");
  }

  async function remove(id: string) {
    if (!confirm("Delete this?")) return;
    await opsFetch(`/api/ops/expenses/${id}`, { method: "DELETE" });
    await load();
    setOpen(null);
    router.replace("/team/money");
  }

  function startNew() {
    const next = {
      name: "",
      amount: 0,
      cadence: "monthly" as const,
      category: "Other" as const,
      note: "",
      active: true,
    };
    setOpen(next);
    setBaseline(JSON.stringify(next));
  }

  return (
    <div>
      <PageHeader
        title="Money"
        subtitle="What we pay."
        action={<PrimaryButton onClick={startNew}>Add</PrimaryButton>}
      />
      {remaining > 0 && (
        <p className="mb-4 text-[14px] text-secondary">
          Unpaid deals {usd(remaining)}
        </p>
      )}

      {!ready ? (
        <ListSkeleton />
      ) : (
        <Surface>
          {expenses.length === 0 ? (
            <p className="px-5 py-12 text-center text-[15px] text-secondary">
              No expenses yet.
            </p>
          ) : (
            <ul>
              {expenses.map((e) => (
                <li
                  key={e.id}
                  className="border-b border-divider/70 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(e);
                      setBaseline(JSON.stringify(e));
                    }}
                    className="flex w-full min-h-[4.25rem] items-center gap-3 px-4 py-3 text-left hover:bg-canvas/70"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{e.name}</p>
                      <p className="mt-0.5 text-[13px] text-secondary">
                        {e.cadence.replace("_", " ")}
                        {!e.active ? " · off" : ""}
                      </p>
                    </div>
                    <Pill
                      className={categoryPill[e.category] ?? categoryPill.Other}
                    >
                      {e.category}
                    </Pill>
                    <span className="shrink-0 text-[15px] font-semibold tabular-nums">
                      {usd(e.amount)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Surface>
      )}

      <Sheet
        open={!!open}
        dirty={dirty}
        onClose={() => {
          setOpen(null);
          setBaseline("");
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
            <label className="mb-4 flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={open.active !== false}
                onChange={(e) => setOpen({ ...open, active: e.target.checked })}
              />
              Active
            </label>
            <div className="sticky bottom-0 bg-white pt-2 pb-[env(safe-area-inset-bottom)]">
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
          </div>
        )}
      </Sheet>
    </div>
  );
}
