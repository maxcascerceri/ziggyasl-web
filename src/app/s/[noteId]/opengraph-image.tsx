import { ImageResponse } from "next/og";
import { fetchSignNote, isSignNoteId } from "@/lib/signNote";

export const runtime = "nodejs";
export const revalidate = 60;
export const size = { width: 600, height: 600 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ noteId: string }>;
};

export default async function OpenGraphImage({ params }: ImageProps) {
  const { noteId } = await params;
  const note = isSignNoteId(noteId) ? await fetchSignNote(noteId) : null;

  if (note && !note.isExpired && note.posterURL) {
    const res = await fetch(note.posterURL);
    if (res.ok) {
      const bytes = Buffer.from(await res.arrayBuffer());
      const mime = res.headers.get("content-type") ?? "image/jpeg";
      const src = `data:${mime};base64,${bytes.toString("base64")}`;
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              background: "#000",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={src}
              alt=""
              width={600}
              height={600}
              style={{ objectFit: "cover" }}
            />
          </div>
        ),
        { ...size },
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F9FF",
          color: "#292e38",
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        Ziggy
      </div>
    ),
    { ...size },
  );
}
