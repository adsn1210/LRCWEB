import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export type BreadcrumbItem = { label: string; href?: string };

// Migas de pan (Docs/FRONTEND.md sección 5) + JSON-LD BreadcrumbList (Docs/BACKEND.md sección 5).
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Migas de pan" className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-700">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent-600">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
