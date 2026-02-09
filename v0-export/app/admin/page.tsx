import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminCocktails } from '@/components/admin/admin-cocktails'
import { AdminMemorabilia } from '@/components/admin/admin-memorabilia'
import { AdminPhotos } from '@/components/admin/admin-photos'
import { Button } from '@/components/ui/button'
import { GuffsLogo } from '@/components/guffs-logo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <GuffsLogo />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={signOut}>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="cocktails" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
            <TabsTrigger value="memorabilia">Memorabilia</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="cocktails">
            <AdminCocktails />
          </TabsContent>

          <TabsContent value="memorabilia">
            <AdminMemorabilia />
          </TabsContent>

          <TabsContent value="photos">
            <AdminPhotos />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
