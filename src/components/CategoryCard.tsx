import Link from "next/link";
import type { Category } from "@/lib/catalog";
import { getSigns } from "@/lib/catalog";
import { signThumbURL } from "@/lib/firebasePublic";
import { ArrowRight } from "./Icons";
import { CategoryIcon } from "./CategoryIcon";

/** Pastel category tile with a 3-poster peek and sign count. */
export function CategoryCard({ category }: { category: Category }) {
  const peek = getSigns(category.wordIds.slice(0, 3));
  return (
    <Link
      href={`/dictionary/${category.slug}`}
      className={`card-lift tint-${category.tint} group flex flex-col justify-between overflow-hidden rounded-[24px] bg-[var(--tint)] p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CategoryIcon categoryId={category.id} />
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-ink">{category.title}</p>
            <p className="mt-1 text-sm font-medium text-ink/70">
              {category.wordIds.length} {category.wordIds.length === 1 ? "sign" : "signs"}
            </p>
          </div>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--tint-icon)] transition-transform group-hover:translate-x-0.5">
          <ArrowRight size={18} />
        </span>
      </div>
      <div className="mt-5 flex -space-x-3">
        {peek.map((sign, i) => (
          <span
            key={sign.id}
            className="relative overflow-hidden rounded-xl bg-white shadow-card outline outline-2 outline-[var(--tint)]"
            style={{ zIndex: 3 - i, width: 72, height: 48 }}
          >
            {/* Plain img: the 360px thumb is already small, and next/image's srcSet
                would add ~3.5KB per tile across 190 tiles on the hub. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={signThumbURL(sign.id)}
              alt=""
              width={72}
              height={48}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </span>
        ))}
      </div>
    </Link>
  );
}
