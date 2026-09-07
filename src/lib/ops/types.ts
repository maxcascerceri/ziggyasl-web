export const ACTORS = ["Bernie", "Jared", "Max"] as const;
export type Actor = (typeof ACTORS)[number];

export const CREATOR_STAGES = [
  "wishlist",
  "outreach",
  "negotiation",
  "active",
  "done",
  "passed",
] as const;
export type CreatorStage = (typeof CREATOR_STAGES)[number];

export const PLATFORMS = ["TikTok", "IG", "YouTube", "Other"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PAYMENTS = ["unpaid", "half", "paid", "n/a"] as const;
export type Payment = (typeof PAYMENTS)[number];

export const TASK_STATUSES = [
  "not_started",
  "working",
  "completed",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const CADENCES = ["monthly", "yearly", "one_time"] as const;
export type Cadence = (typeof CADENCES)[number];

export const EXPENSE_CATEGORIES = ["Tools", "Ads", "People", "Other"] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const ENTITY_TYPES = ["creator", "task", "expense"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export type Creator = {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  targetRate: number;
  quotedRate: number;
  dealTotal: number;
  postsExpected: number;
  postsDelivered: number;
  payment: Payment;
  owner: Actor;
  lastContact: string | null;
  nextFollowUp: string | null;
  notes: string;
  stage: CreatorStage;
  updatedAt: string;
  updatedBy: Actor;
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: Actor;
  dueAt: string | null;
  updatedAt: string;
  updatedBy: Actor;
};

export type Expense = {
  id: string;
  name: string;
  amount: number;
  cadence: Cadence;
  category: ExpenseCategory;
  note: string;
  active: boolean;
  updatedAt: string;
  updatedBy: Actor;
};

export type Activity = {
  id: string;
  actor: Actor;
  action: string;
  entityType: EntityType;
  entityId: string;
  summary: string;
  createdAt: string;
};

export type OverviewMetric = {
  id: string;
  label: string;
  value: number;
  formatted: string;
  spark: number[];
};

export type RevenueOverview = {
  fetchedAt: string | null;
  available: boolean;
  message?: string;
  metrics: OverviewMetric[];
};
