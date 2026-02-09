import { getHomies } from "@/lib/db";
import { HomieForm } from "@/components/admin/HomieForm";
import { HomiesList } from "@/components/admin/HomiesList";

export default async function AdminHomiesPage() {
  const homies = getHomies();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">The Homies</h1>
      <p className="mt-1 font-sans text-ink/70">Add and edit homies.</p>
      <HomieForm />
      <HomiesList initialHomies={homies} />
    </div>
  );
}
