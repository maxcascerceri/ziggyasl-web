import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import {
  type Activity,
  type Actor,
  type Creator,
  type EntityType,
  type Expense,
  type Task,
} from "./types";

type StoreShape = {
  creators: Creator[];
  tasks: Task[];
  expenses: Expense[];
  activity: Activity[];
};

const empty = (): StoreShape => ({
  creators: [],
  tasks: [],
  expenses: [],
  activity: [],
});

function filePath() {
  return join(process.cwd(), ".data", "ops.json");
}

function readFileStore(): StoreShape {
  const path = filePath();
  if (!existsSync(path)) return empty();
  try {
    return { ...empty(), ...JSON.parse(readFileSync(path, "utf8")) };
  } catch {
    return empty();
  }
}

function writeFileStore(data: StoreShape) {
  const dir = join(process.cwd(), ".data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath(), JSON.stringify(data, null, 2));
}

let adminDb: Firestore | null | undefined;

function getDb(): Firestore | null {
  if (adminDb !== undefined) return adminDb;
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    (file && existsSync(file) ? readFileSync(file, "utf8") : "");
  if (!raw) {
    adminDb = null;
    return null;
  }
  try {
    const cred = JSON.parse(raw) as Record<string, string>;
    if (!getApps().length) {
      initializeApp({ credential: cert(cred) });
    }
    adminDb = getFirestore();
    return adminDb;
  } catch (error) {
    console.error("Firebase Admin init failed; using local file store.", error);
    adminDb = null;
    return null;
  }
}

function items(db: Firestore, col: string) {
  return db.collection("ops").doc(col).collection("items");
}

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

async function logActivity(
  db: Firestore | null,
  file: StoreShape | null,
  entry: Omit<Activity, "id" | "createdAt">,
) {
  const row: Activity = {
    ...entry,
    id: newId(),
    createdAt: nowIso(),
  };
  if (db) {
    const ref = items(db, "activity").doc(row.id);
    await ref.set(row as unknown as Record<string, unknown>);
    const snap = await items(db, "activity").orderBy("createdAt", "desc").limit(80).get();
    if (snap.docs.length > 50) {
      const extra = snap.docs.slice(50);
      await Promise.all(extra.map((d) => items(db, "activity").doc(d.id).delete()));
    }
    return row;
  }
  if (file) {
    file.activity.unshift(row);
    file.activity = file.activity.slice(0, 50);
    writeFileStore(file);
  }
  return row;
}

function guessLink(platform: string, handle: string): string {
  const h = handle.replace(/^@/, "");
  if (!h) return "";
  if (platform === "IG") return `https://www.instagram.com/${h}`;
  if (platform === "YouTube") return `https://www.youtube.com/@${h}`;
  return `https://www.tiktok.com/@${h}`;
}

export function normalizeCreator(
  raw: Record<string, unknown> & { id: string },
): Creator {
  const stage = String(raw.stage ?? "");
  const payment = String(raw.payment ?? "");
  const handle = String(raw.handle ?? "").replace(/^@/, "");
  const platform = String(raw.platform ?? "TikTok");
  const link =
    String(raw.link ?? "").trim() ||
    (handle ? guessLink(platform, handle) : "");
  return {
    id: raw.id,
    name: String(raw.name ?? ""),
    link,
    reachedOut: Boolean(
      raw.reachedOut ?? (stage !== "" && stage !== "wishlist"),
    ),
    active: Boolean(
      raw.active ?? (stage === "active" || stage === "negotiation"),
    ),
    dealAmount: Number(raw.dealAmount ?? raw.dealTotal ?? 0) || 0,
    videos: Number(raw.videos ?? raw.postsExpected ?? 0) || 0,
    posted: Number(raw.posted ?? raw.postsDelivered ?? 0) || 0,
    paid: Boolean(raw.paid ?? payment === "paid"),
    note: String(raw.note ?? raw.notes ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),
    updatedBy: (raw.updatedBy as Creator["updatedBy"]) ?? "Team",
  };
}

export async function listCreators(): Promise<Creator[]> {
  const db = getDb();
  if (db) {
    const snap = await items(db, "creators").get();
    return snap.docs.map((d) =>
      normalizeCreator({ id: d.id, ...d.data() } as Record<string, unknown> & {
        id: string;
      }),
    );
  }
  return readFileStore().creators.map((c) =>
    normalizeCreator(c as unknown as Record<string, unknown> & { id: string }),
  );
}

export async function getCreator(id: string): Promise<Creator | null> {
  const all = await listCreators();
  return all.find((c) => c.id === id) ?? null;
}

export async function upsertCreator(
  actor: Actor,
  input: Partial<Creator> & { id?: string },
  summary: string,
): Promise<Creator> {
  const db = getDb();
  const file = db ? null : readFileStore();
  const existingRaw = input.id
    ? db
      ? ((await items(db, "creators").doc(input.id).get()).data() as
          | Record<string, unknown>
          | undefined)
      : (file?.creators.find((c) => c.id === input.id) as
          | Record<string, unknown>
          | undefined)
    : undefined;
  const existing = existingRaw && input.id
    ? normalizeCreator({ id: input.id, ...existingRaw })
    : undefined;
  const id = input.id ?? newId();
  const next: Creator = {
    id,
    name: input.name ?? existing?.name ?? "",
    link: (input.link ?? existing?.link ?? "").trim(),
    reachedOut: input.reachedOut ?? existing?.reachedOut ?? false,
    active: input.active ?? existing?.active ?? false,
    dealAmount: num(input.dealAmount, existing?.dealAmount, 0),
    videos: num(input.videos, existing?.videos, 0),
    posted: num(input.posted, existing?.posted, 0),
    paid: input.paid ?? existing?.paid ?? false,
    note: input.note ?? existing?.note ?? "",
    updatedAt: nowIso(),
    updatedBy: actor,
  };
  if (next.active) next.reachedOut = true;
  if (db) {
    await items(db, "creators").doc(id).set(next as unknown as Record<string, unknown>);
    await logActivity(db, null, {
      actor,
      action: existing ? "edited" : "created",
      entityType: "creator",
      entityId: id,
      summary,
    });
  } else if (file) {
    const i = file.creators.findIndex((c) => c.id === id);
    if (i >= 0) file.creators[i] = next;
    else file.creators.push(next);
    writeFileStore(file);
    await logActivity(null, file, {
      actor,
      action: existing ? "edited" : "created",
      entityType: "creator",
      entityId: id,
      summary,
    });
  }
  return next;
}

export async function deleteCreator(actor: Actor, id: string, summary: string) {
  const db = getDb();
  if (db) {
    await items(db, "creators").doc(id).delete();
    await logActivity(db, null, {
      actor,
      action: "deleted",
      entityType: "creator",
      entityId: id,
      summary,
    });
    return;
  }
  const file = readFileStore();
  file.creators = file.creators.filter((c) => c.id !== id);
  writeFileStore(file);
  await logActivity(null, file, {
    actor,
    action: "deleted",
    entityType: "creator",
    entityId: id,
    summary,
  });
}

export async function findCreatorByLink(link: string, exceptId?: string) {
  const needle = link.trim().toLowerCase().replace(/\/$/, "");
  if (!needle) return undefined;
  const all = await listCreators();
  return all.find(
    (c) =>
      c.link.trim().toLowerCase().replace(/\/$/, "") === needle &&
      c.id !== exceptId,
  );
}

export async function listTasks(): Promise<Task[]> {
  const db = getDb();
  if (db) {
    const snap = await items(db, "tasks").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task);
  }
  return readFileStore().tasks;
}

