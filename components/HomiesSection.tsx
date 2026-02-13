"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Homie, Submission } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      {/* Approved visitor photos – slider on mobile, horizontal scroll with snap */}
      {submissions.length > 0 && (
        <div className="mb-10">
          <div
            className="visitor-photos-slider flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {submissions.map((s) => (
              <div
                key={s.id}
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
        </div>
      )}

      {/* Homie cards */}
      {homies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homies.map((h) => (
            <Card key={h.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {h.imagePath ? (
                  <div
                    className="relative h-48 md:h-auto md:w-1/3 bg-secondary shrink-0 cursor-pointer"
                    onClick={() => setLightbox({ src: h.imagePath!, alt: h.name, rotation: (h as { imageRotation?: number }).imageRotation })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setLightbox({ src: h.imagePath!, alt: h.name, rotation: (h as { imageRotation?: number }).imageRotation })}
                    aria-label="View full size"
                  >
                    <div className="h-full w-full" style={{ transform: `rotate(${(h as { imageRotation?: number }).imageRotation ?? 0}deg)`, transformOrigin: "center center" }}>
                      <Image
                        src={h.imagePath}
                        alt={h.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 240px"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-l-lg bg-secondary font-sans text-3xl text-muted-foreground">
                    {h.name.charAt(0)}
                  </div>
                )}
                <div className={h.imagePath ? "md:w-2/3" : "w-full"}>
                  <CardHeader>
                    <CardTitle className="font-sans text-xl">{h.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{h.description}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
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
