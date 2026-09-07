import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

// Ver Docs/BACKEND.md secciones 2-3. Variables en .env.local (plantilla: .env.example).
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: true,
});

const imageBuilder = createImageUrlBuilder(sanityClient);

// Construye la URL de una imagen de Sanity (p. ej. `siteSettings.heroImage`). Ver
// https://www.sanity.io/docs/image-url
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}
