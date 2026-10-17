"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Chip,
  ListSkeleton,
  PageHeader,
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
import { isOverdue, statusLabel } from "@/lib/ops/format";

const ASSIGN_KEY = "ziggy-ops-assignee";

const compactSelect =
  "min-h-9 max-w-full rounded-lg border border-divider bg-canvas px-2 text-[13px] font-medium text-ink outline-none focus:border-brand";

export default function WorkRoute() {
  return (
    <Suspense>
      <WorkPage />
    </Suspense>
  );
}

function WorkPage() {
  const params = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [who, setWho] = useState<"all" | Person>("all");
  const [status, setStatus] = useState<"open" | "working" | "completed">("open");
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<Person>("Bernie");
  const focusId = params.get("id");

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

  async function patch(id: string, body: Partial<Task>) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...body } : t)),
    );
    await opsFetch(`/api/ops/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this task?")) return;
    await opsFetch(`/api/ops/tasks/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Work"
        subtitle="Change the title, owner, or status right on the list."
      />

      <form
        className="mb-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <input
          className={inputClass}
          placeholder="Add a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className={`${inputClass} sm:w-36`}
          value={assignee}
          onChange={(e) => setAssignee(e.target.value as Person)}
          aria-label="Assign to"
        >
          {PEOPLE.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
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
                <TaskRow
                  key={t.id}
                  task={t}
                  focused={focusId === t.id}
                  onPatch={(body) => void patch(t.id, body)}
                  onRemove={() => void remove(t.id)}
                />
              ))}
            </ul>
          )}
        </Surface>
      )}
    </div>
  );
}

function TaskRow({
  task,
  focused,
  onPatch,
  onRemove,
}: {
  task: Task;
  focused: boolean;
  onPatch: (body: Partial<Task>) => void;
  onRemove: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const rowRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (focused) rowRef.current?.scrollIntoView({ block: "center" });
  }, [focused]);

  function commitTitle() {
    const next = title.trim();
    if (!next) {
      setTitle(task.title);
      return;
    }
    if (next !== task.title) onPatch({ title: next });
  }

  return (
    <li
      ref={rowRef}
      className={`border-b border-divider/70 px-3 py-3 last:border-0 sm:px-4 ${
        focused ? "bg-soft" : ""
      }`}
    >
      <input
        className="min-h-11 w-full rounded-lg border border-transparent bg-transparent px-1 text-[15px] font-medium outline-none hover:bg-canvas focus:border-brand focus:bg-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commitTitle}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        aria-label="Task title"
      />
      <div className="mt-1 flex flex-wrap items-center gap-2 px-1">
        <select
          className={compactSelect}
          value={task.assignee}
          onChange={(e) => onPatch({ assignee: e.target.value as Person })}
          aria-label="Owner"
        >
          {PEOPLE.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          className={compactSelect}
          value={task.status}
          onChange={(e) => onPatch({ status: e.target.value as TaskStatus })}
          aria-label="Status"
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
        <input
          type="date"
          className={`${compactSelect} ${
            isOverdue(task.dueAt) ? "font-semibold text-pastel-peach-icon" : ""
          }`}
          value={task.dueAt ?? ""}
          onChange={(e) => onPatch({ dueAt: e.target.value || null })}
          aria-label="Due date"
        />
        <button
          type="button"
          className="min-h-9 px-1 text-[13px] font-medium text-secondary"
          onClick={onRemove}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
