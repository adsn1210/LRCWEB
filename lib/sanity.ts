import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Cliente de lectura de la web (Docs/BACKEND.md secciones 2-3). Comparte projectId/dataset/
// apiVersion con el Studio (sanity.config.ts) a través de sanity/env.ts, la única fuente de esa
// configuración. Variables en .env.local (plantilla: .env.example).
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: true,
});

const imageBuilder = createImageUrlBuilder(sanityClient);

// Construye la URL de una imagen de Sanity (p. ej. `siteSettings.heroImage`). Ver
// https://www.sanity.io/docs/image-url
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}
