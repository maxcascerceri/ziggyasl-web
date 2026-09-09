"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet } from "@/components/ops/Sheet";
import {
  Chip,
  Field,
  ListSkeleton,
  PageHeader,
  Pill,
  PrimaryButton,
  Surface,
  inputClass,
} from "@/components/ops/fields";
import { opsFetch } from "@/components/ops/api";
import type { Creator } from "@/lib/ops/types";
import { hrefFor, linkLabel, usd } from "@/lib/ops/format";

const empty: Partial<Creator> = {
  name: "",
  link: "",
  reachedOut: false,
  active: false,
  dealAmount: 0,
  videos: 0,
  posted: 0,
  paid: false,
  note: "",
};

export default function CreatorsRoute() {
  return (
    <Suspense>
      <CreatorsPage />
    </Suspense>
  );
}

function CreatorsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "to_reach" | "active">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Partial<Creator> | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await opsFetch<{ creators: Creator[] }>("/api/ops/creators");
    setCreators(data.creators);
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = params.get("id");
    if (!id || creators.length === 0) return;
    const hit = creators.find((c) => c.id === id);
    if (hit) {
      setOpen(hit);
      setBaseline(JSON.stringify(hit));
    }
  }, [params, creators]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return creators.filter((c) => {
      if (filter === "to_reach" && c.reachedOut) return false;
      if (filter === "active" && !c.active) return false;
      if (!needle) return true;
      return (
        c.name.toLowerCase().includes(needle) ||
        c.link.toLowerCase().includes(needle)
      );
    });
  }, [creators, filter, q]);

  function close() {
    setOpen(null);
    setError("");
    setBaseline("");
    router.replace("/team/creators");
  }

  const dirty = !!open && JSON.stringify(open) !== baseline;

  async function save() {
    if (!open) return;
    setBusy(true);
    setError("");
    try {
      if (open.id) {
        await opsFetch(`/api/ops/creators/${open.id}`, {
          method: "PATCH",
          body: JSON.stringify(open),
        });
      } else {
        await opsFetch("/api/ops/creators", {
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

  async function markReached(id: string) {
    setBusy(true);
    try {
      await opsFetch(`/api/ops/creators/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ outreach: true }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this?")) return;
    await opsFetch(`/api/ops/creators/${id}`, { method: "DELETE" });
    await load();
    close();
  }

  function startNew() {
    const next = { ...empty };
    setOpen(next);
    setBaseline(JSON.stringify(next));
  }

  function pill(c: Creator) {
    if (c.active && !c.paid) {
      return <Pill className="bg-pastel-peach text-[#b45a24]">Unpaid</Pill>;
    }
    if (c.active) {
      return <Pill className="bg-pastel-mint text-[#2d7a62]">Active</Pill>;
    }
    if (c.reachedOut) {
      return <Pill className="bg-pastel-yellow text-[#8a6a12]">Reached out</Pill>;
    }
    return <Pill className="bg-canvas text-secondary">To reach</Pill>;
  }

  return (
    <div>
      <PageHeader
        title="Creators"
        subtitle="Name, link, outreach, deal."
        action={<PrimaryButton onClick={startNew}>Add</PrimaryButton>}
      />

      <input
        className={`${inputClass} mb-3`}
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1">
        <Chip on={filter === "all"} onClick={() => setFilter("all")}>
          All
        </Chip>
        <Chip on={filter === "to_reach"} onClick={() => setFilter("to_reach")}>
          To reach
        </Chip>
        <Chip on={filter === "active"} onClick={() => setFilter("active")}>
          Active
        </Chip>
      </div>

      {!ready ? (
        <ListSkeleton />
      ) : (
        <Surface>
          {filtered.length === 0 ? (
            <p className="px-5 py-12 text-center text-[15px] text-secondary">
              No creators yet.
            </p>
          ) : (
            <ul>
              {filtered.map((c) => {
                const initial = (c.name || "?").slice(0, 1).toUpperCase();
                const href = hrefFor(c.link);
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-1 border-b border-divider/70 last:border-0"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(c);
                        setBaseline(JSON.stringify(c));
                      }}
                      className="flex min-h-[4.25rem] min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left hover:bg-canvas/70"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft text-sm font-semibold text-brand">
                        {initial}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{c.name || "Untitled"}</p>
                        <p className="truncate text-[13px] text-secondary">
                          {c.videos > 0 || c.dealAmount > 0
                            ? `${c.videos} for ${usd(c.dealAmount)}`
                            : linkLabel(c.link) || "No link"}
                        </p>
                      </div>
                      {pill(c)}
                    </button>
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 px-2 text-[13px] font-semibold text-brand"
                      >
                        Open
                      </a>
                    )}
                    {!c.reachedOut && c.id && (
                      <button
                        type="button"
                        disabled={busy}
                        className="shrink-0 pr-4 text-[13px] font-semibold text-brand"
                        onClick={() => void markReached(c.id)}
                      >
                        Reached out
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Surface>
      )}

      <Sheet
        open={!!open}
        dirty={dirty}
        onClose={close}
        title={open?.id ? open.name || "Creator" : "New creator"}
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
            <Field label="Social link">
              <input
                className={inputClass}
                placeholder="tiktok.com/@…"
                value={open.link ?? ""}
                onChange={(e) => setOpen({ ...open, link: e.target.value })}
              />
            </Field>
            <label className="mb-3 flex min-h-11 items-center gap-2 text-[15px]">
              <input
                type="checkbox"
                checked={!!open.reachedOut}
                onChange={(e) =>
                  setOpen({ ...open, reachedOut: e.target.checked })
                }
              />
              Reached out
            </label>
            <label className="mb-4 flex min-h-11 items-center gap-2 text-[15px]">
              <input
                type="checkbox"
                checked={!!open.active}
                onChange={(e) =>
                  setOpen({
                    ...open,
                    active: e.target.checked,
                    reachedOut: e.target.checked ? true : open.reachedOut,
                  })
                }
              />
              Active deal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pay">
                <input
                  type="number"
                  className={inputClass}
                  value={open.dealAmount ?? 0}
                  onChange={(e) =>
                    setOpen({
                      ...open,
                      dealAmount: Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Videos">
                <input
                  type="number"
                  className={inputClass}
                  value={open.videos ?? 0}
                  onChange={(e) =>
                    setOpen({ ...open, videos: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            {open.active && (
              <>
                <Field label="Posted so far">
                  <input
                    type="number"
                    className={inputClass}
                    value={open.posted ?? 0}
                    onChange={(e) =>
                      setOpen({ ...open, posted: Number(e.target.value) })
                    }
                  />
                </Field>
                <label className="mb-4 flex min-h-11 items-center gap-2 text-[15px]">
                  <input
                    type="checkbox"
                    checked={!!open.paid}
                    onChange={(e) =>
                      setOpen({ ...open, paid: e.target.checked })
                    }
                  />
                  Paid
                </label>
              </>
            )}
            <Field label="Note">
              <textarea
                className={`${inputClass} min-h-20 py-2`}
                value={open.note ?? ""}
                onChange={(e) => setOpen({ ...open, note: e.target.value })}
              />
            </Field>
            <div className="sticky bottom-0 mt-2 flex flex-col gap-2 bg-white pt-2 pb-[env(safe-area-inset-bottom)]">
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
