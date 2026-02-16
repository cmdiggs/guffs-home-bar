import { getWhatsNewItems } from "@/lib/db";
import { WhatsNewForm } from "@/components/admin/WhatsNewForm";
import { WhatsNewList } from "@/components/admin/WhatsNewList";

export default async function AdminWhatsNewPage() {
  const items = await getWhatsNewItems();
  const itemsPlain = JSON.parse(JSON.stringify(items)) as typeof items;
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">What&apos;s New</h1>
      <p className="mt-1 font-sans text-ink/70">Add and manage featured bottles shown on the homepage.</p>
      <WhatsNewForm />
      <WhatsNewList initialItems={itemsPlain} />
    </div>
  );
}
