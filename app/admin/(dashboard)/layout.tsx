import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
