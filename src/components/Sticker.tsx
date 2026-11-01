/**
 * One of the app's clay stickers. Decorative by default (alt=""); pass alt
 * when the image carries meaning the surrounding text doesn't.
 */
export function Sticker({
  name,
  size = 72,
  alt = "",
  className = "",
}: {
  name: string;
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/art/stickers/${name}.webp`}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`h-auto shrink-0 drop-shadow-[0_4px_8px_rgba(41,46,56,0.16)] ${className}`}
      style={{ width: size }}
    />
  );
}
