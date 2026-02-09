"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Homie } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomiesSection() {
  const [homies, setHomies] = useState<Homie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/homies")
      .then((r) => r.json())
      .then((data) => setHomies(Array.isArray(data) ? data : []))
      .catch(() => setHomies([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || homies.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="font-sans text-3xl font-bold text-foreground mb-8">
        The Homies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homies.map((h) => (
          <Card key={h.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
            <div className="md:flex">
              {h.imagePath ? (
                <div className="relative h-48 md:h-auto md:w-1/3 bg-secondary shrink-0">
                  <Image
                    src={h.imagePath}
                    alt={h.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-l-lg bg-secondary font-sans text-3xl text-muted-foreground">
                  {h.name.charAt(0)}
                </div>
              )}
              <div className={h.imagePath ? "md:w-2/3" : "w-full"}>
                <CardHeader>
                  <CardTitle className="font-sans text-xl">{h.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{h.title}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{h.description}</p>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
