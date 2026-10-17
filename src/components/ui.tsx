import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Tint } from "@/lib/catalog";
import { ChevronRight } from "./Icons";

/** Small rounded label. Tinted variants use the pastel chip palette. */
export function Chip({
  children,
  tint,
  href,
  className = "",
}: {
  children: ReactNode;
  tint?: Tint;
  href?: string;
  className?: string;
}) {
  const tone = tint
    ? `tint-${tint} bg-[var(--tint)] text-ink`
    : "bg-cream text-secondary outline outline-1 -outline-offset-1 outline-divider";
  const cls = `inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold leading-none ${tone} ${className}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${cls} transition-transform hover:-translate-y-px active:scale-95`}
      >
        {children}
      </Link>
    );
  }
  return <span className={cls}>{children}</span>;
}

/** Small uppercase label. Use tone="ink" on pastel tints, where brand blue dips under AA contrast. */
export function Eyebrow({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "ink" }) {
  return (
    <p
      className={`text-sm font-semibold uppercase tracking-[0.12em] ${
        tone === "ink" ? "text-ink/80" : "text-brand-shadow"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  as: Tag = "h2",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-3 ${centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Tag
          className={`mt-2 text-balance font-bold tracking-tight text-ink ${
            Tag === "h1"
              ? "text-4xl leading-[1.08] sm:text-5xl"
              : "text-2xl sm:text-3xl"
          }`}
        >
          {title}
        </Tag>
        {subtitle ? (
          <p className="mt-3 text-pretty text-lg leading-relaxed text-secondary">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand"
        >
          {action.label}
          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-secondary">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded px-1 py-0.5 font-medium transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="px-1 py-0.5 font-semibold text-ink"
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight size={14} className="text-divider" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Primary clay button, link or anchor. */
export function ClayButton({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "soft";
  className?: string;
  external?: boolean;
}) {
  const tone =
    variant === "primary"
      ? "bg-brand text-white"
      : "bg-cream text-ink outline outline-1 -outline-offset-1 outline-divider";
  const cls = `cta-clay relative isolate inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold ${tone} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Container for page content. */
export function Container({
  children,
  className = "",
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 ${narrow ? "max-w-3xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </div>
  );
}

/** JSON-LD script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Teacher callout with Ziggy peeking in. */
export function MascotNote({
  title,
  children,
  mascot = "/brand/ziggy-teach.png",
}: {
  title?: string;
  children: ReactNode;
  mascot?: string;
}) {
  return (
    <aside className="relative mt-10 rounded-[28px] bg-gradient-to-br from-soft/60 to-cream px-6 py-6 pl-6 sm:pl-36">
      <Image
        src={mascot}
        alt=""
        aria-hidden
        width={112}
        height={112}
        sizes="112px"
        className="pointer-events-none absolute -top-8 left-4 hidden h-auto w-28 drop-shadow-[0_8px_16px_rgba(41,46,56,0.18)] sm:block"
      />
      {title ? (
        <p className="text-sm font-bold uppercase tracking-[0.1em] text-brand-shadow">
          {title}
        </p>
      ) : null}
      <div className="mt-1 text-[1.02rem] leading-relaxed text-ink">
        {children}
      </div>
    </aside>
  );
}
