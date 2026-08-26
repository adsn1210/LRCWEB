import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lareinadelacasa.com";

// TODO: extender con las rutas dinámicas de servicios/materiales/proyectos (Sanity)
// a medida que se construyan en la Fase 2 (ver Docs/03-arquitectura-informacion-sitemap.md).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
