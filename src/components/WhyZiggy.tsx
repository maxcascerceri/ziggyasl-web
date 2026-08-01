import { copy } from "@/lib/copy";
import { FadeIn } from "./Motion";

const tintStyles: Record<string, { chip: string; icon: string }> = {
  blue: { chip: "bg-pastel-blue", icon: "text-pastel-blue-icon" },
  mint: { chip: "bg-pastel-mint", icon: "text-pastel-mint-icon" },
  peach: { chip: "bg-pastel-peach", icon: "text-pastel-peach-icon" },
};

const icons: Record<string, React.ReactNode> = {
  blue: (
    // Play — video-first
    <path d="M8 5.5v13l11-6.5-11-6.5z" />
  ),
  mint: (
    // Clock — short sessions
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.6 4 2.3-1 1.7-5-2.9V6h2v6.6z" />
  ),
  peach: (
    // Rising bars — visible progress
    <path d="M4 20h3v-6H4v6zm6.5 0h3V4h-3v16zM17 20h3v-10h-3v10z" />
  ),
};

export function WhyZiggy() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <FadeIn>
        <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {copy.why.title}
        </h2>
      </FadeIn>
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {copy.why.items.map((item, i) => {
          const tint = tintStyles[item.tint] ?? tintStyles.blue;
          return (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div
                className="h-full rounded-3xl bg-white p-7"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tint.chip} ${tint.icon}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                    className="h-6 w-6"
                  >
                    {icons[item.tint] ?? icons.blue}
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-secondary">
                  {item.body}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
