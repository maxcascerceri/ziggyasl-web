import { ChevronDown } from "./Icons";

export type FAQItem = { q: string; a: string };

/**
 * Native <details> so every answer is in the HTML (required for FAQ rich
 * results) and it works without JavaScript. The first item starts open.
 */
export function FAQ({ items, title = "Questions" }: { items: FAQItem[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-divider rounded-[24px] bg-white px-5 shadow-card outline outline-1 -outline-offset-1 outline-black/5">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0 || undefined} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[1.02rem] font-extrabold text-ink [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <span className="shrink-0 text-secondary transition-transform group-open:rotate-180">
                <ChevronDown size={18} />
              </span>
            </summary>
            <p className="pb-5 pr-8 leading-relaxed text-secondary">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
