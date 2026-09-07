"use client";

import { useEffect, type ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  title,
  dirty,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  dirty?: boolean;
  children: ReactNode;
}) {
  function requestClose() {
    if (dirty && !confirm("Discard?")) return;
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dirty, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink/20 md:bg-ink/10"
        aria-label="Close"
        onClick={requestClose}
      />
      <div className="relative flex h-full w-full flex-col bg-white md:w-[420px] md:shadow-card">
        <header className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
          <button
            type="button"
            onClick={requestClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[22px] leading-none text-secondary hover:bg-canvas"
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2">{children}</div>
      </div>
    </div>
  );
}
