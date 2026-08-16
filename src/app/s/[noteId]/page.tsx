import type { Metadata } from "next";
import { AppStoreButton } from "@/components/AppStoreButton";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";
import {
  fetchSignNote,
  isSignNoteId,
  reportMailURL,
  ziggyOpenURL,
} from "@/lib/signNote";
import { SignNoteHeader } from "./SignNoteHeader";
import { SignNotePlayer } from "./SignNotePlayer";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ noteId: string }>;
};

const genericTitle = "Ziggy";
const genericDescription = copy.note.expiredTitle;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { noteId } = await params;
  const robots = { index: false, follow: false } as const;

  if (!isSignNoteId(noteId)) {
    return unavailableMetadata(noteId, robots);
  }

  const note = await fetchSignNote(noteId);
  if (!note || note.isExpired) {
    return unavailableMetadata(noteId, robots);
  }

  const title = `${note.senderName} sent you a sign`;
  const description = note.gloss
    ? `${note.senderName} signed ${note.gloss}.`
    : `${note.senderName} sent you a sign.`;

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      url: `https://www.ziggyasl.com/s/${note.id}`,
      siteName: "Ziggy",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

function unavailableMetadata(
  noteId: string,
  robots: { index: false; follow: false },
): Metadata {
  return {
    title: genericTitle,
    description: genericDescription,
    robots,
    openGraph: {
      title: genericTitle,
      description: genericDescription,
      url: `https://www.ziggyasl.com/s/${noteId}`,
      siteName: "Ziggy",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: genericTitle,
      description: genericDescription,
    },
  };
}

export default async function SignNotePage({ params }: PageProps) {
  const { noteId } = await params;
  const note = isSignNoteId(noteId) ? await fetchSignNote(noteId) : null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas">
      <SignNoteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-12 pt-8 sm:px-6">
        {!note || note.isExpired ? (
          <UnavailableState />
        ) : (
          <AvailableState
            senderName={note.senderName}
            gloss={note.gloss}
            clipURL={note.clipURL}
            posterURL={note.posterURL}
            isImage={note.isImage}
            noteId={note.id}
          />
        )}
      </main>
    </div>
  );
}

function AvailableState({
  senderName,
  gloss,
  clipURL,
  posterURL,
  isImage,
  noteId,
}: {
  senderName: string;
  gloss: string;
  clipURL: string;
  posterURL: string | null;
  isImage: boolean;
  noteId: string;
}) {
  return (
    <>
      <div className="text-center">
        <h1 className="text-pretty text-[1.85rem] font-bold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {senderName} sent you a sign.
        </h1>
        {gloss ? (
          <p className="mt-2 text-base font-medium text-secondary">{gloss}</p>
        ) : null}
      </div>

      <div className="mt-8">
        <SignNotePlayer
          src={clipURL}
          poster={posterURL}
          isImage={isImage}
          label={
            gloss
              ? `${senderName} signed ${gloss}`
              : copy.note.videoLabel
          }
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <AppStoreButton label={copy.note.getZiggy} />
        <a
          href={ziggyOpenURL(noteId)}
          className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-secondary transition-colors hover:text-ink"
        >
          {copy.note.openInApp}
        </a>
      </div>

      <QuietReport noteId={noteId} />
    </>
  );
}

function UnavailableState() {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/ziggy-teach.png"
        alt=""
        className="mt-6 h-36 w-auto"
      />
      <h1 className="mt-6 text-pretty text-[1.85rem] font-bold leading-tight tracking-tight text-ink">
        {copy.note.expiredTitle}
      </h1>
      <p className="mt-2 text-base text-secondary">{copy.note.expiredMessage}</p>
      <div className="mt-8">
        <AppStoreButton label={copy.note.getZiggy} />
      </div>
    </div>
  );
}

function QuietReport({ noteId }: { noteId: string }) {
  return (
    <p className="mt-10 text-center text-sm text-secondary/80">
      <a
        href={reportMailURL(noteId)}
        className="underline-offset-2 hover:text-ink hover:underline"
      >
        {copy.note.report}
      </a>
      <span className="mx-2 text-divider">·</span>
      <a
        href={links.privacyPath}
        className="underline-offset-2 hover:text-ink hover:underline"
      >
        {copy.footer.privacy}
      </a>
    </p>
  );
}
