import Link from "next/link";
import Image from "next/image";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";

export function SignNoteHeader() {
  return (
    <header className="px-5 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-md items-center justify-center">
        <Link href={links.home} className="flex min-h-11 items-center gap-2.5">
          <Image
            src="/brand/app-icon.png"
            alt=""
            width={44}
            height={44}
            sizes="44px"
            className="h-11 w-11 rounded-[12px] outline outline-1 -outline-offset-1 outline-black/10"
          />
          <span className="text-[1.45rem] font-bold leading-none tracking-tight text-ink">
            {copy.brand}
            <span className="text-brand">.</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
