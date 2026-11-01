/** The one-paragraph answer at the top of a guide or post, written to be quoted on its own. */
export function QuickAnswer({ children }: { children: string }) {
  return (
    <section
      aria-label="Quick answer"
      className="rounded-[24px] bg-white px-6 py-5 shadow-card outline outline-1 -outline-offset-1 outline-black/5"
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-text">Quick answer</p>
      <p className="mt-2 text-pretty text-[1.08rem] leading-relaxed text-ink">{children}</p>
    </section>
  );
}
