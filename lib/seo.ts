import type { Metadata } from "next";

// Metadatos por página (Docs/BACKEND.md sección 5): title, description, URL canónica y Open Graph
// en un único sitio. Next fusiona `openGraph` de forma superficial (el de la página sustituye
// entero al del layout), así que no basta con definirlo en el layout raíz: cada página lo genera
// aquí con su propio título y URL. Las rutas son relativas y se resuelven contra `metadataBase`
// (SITE_URL, ver app/layout.tsx), de modo que el dominio canónico solo se decide en lib/site.ts.
export const SITE_NAME = "La Reina de la Casa";

const DEFAULT_OG_IMAGE = "/images/servicios/encimeras-de-cocina.jpg";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function pageMetadata({ title, description, path, image = DEFAULT_OG_IMAGE }: PageMetadataInput): Metadata {
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
      images: [{ url: image, alt: title }],
    },
  };
}
