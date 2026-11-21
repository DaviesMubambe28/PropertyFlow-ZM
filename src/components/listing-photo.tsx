"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { useState } from "react";

export function ListingPhoto({ src, title, sizes }: { src: string; title: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image src={src} alt={title} fill sizes={sizes} unoptimized className="object-cover" onError={() => setFailed(true)} />
  ) : (
    <span className="absolute inset-0 grid place-content-center justify-items-center gap-2 bg-tint text-sm text-quiet">
      <Building2 size={32} aria-hidden="true" />
      Photo unavailable
    </span>
  );
}
