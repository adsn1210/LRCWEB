import { defineField, defineType } from "sanity";

// Ver Docs/BACKEND.md sección 3.
export default defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "text", type: "text" }),
    defineField({ name: "photo", type: "image" }),
    defineField({ name: "relatedProject", type: "reference", to: [{ type: "project" }] }),
  ],
});
