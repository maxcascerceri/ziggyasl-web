import { copy } from "@/lib/copy";
import { FadeIn } from "./Motion";
import { Sticker } from "./Sticker";

const STICKERS: Record<string, string> = {
  blue: "sign",
  mint: "streak",
  peach: "star",
};

/** Sticker pile + three claims, on the soft-blue band. */
export function WhyZiggy() {
  return (
    <section className="bg-soft/50">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <FadeIn>
          <h2 className="text-balance text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {copy.why.title}
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {copy.why.items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center rounded-3xl bg-white p-7 text-center shadow-card">
                <Sticker name={STICKERS[item.tint] ?? "sign"} size={104} />
                <h3 className="mt-5 text-lg font-extrabold text-ink">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-secondary">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
