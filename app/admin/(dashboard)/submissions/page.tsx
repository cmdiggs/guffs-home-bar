import { SubmissionsList } from "@/components/admin/SubmissionsList";
import { getSubmissions } from "@/lib/db";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Guest photos</h1>
      <p className="mt-1 font-sans text-ink/70">Photos uploaded by visitors at the bar.</p>
      <SubmissionsList initialSubmissions={submissions} />
    </div>
  );
}
