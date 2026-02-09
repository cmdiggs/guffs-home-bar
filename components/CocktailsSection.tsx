"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Cocktail } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CocktailDetail } from "./CocktailDetail";

export function CocktailsSection() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [selected, setSelected] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cocktails")
      .then((r) => r.json())
      .then((data) => setCocktails(Array.isArray(data) ? data : []))
      .catch(() => setCocktails([]))
      .finally(() => setLoading(false));
  }, []);

  const ingredientsList = (c: Cocktail) =>
    c.ingredients
      ? c.ingredients
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((s) => s.replace(/^[•\-]\s*/, ""))
      : [];

  return (
    <section className="container mx-auto px-4 py-12" id="cocktails">
      <div className="flex items-center gap-3 mb-8">
        <svg className="h-6 w-6 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          {/* Pixelated cocktail glass: bowl (stepped), stem, base */}
          <rect x="4" y="2" width="16" height="4" />
          <rect x="6" y="6" width="12" height="4" />
          <rect x="8" y="10" width="8" height="4" />
          <rect x="10" y="14" width="4" height="6" />
          <rect x="8" y="20" width="8" height="2" />
        </svg>
        <h2 className="font-sans text-3xl font-bold text-foreground">
          Guffs&apos; Cocktails
        </h2>
      </div>

      {loading ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading…</p>
          </CardContent>
        </Card>
      ) : cocktails.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No cocktails yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cocktails.map((cocktail) => {
            const ingredients = ingredientsList(cocktail);
            const hasImage = cocktail.imagePath && cocktail.imagePath !== "/guffs-logo.svg";
            return (
              <Card
                key={cocktail.id}
                className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelected(cocktail)}
              >
                {hasImage && (
                  <div className="relative h-48 w-full bg-secondary">
                    <Image
                      src={cocktail.imagePath}
                      alt={cocktail.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-sans text-xl">{cocktail.name}</CardTitle>
                    {cocktail.friendName && (
                      <Badge variant="secondary" className="shrink-0">
                        {cocktail.friendName}
                      </Badge>
                    )}
                  </div>
                  {cocktail.description && (
                    <CardDescription className="text-base leading-relaxed line-clamp-3">
                      {cocktail.description}
                    </CardDescription>
                  )}
                </CardHeader>
                {ingredients.length > 0 && (
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Ingredients:</p>
                      <ul className="text-sm text-muted-foreground space-y-0.5 columns-2 gap-x-3">
                        {ingredients.map((ingredient, idx) => (
                          <li key={idx}>• {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {selected && (
        <CocktailDetail cocktail={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
