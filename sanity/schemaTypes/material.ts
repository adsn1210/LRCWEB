import { defineField, defineType } from "sanity";

// Porcelánico, cuarzo compacto, granito. Ver Docs/BACKEND.md sección 3.
export default defineType({
  name: "material",
  title: "Material",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "varieties", type: "array", of: [{ type: "string" }] }),
  ],
});
