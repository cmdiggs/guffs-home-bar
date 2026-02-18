"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { WhatsNew } from "@/lib/db";

export function WhatsNewSection() {
  const [items, setItems] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/whats-new")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12" id="whats-new">
      <div className="flex items-center gap-3 mb-8">
        <svg className="h-6 w-6 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <h2 className="font-sans text-3xl font-bold text-foreground">
          What&apos;s New at Guffs
        </h2>
      </div>

      <div
        className="visitor-photos-slider flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="shrink-0 w-[85vw] max-w-md rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden flex flex-col snap-center snap-always md:w-96"
          >
            <div className="relative w-full aspect-[3/4] bg-secondary/30 shrink-0">
              <div
                style={{ transform: `rotate(${item.imageRotation ?? 0}deg)`, transformOrigin: "center center" }}
                className="h-full w-full"
              >
                <Image
                  src={item.imagePath}
                  alt="Featured"
                  fill
                  className="object-contain object-center p-4"
                  sizes="(max-width: 768px) 85vw, 384px"
                />
              </div>
            </div>
            <div className="flex-1 p-5 flex flex-col justify-center min-h-0">
              <p className="font-sans text-card-foreground/90 text-sm leading-relaxed whitespace-pre-line line-clamp-6">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
