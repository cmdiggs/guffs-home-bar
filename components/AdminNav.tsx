"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Cocktails" },
  { href: "/admin/homies", label: "Homies" },
  { href: "/admin/memorabilia", label: "Memorabilia" },
  { href: "/admin/submissions", label: "Submissions" },
];

export function AdminNav() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <nav className="border-b border-black/10 bg-white/80">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/admin" className="font-display text-lg text-ink hover:underline">
          Guffs Admin
        </Link>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-sans text-sm text-ink/70 hover:text-ink"
          >
            {label}
          </Link>
        ))}
        <Link href="/" className="font-sans text-sm text-ink/70 hover:text-ink">
          View site →
        </Link>
        <button
          type="button"
          onClick={logout}
          className="ml-auto font-sans text-sm text-ink/70 hover:text-ink"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
