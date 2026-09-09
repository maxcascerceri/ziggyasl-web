export const PEOPLE = ["Bernie", "Jared", "Max"] as const;
export type Person = (typeof PEOPLE)[number];

export const TEAM_ACTOR = "Team" as const;
export type Actor = typeof TEAM_ACTOR | Person;

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
  link: string;
  reachedOut: boolean;
  active: boolean;
  dealAmount: number;
  videos: number;
  posted: number;
  paid: boolean;
  note: string;
  updatedAt: string;
  updatedBy: Actor;
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: Person;
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
