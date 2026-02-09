import Image from "next/image";
import type { Memorabilia } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { items: Memorabilia[] };

export function MemorabiliaSection({ items }: Props) {
  return (
    <section className="container mx-auto px-4 py-12 bg-secondary/30" id="memorabilia">
      <div className="flex items-center gap-3 mb-8">
        <svg className="h-6 w-6 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        <h2 className="font-sans text-3xl font-bold text-foreground">
          The Collection
        </h2>
      </div>

      {items.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No memorabilia featured yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="relative h-64 md:h-auto md:w-1/2 bg-secondary">
                  <Image
                    src={item.imagePath}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                <div className="md:w-1/2">
                  <CardHeader>
                    <CardTitle className="font-sans text-xl flex-1">
                      {item.title}
                    </CardTitle>
                    {item.description && (
                      <CardDescription className="text-base leading-relaxed">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
