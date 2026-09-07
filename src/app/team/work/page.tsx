"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActor } from "@/components/ops/OpsChrome";
import { Sheet } from "@/components/ops/Sheet";
import { Field, PrimaryButton, inputClass } from "@/components/ops/fields";
import { opsFetch } from "@/components/ops/api";
import { ACTORS, TASK_STATUSES, type Actor, type Task, type TaskStatus } from "@/lib/ops/types";
import { statusLabel } from "@/lib/ops/format";

export default function WorkRoute() {
  return (
    <Suspense>
      <WorkPage />
    </Suspense>
  );
}

function WorkPage() {
  const { actor } = useActor();
  const router = useRouter();
  const params = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [who, setWho] = useState<"me" | "all">("me");
  const [status, setStatus] = useState<TaskStatus | "open">("open");
  const [open, setOpen] = useState<Partial<Task> | null>(null);
  const [title, setTitle] = useState("");

  const load = useCallback(async () => {
    const data = await opsFetch<{ tasks: Task[] }>("/api/ops/tasks", actor);
    setTasks(data.tasks);
  }, [actor]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const hit = tasks.find((t) => t.id === id);
    if (hit) setOpen(hit);
  }, [params, tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (who === "me" && t.assignee !== actor) return false;
      if (status === "open") return t.status !== "completed";
      return t.status === status;
    });
  }, [tasks, who, status, actor]);

  async function add() {
    const text = title.trim();
    if (!text) return;
    await opsFetch("/api/ops/tasks", actor, {
      method: "POST",
      body: JSON.stringify({ title: text, assignee: actor }),
    });
    setTitle("");
    await load();
  }

  async function save() {
    if (!open?.id) return;
    await opsFetch(`/api/ops/tasks/${open.id}`, actor, {
      method: "PATCH",
      body: JSON.stringify(open),
    });
    await load();
    setOpen(null);
    router.replace("/team/work");
  }

  async function remove(id: string) {
    if (!confirm("Delete this task?")) return;
    await opsFetch(`/api/ops/tasks/${id}`, actor, { method: "DELETE" });
    await load();
    setOpen(null);
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Work</h1>
        <p className="mt-1 text-sm text-secondary">One list. Assign it. Move the status.</p>
      </header>

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

      <div className="mb-3 flex flex-wrap gap-1">
        <Chip
          on={who === "me" && status === "open"}
          onClick={() => {
            setWho("me");
            setStatus("open");
          }}
        >
          My open
        </Chip>
        <Chip on={who === "all"} onClick={() => setWho("all")}>
          Everyone
        </Chip>
        {TASK_STATUSES.map((s) => (
          <Chip key={s} on={status === s} onClick={() => setStatus(s)}>
            {statusLabel[s]}
          </Chip>
        ))}
        <Chip on={status === "open"} onClick={() => setStatus("open")}>
          Open
        </Chip>
      </div>

      <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-divider bg-white">
        {filtered.length === 0 && (
          <li className="px-4 py-10 text-sm text-secondary">Nothing here.</li>
        )}
        {filtered.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => setOpen(t)}
              className="flex w-full min-h-14 items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="font-medium">{t.title}</span>
              <span className="shrink-0 text-sm text-secondary">
                {t.assignee} · {statusLabel[t.status]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet
        open={!!open}
        onClose={() => {
          setOpen(null);
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
                  setOpen({ ...open, assignee: e.target.value as Actor })
                }
              >
                {ACTORS.map((a) => (
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
            <PrimaryButton className="mt-2 w-full" onClick={() => void save()}>
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

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full px-3 text-sm font-semibold ${
        on ? "bg-soft text-brand" : "text-secondary"
      }`}
    >
      {children}
    </button>
  );
}
