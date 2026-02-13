import { getMemorabilia } from "@/lib/db";
import { MemorabiliaForm } from "@/components/admin/MemorabiliaForm";
import { MemorabiliaList } from "@/components/admin/MemorabiliaList";

export default async function AdminMemorabiliaPage() {
  const items = await getMemorabilia();
  const itemsPlain = JSON.parse(JSON.stringify(items)) as typeof items;
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Memorabilia</h1>
      <p className="mt-1 font-sans text-ink/70">Add and edit featured sports memorabilia.</p>
      <MemorabiliaForm />
      <MemorabiliaList initialItems={itemsPlain} />
    </div>
  );
}
