import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
// `siteSettings` es un singleton (un único documento con id fijo "siteSettings"): se saca de la
// lista genérica de tipos de documento y se muestra como una entrada de edición directa, para que
// nadie pueda crear una segunda instancia por error.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Ajustes del sitio')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteSettings'),
    ])
