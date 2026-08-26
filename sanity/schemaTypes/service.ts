import { defineField, defineType } from "sanity";

// Encimeras, reformas de cocina/baño, reformas integrales. Ver Docs/BACKEND.md sección 3
// y Docs/03-arquitectura-informacion-sitemap.md para los slugs y el mapa del sitio.
export default defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "process", type: "array", of: [{ type: "block" }] }),
  ],
});
