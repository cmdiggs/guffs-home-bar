"use client";

import { useEffect, useState } from "react";
import type { Cocktail } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { CocktailDetail } from "@/components/CocktailDetail";

export function CocktailBookList() {
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

  const ingredientsLine = (c: Cocktail) =>
    c.ingredients
      ? c.ingredients
          .split("\n")
          .map((line) => line.trim().replace(/^[•\-]\s*/, ""))
          .filter(Boolean)
          .join(", ")
      : "";

  return (
    <>
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
        <ul className="max-w-2xl divide-y divide-border/50">
          {cocktails.map((cocktail) => {
            const ingredients = ingredientsLine(cocktail);
            return (
              <li key={cocktail.id}>
                <button
                  type="button"
                  onClick={() => setSelected(cocktail)}
                  className="w-full text-left py-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded -mx-1 px-1"
                >
                  <p className="font-sans text-2xl font-bold text-foreground">
                    {cocktail.name}
                  </p>
                  {cocktail.friendName && (
                    <p className="font-sans text-base text-muted-foreground mt-1">
                      {cocktail.friendName}
                    </p>
                  )}
                  {ingredients && (
                    <p className="font-sans text-sm text-muted-foreground/90 mt-1 truncate" title={ingredients}>
                      {ingredients}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <CocktailDetail cocktail={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
