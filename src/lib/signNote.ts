import { firebasePublic, storageMediaURL } from "./firebasePublic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isSignNoteId(value: string): boolean {
  return UUID_RE.test(value);
}

export type SignNoteRecord = {
  id: string;
  senderName: string;
  gloss: string;
  clipPath: string;
  posterURL: string | null;
  expiresAt: Date;
  clipURL: string;
  isImage: boolean;
  isExpired: boolean;
};

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
};

function fieldString(
  fields: Record<string, FirestoreValue>,
  key: string,
): string {
  return fields[key]?.stringValue?.trim() ?? "";
}

export async function fetchSignNote(
  noteId: string,
): Promise<SignNoteRecord | null> {
  if (!isSignNoteId(noteId)) return null;

  const url =
    `https://firestore.googleapis.com/v1/projects/${firebasePublic.projectId}` +
    `/databases/(default)/documents/signNotes/${encodeURIComponent(noteId)}` +
    `?key=${encodeURIComponent(firebasePublic.apiKey)}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    fields?: Record<string, FirestoreValue>;
  };
  const fields = json.fields;
  if (!fields) return null;

  const clipPath = fieldString(fields, "clipPath");
  if (!clipPath) return null;

  const expiresRaw = fields.expiresAt?.timestampValue;
  const expiresAt = expiresRaw ? new Date(expiresRaw) : new Date(0);
  const ext = clipPath.split(".").pop()?.toLowerCase() ?? "";
  const isImage = ext === "png" || ext === "jpg" || ext === "jpeg";
  const posterURL = fieldString(fields, "posterURL") || null;

  return {
    id: noteId,
    senderName: fieldString(fields, "senderName") || "Someone",
    gloss: fieldString(fields, "gloss"),
    clipPath,
    posterURL,
    expiresAt,
    clipURL: storageMediaURL(clipPath),
    isImage,
    isExpired: expiresAt.getTime() < Date.now(),
  };
}

export function reportMailURL(noteId: string): string {
  const subject = encodeURIComponent("Ziggy sign note report");
  const body = encodeURIComponent(
    `I'd like to report this sign note.\n\nNote id: ${noteId}\n`,
  );
  return `mailto:support@ziggyasl.com?subject=${subject}&body=${body}`;
}

export function ziggyOpenURL(noteId: string): string {
  return `ziggy://s/${noteId}`;
}
