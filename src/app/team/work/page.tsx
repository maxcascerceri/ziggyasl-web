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
import {
  PEOPLE,
  TASK_STATUSES,
  type Person,
  type Task,
  type TaskStatus,
} from "@/lib/ops/types";
import {
  NEXT_STATUS,
  dateLabel,
  isOverdue,
  statusLabel,
  statusPill,
} from "@/lib/ops/format";

const ASSIGN_KEY = "ziggy-ops-assignee";

export default function WorkRoute() {
  return (
    <Suspense>
      <WorkPage />
    </Suspense>
  );
}

function WorkPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [who, setWho] = useState<"all" | Person>("all");
  const [status, setStatus] = useState<"open" | "working" | "completed">("open");
  const [open, setOpen] = useState<Partial<Task> | null>(null);
  const [baseline, setBaseline] = useState("");
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<Person>("Bernie");

  const load = useCallback(async () => {
    const data = await opsFetch<{ tasks: Task[] }>("/api/ops/tasks");
    setTasks(data.tasks);
    setReady(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(ASSIGN_KEY) as Person | null;
    if (saved && PEOPLE.includes(saved)) setAssignee(saved);
    void load();
  }, [load]);

  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const hit = tasks.find((t) => t.id === id);
    if (hit) {
      setOpen(hit);
      setBaseline(JSON.stringify(hit));
    }
  }, [params, tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (who !== "all" && t.assignee !== who) return false;
      if (status === "open") return t.status !== "completed";
      return t.status === status;
    });
  }, [tasks, who, status]);

  async function add() {
    const text = title.trim();
    if (!text) return;
    localStorage.setItem(ASSIGN_KEY, assignee);
    await opsFetch("/api/ops/tasks", {
      method: "POST",
      body: JSON.stringify({ title: text, assignee }),
    });
    setTitle("");
    await load();
  }

  async function cycle(t: Task) {
    const next = NEXT_STATUS[t.status];
    await opsFetch(`/api/ops/tasks/${t.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    await load();
  }

  async function save() {
    if (!open?.id) return;
    await opsFetch(`/api/ops/tasks/${open.id}`, {
      method: "PATCH",
      body: JSON.stringify(open),
    });
    if (open.assignee) localStorage.setItem(ASSIGN_KEY, open.assignee);
    await load();
    setOpen(null);
    setBaseline("");
    router.replace("/team/work");
  }

  async function remove(id: string) {
    if (!confirm("Delete this?")) return;
    await opsFetch(`/api/ops/tasks/${id}`, { method: "DELETE" });
    await load();
    setOpen(null);
    router.replace("/team/work");
  }

  const dirty = !!open && JSON.stringify(open) !== baseline;

  return (
    <div>
      <PageHeader title="Work" subtitle="Who’s doing what." />

      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <input
          className={inputClass}
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <PrimaryButton type="submit">Add</PrimaryButton>
      </form>

      <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1">
        <Chip on={status === "open"} onClick={() => setStatus("open")}>
          Open
        </Chip>
        <Chip on={status === "working"} onClick={() => setStatus("working")}>
          Doing
        </Chip>
        <Chip on={status === "completed"} onClick={() => setStatus("completed")}>
          Done
        </Chip>
        <Chip on={who === "all"} onClick={() => setWho("all")}>
          Everyone
        </Chip>
        {PEOPLE.map((p) => (
          <Chip key={p} on={who === p} onClick={() => setWho(p)}>
            {p}
          </Chip>
        ))}
      </div>

      {!ready ? (
        <ListSkeleton />
      ) : (
        <Surface>
          {filtered.length === 0 ? (
            <p className="px-5 py-12 text-center text-[15px] text-secondary">
              No open work.
            </p>
          ) : (
            <ul>
              {filtered.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 border-b border-divider/70 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(t);
                      setBaseline(JSON.stringify(t));
                    }}
                    className="flex min-h-[4rem] min-w-0 flex-1 items-center px-4 py-3 text-left hover:bg-canvas/70"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{t.title}</span>
                      <span
                        className={`mt-0.5 block text-[12px] ${
                          isOverdue(t.dueAt)
                            ? "font-semibold text-pastel-peach-icon"
                            : "text-secondary"
                        }`}
                      >
                        {t.assignee}
                        {t.dueAt ? ` · ${dateLabel(t.dueAt)}` : ""}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="shrink-0 pr-4"
                    onClick={() => void cycle(t)}
                  >
                    <Pill className={statusPill[t.status]}>
                      {statusLabel[t.status]}
                    </Pill>
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
          router.replace("/team/work");
        }}
        title="Task"
      >
        {open && (
          <div>
            <Field label="Title">
              <input
                className={inputClass}
                value={open.title ?? ""}
                onChange={(e) => setOpen({ ...open, title: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={open.status}
                onChange={(e) =>
                  setOpen({ ...open, status: e.target.value as TaskStatus })
                }
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assignee">
              <select
                className={inputClass}
                value={open.assignee}
                onChange={(e) =>
                  setOpen({ ...open, assignee: e.target.value as Person })
                }
              >
                {PEOPLE.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Due">
              <input
                type="date"
                className={inputClass}
                value={open.dueAt ?? ""}
                onChange={(e) =>
                  setOpen({ ...open, dueAt: e.target.value || null })
                }
              />
            </Field>
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
