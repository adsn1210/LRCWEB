import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { services } from "@/lib/content/services";
import { materials } from "@/lib/content/materials";

// TODO: extender con las rutas dinámicas de proyectos (Sanity) en cuanto existan fichas reales
// (ver Docs/03-arquitectura-informacion-sitemap.md). Servicios y materiales ya se generan a
// partir del mismo contenido hardcodeado que usan sus páginas.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/proyectos`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/sobre-nosotros`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contacto`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/aviso-legal`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/politica-de-privacidad`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/politica-de-cookies`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/servicios/${s.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const materialRoutes: MetadataRoute.Sitemap = materials.map((m) => ({
    url: `${SITE_URL}/materiales/${m.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...materialRoutes];
}
