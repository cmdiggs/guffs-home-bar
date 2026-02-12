import Link from "next/link";

const CameraIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
  </svg>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex justify-end px-4 py-4">
        <Link
          href="/#share-your-visit"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-card-foreground hover:text-card-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          <CameraIcon />
          Share your visit
        </Link>
      </div>
    </header>
  );
}
