import { createClient } from "@sanity/client";

// Ver Docs/BACKEND.md secciones 2-3. Variables en .env.local (plantilla: .env.example).
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: true,
});
