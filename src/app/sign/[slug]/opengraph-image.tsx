import { ImageResponse } from "next/og";
import { allSigns, getSignBySlug, primaryCategory } from "@/lib/catalog";
import { signPosterURL } from "@/lib/firebasePublic";

export const alt = "ASL sign video from Ziggy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allSigns().map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sign = getSignBySlug(slug);
  const display = sign?.display ?? "ASL";
  const category = sign ? primaryCategory(sign)?.title : undefined;
  const poster = sign ? signPosterURL(sign.id) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #F7F9FF 0%, #CCE3FC 100%)",
          fontFamily: "sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#3B8CFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 34,
                fontWeight: 700,
              }}
            >
              Z
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#292E38" }}>Ziggy ASL</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#3B8CFF", letterSpacing: 2 }}>
              HOW TO SIGN
            </div>
            <div
              style={{
                fontSize: display.length > 18 ? 64 : 88,
                fontWeight: 800,
                color: "#292E38",
                lineHeight: 1.05,
                marginTop: 8,
              }}
            >
              {display}
            </div>
            <div style={{ fontSize: 30, color: "#576678", marginTop: 16 }}>
              {`in American Sign Language${category ? ` · ${category}` : ""}`}
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#576678" }}>Free video dictionary · ziggyasl.com</div>
        </div>
        {poster ? (
          <div
            style={{
              width: 520,
              height: 518,
              borderRadius: 36,
              overflow: "hidden",
              display: "flex",
              background: "#292E38",
              boxShadow: "0 28px 60px rgba(59,140,255,0.3)",
            }}
          >
            <img
              src={poster}
              alt=""
              width={520}
              height={518}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
