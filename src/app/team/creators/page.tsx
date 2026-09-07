"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActor } from "@/components/ops/OpsChrome";
import { Sheet } from "@/components/ops/Sheet";
import { Field, PrimaryButton, inputClass } from "@/components/ops/fields";
import { opsFetch } from "@/components/ops/api";
import {
  ACTORS,
  CREATOR_STAGES,
  PAYMENTS,
  PLATFORMS,
  type Creator,
  type CreatorStage,
} from "@/lib/ops/types";
import {
  isOverdue,
  paymentLabel,
  stageLabel,
  usd,
} from "@/lib/ops/format";

const empty: Partial<Creator> = {
  name: "",
  handle: "",
  platform: "TikTok",
  targetRate: 0,
  quotedRate: 0,
  dealTotal: 0,
  postsExpected: 0,
  postsDelivered: 0,
  payment: "n/a",
  owner: "Bernie",
  lastContact: null,
  nextFollowUp: null,
  notes: "",
  stage: "wishlist",
};

export default function CreatorsRoute() {
  return (
    <Suspense>
      <CreatorsPage />
    </Suspense>
  );
}

function CreatorsPage() {
  const { actor } = useActor();
  const router = useRouter();
  const params = useSearchParams();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [stage, setStage] = useState<CreatorStage | "all">("all");
  const [open, setOpen] = useState<Partial<Creator> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await opsFetch<{ creators: Creator[] }>(
      "/api/ops/creators",
      actor,
    );
    setCreators(data.creators);
  }, [actor]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = params.get("id");
    if (!id || creators.length === 0) return;
    const hit = creators.find((c) => c.id === id);
    if (hit) setOpen(hit);
  }, [params, creators]);

  const filtered = useMemo(
    () => (stage === "all" ? creators : creators.filter((c) => c.stage === stage)),
    [creators, stage],
  );

  function close() {
    setOpen(null);
    setError("");
    router.replace("/team/creators");
  }

  async function save() {
    if (!open) return;
    setBusy(true);
    setError("");
    try {
      if (open.id) {
        await opsFetch(`/api/ops/creators/${open.id}`, actor, {
          method: "PATCH",
          body: JSON.stringify(open),
        });
      } else {
        await opsFetch("/api/ops/creators", actor, {
          method: "POST",
          body: JSON.stringify(open),
        });
      }
      await load();
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function outreach(id: string) {
    setBusy(true);
    try {
      await opsFetch(`/api/ops/creators/${id}`, actor, {
        method: "PATCH",
        body: JSON.stringify({ outreach: true }),
      });
      await load();
      const data = await opsFetch<{ creator: Creator }>(
        `/api/ops/creators/${id}`,
        actor,
      );
      setOpen(data.creator);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not log outreach.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this creator?")) return;
    await opsFetch(`/api/ops/creators/${id}`, actor, { method: "DELETE" });
    await load();
    close();
  }

  function copyHandle(handle: string) {
    void navigator.clipboard.writeText(`@${handle}`);
  }

  return (
    <div>
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Creators</h1>
          <p className="mt-1 text-sm text-secondary">
            Wishlist through active deals. Oldest follow-up first.
          </p>
        </div>
        <PrimaryButton onClick={() => setOpen({ ...empty })}>Add</PrimaryButton>
      </header>

      <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1">
        {(["all", ...CREATOR_STAGES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s)}
            className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${
              stage === s ? "bg-soft text-brand" : "text-secondary"
            }`}
          >
            {s === "all" ? "All" : stageLabel[s]}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-divider bg-white">
        {filtered.length === 0 && (
          <li className="px-4 py-10 text-sm text-secondary">
            Add a creator Bernie should email.
          </li>
        )}
        {filtered.map((c) => {
          const hot = isOverdue(c.nextFollowUp);
          const over = c.quotedRate > 0 && c.targetRate > 0 && c.quotedRate > c.targetRate;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setOpen(c)}
                className="flex w-full min-h-16 items-center gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {c.name || `@${c.handle}`}
                  </p>
                  <p className="truncate text-sm text-secondary">
                    @{c.handle} · {c.platform} · {stageLabel[c.stage]}
                    {over ? " · quote over target" : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <p className={hot ? "font-semibold text-pastel-peach-icon" : "text-secondary"}>
                    {c.nextFollowUp ?? "No follow-up"}
                  </p>
                  <p className="text-secondary">{paymentLabel[c.payment]}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Sheet
        open={!!open}
        onClose={close}
        title={open?.id ? open.name || `@${open.handle}` : "New creator"}
      >
        {open && (
          <div>
            {error && (
              <p className="mb-3 text-sm text-pastel-peach-icon">{error}</p>
            )}
            <Field label="Name">
              <input
                className={inputClass}
                value={open.name ?? ""}
                onChange={(e) => setOpen({ ...open, name: e.target.value })}
              />
            </Field>
            <Field label="Handle">
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={open.handle ?? ""}
                  onChange={(e) => setOpen({ ...open, handle: e.target.value })}
                />
                {open.handle && (
                  <button
                    type="button"
                    className="min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold text-brand"
                    onClick={() => copyHandle(open.handle!)}
                  >
                    Copy
                  </button>
                )}
              </div>
            </Field>
            <Field label="Platform">
              <select
                className={inputClass}
                value={open.platform}
                onChange={(e) =>
                  setOpen({ ...open, platform: e.target.value as Creator["platform"] })
                }
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Stage">
              <select
                className={inputClass}
                value={open.stage}
                onChange={(e) =>
                  setOpen({ ...open, stage: e.target.value as CreatorStage })
                }
              >
                {CREATOR_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {stageLabel[s]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Target rate">
                <input
                  type="number"
                  className={inputClass}
                  value={open.targetRate ?? 0}
                  onChange={(e) =>
                    setOpen({ ...open, targetRate: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Quoted rate">
                <input
                  type="number"
                  className={inputClass}
                  value={open.quotedRate ?? 0}
                  onChange={(e) =>
                    setOpen({ ...open, quotedRate: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            {!!open.quotedRate &&
              !!open.targetRate &&
              open.quotedRate > open.targetRate && (
                <p className="mb-4 text-sm text-pastel-yellow-icon">
                  Quoted {usd(open.quotedRate)} is over the {usd(open.targetRate)}{" "}
                  target.
                </p>
              )}
            <Field label="Deal total">
              <input
                type="number"
                className={inputClass}
                value={open.dealTotal ?? 0}
                onChange={(e) =>
                  setOpen({ ...open, dealTotal: Number(e.target.value) })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Posts expected">
                <input
                  type="number"
                  className={inputClass}
                  value={open.postsExpected ?? 0}
                  onChange={(e) =>
                    setOpen({ ...open, postsExpected: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Posts delivered">
                <input
                  type="number"
                  className={inputClass}
                  value={open.postsDelivered ?? 0}
                  onChange={(e) =>
                    setOpen({ ...open, postsDelivered: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            <Field label="Payment">
              <select
                className={inputClass}
                value={open.payment}
                onChange={(e) =>
                  setOpen({ ...open, payment: e.target.value as Creator["payment"] })
                }
              >
                {PAYMENTS.map((p) => (
                  <option key={p} value={p}>
                    {paymentLabel[p]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Owner">
              <select
                className={inputClass}
                value={open.owner}
                onChange={(e) =>
                  setOpen({ ...open, owner: e.target.value as Creator["owner"] })
                }
              >
                {ACTORS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Last contact">
                <input
                  type="date"
                  className={inputClass}
                  value={open.lastContact ?? ""}
                  onChange={(e) =>
                    setOpen({
                      ...open,
                      lastContact: e.target.value || null,
                    })
                  }
                />
              </Field>
              <Field label="Next follow-up">
                <input
                  type="date"
                  className={inputClass}
                  value={open.nextFollowUp ?? ""}
                  onChange={(e) =>
                    setOpen({
                      ...open,
                      nextFollowUp: e.target.value || null,
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Notes">
              <textarea
                className={`${inputClass} min-h-24 py-2`}
                value={open.notes ?? ""}
                onChange={(e) => setOpen({ ...open, notes: e.target.value })}
              />
            </Field>
            <div className="mt-2 flex flex-col gap-2">
              {open.id && (
                <PrimaryButton
                  disabled={busy}
                  onClick={() => void outreach(open.id!)}
                >
                  Logged outreach
                </PrimaryButton>
              )}
              <PrimaryButton disabled={busy} onClick={() => void save()}>
                {busy ? "Saving…" : "Save"}
              </PrimaryButton>
              {open.id && (
                <button
                  type="button"
                  className="min-h-11 text-sm font-medium text-secondary"
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
