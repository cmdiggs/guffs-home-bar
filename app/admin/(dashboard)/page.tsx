import { getCocktails } from "@/lib/db";
import { CocktailForm } from "@/components/admin/CocktailForm";
import { CocktailsList } from "@/components/admin/CocktailsList";

export default async function AdminCocktailsPage() {
  const cocktails = await getCocktails();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Cocktails</h1>
      <p className="mt-1 font-sans text-ink/70">Add and edit cocktails.</p>
      <CocktailForm />
      <CocktailsList initialCocktails={cocktails} />
    </div>
  );
}
