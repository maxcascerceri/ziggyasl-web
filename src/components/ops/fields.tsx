import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-sm font-medium text-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-divider bg-white px-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] focus:border-brand";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-balance text-[1.65rem] font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-0.5 max-w-md text-pretty text-[14px] leading-snug text-secondary">
          {subtitle}
        </p>
      </div>
      {action}
    </header>
  );
}

export function Surface({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-card">
      {children}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <Surface>
      <ul>
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="h-[3.75rem] border-b border-divider/70 last:border-0"
          >
            <span className="mx-5 mt-[1.35rem] block h-3 w-2/3 rounded-full bg-canvas" />
          </li>
        ))}
      </ul>
    </Surface>
  );
}

export function Pill({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-2.5 text-[12px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 shrink-0 rounded-full px-3 text-[13px] font-semibold transition-colors ${
        on ? "bg-white text-brand shadow-card" : "text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[22px] bg-white px-5 py-4 shadow-card">
      <p className="text-[13px] font-medium text-secondary">{label}</p>
      <p className="mt-1 text-[1.65rem] font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-[13px] text-secondary">{hint}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`cta-clay relative min-h-11 rounded-2xl bg-brand px-5 font-semibold text-white ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
