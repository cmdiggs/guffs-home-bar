import { Button } from "@/components/ui/button"
import { GuffsLogo } from '@/components/guffs-logo'
import { UploadPhotoForm } from '@/components/upload-photo-form'
import { PhotoGrid } from '@/components/photo-lightbox'
import { getCocktails, getMemorabilia, getVisitorPhotos } from '@/lib/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wine, Trophy } from 'lucide-react'
import Image from 'next/image'

export default async function HomePage() {
  const cocktails = await getCocktails()
  const memorabilia = await getMemorabilia()
  const visitorPhotos = await getVisitorPhotos()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Fixed behind the card */}
      <section className="sticky top-0 z-0 h-screen flex items-center justify-center bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Image
            src="/guffs-logo.svg"
            alt="Guffs"
            width={600}
            height={200}
            priority
            className="w-full max-w-2xl h-auto"
          />
        </div>
      </section>

      {/* Givin' No Guffs - Card that slides over the hero */}
      <section className="relative z-10 min-h-screen bg-card rounded-t-3xl -mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-card-foreground mb-12 text-balance">
            {"Givin' No Guffs"}
          </h2>

          {/* Two column layout for the story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Story coming soon...
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Story coming soon...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Everything below continues in the card */}
      <div className="relative z-10 bg-card">

      {/* Cocktails Section */}
      <section className="container mx-auto px-4 py-12" id="cocktails">
        <div className="flex items-center gap-3 mb-8">
          <Wine className="h-6 w-6 text-accent" />
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Guffs&apos; Cocktails
          </h2>
        </div>

        {cocktails.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No cocktails yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cocktails.map((cocktail) => (
              <Card key={cocktail.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
                {cocktail.image_url && (
                  <div className="relative h-48 w-full bg-secondary">
                    <Image
                      src={cocktail.image_url || "/placeholder.svg"}
                      alt={cocktail.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-serif text-xl">{cocktail.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {cocktail.friend_name}
                    </Badge>
                  </div>
                  {cocktail.description && (
                    <CardDescription className="text-base leading-relaxed">
                      {cocktail.description}
                    </CardDescription>
                  )}
                </CardHeader>
                {cocktail.ingredients && cocktail.ingredients.length > 0 && (
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Ingredients:</p>
                      <ul className="text-sm text-muted-foreground space-y-0.5">
                        {cocktail.ingredients.map((ingredient, idx) => (
                          <li key={idx}>• {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Approved Photos Section */}
      {visitorPhotos.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
            The Homies
          </h2>
          <PhotoGrid photos={visitorPhotos} />
          {visitorPhotos.length > 8 && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" size="lg">
                See More →
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Memorabilia Section */}
      <section className="container mx-auto px-4 py-12 bg-secondary/30" id="memorabilia">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-6 w-6 text-accent" />
          <h2 className="font-serif text-3xl font-bold text-foreground">
            The Collection
          </h2>
        </div>

        {memorabilia.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No memorabilia featured yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memorabilia.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {item.image_url && (
                    <div className="relative h-64 md:h-auto md:w-1/2 bg-secondary">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className={item.image_url ? 'md:w-1/2' : 'w-full'}>
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <CardTitle className="font-serif text-xl flex-1">
                          {item.title}
                        </CardTitle>
                        {item.featured && (
                          <Badge className="bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>
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

      {/* Upload Photo Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <UploadPhotoForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Guffs. All rights reserved.</p>
        </div>
      </footer>

      </div>{/* Close card wrapper */}
    </div>
  )
}
