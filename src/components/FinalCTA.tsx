import { copy } from "@/lib/copy";
import { FadeIn } from "./Motion";
import { StoreButtons } from "./StoreButtons";
import { ZiggyMoment } from "./ZiggyMoment";

export function FinalCTA() {
  return (
    <section id="download" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <FadeIn>
        <div className="relative overflow-hidden rounded-[36px] bg-brand px-8 pb-16 pt-10 text-center shadow-card sm:pb-20">
          <ZiggyMoment size={280} className="mx-auto mb-2" />
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {copy.finalCta.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-lg font-semibold text-white/90">
            {copy.finalCta.subline}
          </p>
          <div className="mt-9 flex justify-center">
            <StoreButtons
              appStoreLabel={copy.finalCta.appStoreCta}
              playStoreLabel={copy.finalCta.playStoreCta}
              light
              className="lg:justify-center"
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
