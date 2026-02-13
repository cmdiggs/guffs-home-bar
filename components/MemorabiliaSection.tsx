"use client";

import { useState } from "react";
import Image from "next/image";
import type { Memorabilia } from "@/lib/db";
import { ImageLightbox } from "@/components/ImageLightbox";

type Props = { items: Memorabilia[] };

export function MemorabiliaSection({ items }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; rotation?: number } | null>(null);

  return (
    <section className="container mx-auto px-4 py-12 bg-secondary/30" id="memorabilia">
      <div className="flex items-center gap-3 mb-8">
        <svg className="h-6 w-6 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        <h2 className="font-sans text-3xl font-bold text-foreground">
          The Collection
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card py-12 text-center">
          <p className="text-muted-foreground">No memorabilia featured yet. Check back soon!</p>
        </div>
      ) : (
        <div
          className="visitor-photos-slider flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="relative shrink-0 w-[85vw] max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-secondary snap-center snap-always md:w-80 cursor-pointer"
              onClick={() => setLightbox({ src: item.imagePath, alt: item.title, rotation: item.imageRotation })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setLightbox({ src: item.imagePath, alt: item.title, rotation: item.imageRotation })}
              aria-label="View full size"
            >
              <div className="h-full w-full" style={{ transform: `rotate(${item.imageRotation ?? 0}deg)`, transformOrigin: "center center" }}>
                <Image
                  src={item.imagePath}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 85vw, 320px"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white pointer-events-none">
                <p className="font-semibold">{item.title}</p>
                {item.description && (
                  <p className="text-sm mt-0.5 line-clamp-2 opacity-90">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageLightbox
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        rotation={lightbox?.rotation}
      />
    </section>
  );
}