export async function upsertTask(
  actor: Actor,
  input: Partial<Task> & { id?: string },
  summary: string,
): Promise<Task> {
  const db = getDb();
  const file = db ? null : readFileStore();
  const existing = input.id
    ? db
      ? ((await items(db, "tasks").doc(input.id).get()).data() as Task | undefined)
      : file?.tasks.find((t) => t.id === input.id)
    : undefined;
  const id = input.id ?? newId();
  const next: Task = {
    id,
    title: input.title ?? existing?.title ?? "",
    status: input.status ?? existing?.status ?? "not_started",
    assignee: input.assignee ?? existing?.assignee ?? "Bernie",
    dueAt: input.dueAt !== undefined ? input.dueAt : existing?.dueAt ?? null,
    updatedAt: nowIso(),
    updatedBy: actor,
  };
  if (db) {
    await items(db, "tasks").doc(id).set(next as unknown as Record<string, unknown>);
    await logActivity(db, null, {
      actor,
      action: existing ? "edited" : "created",
      entityType: "task",
      entityId: id,
      summary,
    });
  } else if (file) {
    const i = file.tasks.findIndex((t) => t.id === id);
    if (i >= 0) file.tasks[i] = next;
    else file.tasks.push(next);
    writeFileStore(file);
    await logActivity(null, file, {
      actor,
      action: existing ? "edited" : "created",
      entityType: "task",
      entityId: id,
      summary,
    });
  }
  return next;
}

