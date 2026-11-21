import Image from "next/image";
import type { ReactNode } from "react";

type EditorialIntroProps = {
  label: string;
  title: string;
  children?: ReactNode;
  image: "house" | "apartment" | "office";
};

export function EditorialIntro({ label, title, image, children }: EditorialIntroProps) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-7 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-[.95fr_1.05fr] lg:gap-16 lg:py-18">
      <div>
        <p className="text-sm font-semibold text-pine">{label}</p>
        <h1 className="mt-3 max-w-[17ch] text-[clamp(2.45rem,5.2vw,4.65rem)] font-semibold leading-[1.04] tracking-[-.065em] text-ink">{title}</h1>
        {children}
      </div>
      <div className="relative aspect-[1.85] overflow-hidden rounded-[1.65rem] bg-sage">
        <Image src={`/demo/${image}.jpg`} alt="" fill sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw" className="object-cover" loading="eager" />
      </div>
    </section>
  );
}
