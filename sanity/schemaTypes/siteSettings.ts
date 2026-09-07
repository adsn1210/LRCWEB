import { defineField, defineType } from "sanity";

// Documento singleton (uno solo, ver sanity/structure.ts) para ajustes globales del sitio que LRC
// pueda editar sin tocar código — de momento solo la imagen del Hero de la Home. Ver Docs/BACKEND.md
// sección 3.
export default defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagen de fondo del Hero (Home)",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
