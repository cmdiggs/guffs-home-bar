"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Cocktail } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { CocktailDetail } from "@/components/CocktailDetail";

type Props = {
  /** When set, show only this many cocktails and a "See More Cocktails" link. Omit for full list. */
  limit?: number;
};

export function CocktailBookList({ limit }: Props) {
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

  const displayList = limit != null ? cocktails.slice(0, limit) : cocktails;
  const hasMore = limit != null && cocktails.length > limit;

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
        <div className="max-w-2xl">
          <ul className="divide-y divide-border/50">
            {displayList.map((cocktail) => {
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
          {hasMore && (
            <div className="pt-6">
              <Link
                href="/cocktails"
                className="inline-flex items-center gap-2 font-sans text-lg font-medium text-foreground hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                See More Cocktails
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}

      {selected && (
        <CocktailDetail cocktail={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
