import type { Metadata } from "next";

// Metadatos por página (Docs/BACKEND.md sección 5): title, description, URL canónica y Open Graph
// en un único sitio. Next fusiona `openGraph` de forma superficial (el de la página sustituye
// entero al del layout), así que no basta con definirlo en el layout raíz: cada página lo genera
// aquí con su propio título y URL. Las rutas son relativas y se resuelven contra `metadataBase`
// (SITE_URL, ver app/layout.tsx), de modo que el dominio canónico solo se decide en lib/site.ts.
// La imagen es la misma para todo el sitio (diseño fuente en scripts/og-image/).
export const SITE_NAME = "La Reina de la Casa";

const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "La Reina de la Casa · Encimeras y reformas en Madrid",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [OG_IMAGE],
    },
  };
}