export async function deleteTask(actor: Actor, id: string, summary: string) {
  const db = getDb();
  if (db) {
    await items(db, "tasks").doc(id).delete();
    await logActivity(db, null, {
      actor,
      action: "deleted",
      entityType: "task",
      entityId: id,
      summary,
    });
    return;
  }
  const file = readFileStore();
  file.tasks = file.tasks.filter((t) => t.id !== id);
  writeFileStore(file);
  await logActivity(null, file, {
    actor,
    action: "deleted",
    entityType: "task",
    entityId: id,
    summary,
  });
}

export async function listExpenses(): Promise<Expense[]> {
  const db = getDb();
  if (db) {
    const snap = await items(db, "expenses").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense);
  }
  return readFileStore().expenses;
}

export async function upsertExpense(
  actor: Actor,
  input: Partial<Expense> & { id?: string },
  summary: string,
): Promise<Expense> {
  const db = getDb();
  const file = db ? null : readFileStore();
  const existing = input.id
    ? db
      ? ((await items(db, "expenses").doc(input.id).get()).data() as Expense | undefined)
      : file?.expenses.find((e) => e.id === input.id)
    : undefined;
  const id = input.id ?? newId();
  const next: Expense = {
    id,
    name: input.name ?? existing?.name ?? "",
    amount: num(input.amount, existing?.amount, 0),
    cadence: input.cadence ?? existing?.cadence ?? "monthly",
    category: input.category ?? existing?.category ?? "Other",
    note: input.note ?? existing?.note ?? "",
    active: input.active ?? existing?.active ?? true,
    updatedAt: nowIso(),
    updatedBy: actor,
  };
  if (db) {
    await items(db, "expenses").doc(id).set(next as unknown as Record<string, unknown>);
    await logActivity(db, null, {
      actor,
      action: existing ? "edited" : "created",
      entityType: "expense",
      entityId: id,
      summary,
    });
  } else if (file) {
    const i = file.expenses.findIndex((e) => e.id === id);
    if (i >= 0) file.expenses[i] = next;
    else file.expenses.push(next);
    writeFileStore(file);
    await logActivity(null, file, {
      actor,
      action: existing ? "edited" : "created",
      entityType: "expense",
      entityId: id,
      summary,
    });
  }
  return next;
}

export async function deleteExpense(actor: Actor, id: string, summary: string) {
  const db = getDb();
  if (db) {
    await items(db, "expenses").doc(id).delete();
    await logActivity(db, null, {
      actor,
      action: "deleted",
      entityType: "expense",
      entityId: id,
      summary,
    });
    return;
  }
  const file = readFileStore();
  file.expenses = file.expenses.filter((e) => e.id !== id);
  writeFileStore(file);
  await logActivity(null, file, {
    actor,
    action: "deleted",
    entityType: "expense",
    entityId: id,
    summary,
  });
}

export async function listActivity(): Promise<Activity[]> {
  const db = getDb();
  if (db) {
    const snap = await items(db, "activity").orderBy("createdAt", "desc").limit(50).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Activity);
  }
  return readFileStore().activity.slice(0, 50);
}

function num(
  next: number | undefined,
  prev: number | undefined,
  fallback: number,
) {
  if (typeof next === "number" && Number.isFinite(next)) return next;
  if (typeof prev === "number" && Number.isFinite(prev)) return prev;
  return fallback;
}

export type { EntityType };
