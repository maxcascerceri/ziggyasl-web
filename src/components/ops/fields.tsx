import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-divider bg-white px-3 text-[15px] text-ink";

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
