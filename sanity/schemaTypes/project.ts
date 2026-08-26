import { defineField, defineType } from "sanity";

// Ver Docs/BACKEND.md sección 3.
export default defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "service", type: "reference", to: [{ type: "service" }] }),
    defineField({ name: "material", type: "reference", to: [{ type: "material" }] }),
    defineField({ name: "municipality", type: "string" }), // ej. "Alcorcón" — sin dirección exacta
    defineField({ name: "description", type: "text" }),
    defineField({ name: "beforeImage", type: "image" }),
    defineField({ name: "afterImage", type: "image" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "featured", type: "boolean" }), // para destacar en home
  ],
});
