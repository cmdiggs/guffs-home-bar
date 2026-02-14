"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Homie, Submission } from "@/lib/db";
import { ImageLightbox } from "@/components/ImageLightbox";

export function HomiesSection() {
  const [homies, setHomies] = useState<Homie[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; rotation?: number } | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/homies").then((r) => r.json()), fetch("/api/submissions/approved").then((r) => r.json())])
      .then(([homiesData, submissionsData]) => {
        setHomies(Array.isArray(homiesData) ? homiesData : []);
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      })
      .catch(() => {
        setHomies([]);
        setSubmissions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (homies.length === 0 && submissions.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="font-sans text-3xl font-bold text-foreground mb-8">
        The Homies
      </h2>

      {/* Single slider: backend homies first, then approved visitor photos — same style as Memorabilia */}
      <div
        className="visitor-photos-slider flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {homies.map((h) => (
          <div
            key={`homie-${h.id}`}
            className="relative shrink-0 w-[85vw] max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-secondary snap-center snap-always md:w-80 cursor-pointer"
            onClick={() => setLightbox({ src: h.imagePath ?? "", alt: h.name, rotation: (h as { imageRotation?: number }).imageRotation })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setLightbox({ src: h.imagePath ?? "", alt: h.name, rotation: (h as { imageRotation?: number }).imageRotation })}
            aria-label="View full size"
          >
            {h.imagePath ? (
              <>
                <div className="h-full w-full" style={{ transform: `rotate(${(h as { imageRotation?: number }).imageRotation ?? 0}deg)`, transformOrigin: "center center" }}>
                  <Image
                    src={h.imagePath}
                    alt={h.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, 320px"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white pointer-events-none">
                  <p className="font-semibold">{h.name}</p>
                  {h.title && <p className="text-sm opacity-90">{h.title}</p>}
                  {h.description && (
                    <p className="text-sm mt-0.5 line-clamp-2 opacity-90">{h.description}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground p-4">
                <span className="text-4xl font-semibold">{h.name.charAt(0)}</span>
                <p className="font-semibold mt-2">{h.name}</p>
                {h.description && <p className="text-sm line-clamp-2 mt-0.5">{h.description}</p>}
              </div>
            )}
          </div>
        ))}
        {submissions.map((s) => (
          <div
            key={`sub-${s.id}`}
            className="relative shrink-0 w-[85vw] max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-secondary snap-center snap-always md:w-80 cursor-pointer"
            onClick={() => setLightbox({ src: s.imagePath, alt: s.guestName ? `Photo by ${s.guestName}` : "Visitor photo", rotation: (s as { imageRotation?: number }).imageRotation })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setLightbox({ src: s.imagePath, alt: s.guestName ? `Photo by ${s.guestName}` : "Visitor photo", rotation: (s as { imageRotation?: number }).imageRotation })}
            aria-label="View full size"
          >
            <div className="h-full w-full" style={{ transform: `rotate(${(s as { imageRotation?: number }).imageRotation ?? 0}deg)`, transformOrigin: "center center" }}>
              <Image
                src={s.imagePath}
                alt={s.guestName ? `Photo by ${s.guestName}` : "Visitor photo"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 85vw, 320px"
              />
            </div>
            {(s.guestName || s.comment) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm pointer-events-none">
                {s.guestName && <span className="font-medium">{s.guestName}</span>}
                {s.guestName && s.comment && " · "}
                {s.comment && <span className="line-clamp-2">{s.comment}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

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
