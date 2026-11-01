import { CHECKED_LABEL, TRADEMARK_NOTE } from "@/content/compare/apps";
import { links } from "@/lib/links";

/** Header row plus body rows; the first cell of each row is the row label. */
export function CompareTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="table-scroll rounded-[24px] bg-white px-4 py-2 shadow-card outline outline-1 -outline-offset-1 outline-black/5 sm:px-6">
      <table>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={i}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Disclosure() {
  return (
    <blockquote>
      We make Ziggy, so we&apos;re biased. We&apos;ve described every app as fairly as we can and checked
      each one&apos;s features in {CHECKED_LABEL}. If something has changed, email{" "}
      <a href={links.contact}>support@ziggyasl.com</a>
      {" "}and we&apos;ll update this page.
    </blockquote>
  );
}

export function SourcesAndTrademarks({ sources }: { sources: string[] }) {
  return (
    <>
      <h2>Sources</h2>
      <p>Features checked {CHECKED_LABEL} against each company&apos;s own website and app store listings:</p>
      <ul>
        {sources.map((s) => (
          <li key={s}>
            <a href={s} rel="nofollow noopener" target="_blank">
              {s.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-secondary">{TRADEMARK_NOTE}</p>
    </>
  );
}
