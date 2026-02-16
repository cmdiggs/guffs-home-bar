"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { WhatsNew } from "@/lib/db";

const ChevronLeft = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function WhatsNewSection() {
  const [items, setItems] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/whats-new")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  const item = items[current];
  const hasPrev = current > 0;
  const hasNext = current < items.length - 1;
  const showNav = items.length > 1;

  return (
    <section className="container mx-auto px-4 py-12" id="whats-new">
      <div className="flex items-center gap-3 mb-6">
        <svg className="h-6 w-6 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <h2 className="font-sans text-3xl font-bold text-foreground">
          What&apos;s New at Guffs
        </h2>
      </div>

      <div className="relative">
        {/* Left arrow */}
        {showNav && hasPrev && (
          <button
            onClick={() => setCurrent((c) => c - 1)}
            className="absolute left-0 top-1/2 z-10 -translate-x-3 -translate-y-1/2 rounded-full border border-border/50 bg-card p-2 shadow-md text-foreground hover:bg-secondary transition-colors md:-translate-x-5"
            aria-label="Previous item"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Card */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="relative w-full md:w-[40%] aspect-[3/4] md:aspect-auto md:min-h-[280px] bg-secondary/30 shrink-0">
            <div
              style={{ transform: `rotate(${item.imageRotation ?? 0}deg)`, transformOrigin: "center center" }}
              className="h-full w-full"
            >
              <Image
                src={item.imagePath}
                alt="Featured bottle"
                fill
                className="object-contain object-center p-4"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <p className="font-sans text-card-foreground/90 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>

        {/* Right arrow */}
        {showNav && hasNext && (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="absolute right-0 top-1/2 z-10 translate-x-3 -translate-y-1/2 rounded-full border border-border/50 bg-card p-2 shadow-md text-foreground hover:bg-secondary transition-colors md:translate-x-5"
            aria-label="Next item"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {showNav && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === current ? "bg-accent" : "bg-border"
              }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
