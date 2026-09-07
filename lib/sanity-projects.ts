import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient, urlFor } from "@/lib/sanity";
import type { ProjectCardData } from "@/components/marketing/ProjectCard";
import type { MaterialSlug, ServiceSlug } from "@/lib/slugs";

type RawProject = {
  _id: string;
  title: string;
  municipality: string | null;
  featured: boolean | null;
  serviceSlug: string | null;
  serviceLabel: string | null;
  materialSlug: string | null;
  materialLabel: string | null;
  beforeImage: SanityImageSource;
  afterImage: SanityImageSource;
};

export type SanityProject = {
  id: string;
  title: string;
  municipality: string | null;
  featured: boolean;
  serviceSlug: ServiceSlug | null;
  serviceLabel: string | null;
  materialSlug: MaterialSlug | null;
  materialLabel: string | null;
  beforeImageUrl: string;
  afterImageUrl: string;
};

// Proyectos con foto de antes Y de después ya subidas (ver descripción de esos campos en
// sanity/schemaTypes/project.ts) — un proyecto sin ambas fotos no se muestra en ningún sitio
// público. Si Sanity no responde, la web sigue funcionando sin proyectos en vez de romperse.
export async function getProjects(): Promise<SanityProject[]> {
  try {
    const raw = await sanityClient.fetch<RawProject[]>(
      `*[_type == "project" && defined(beforeImage) && defined(afterImage)] | order(_createdAt desc) {
        _id,
        title,
        municipality,
        featured,
        "serviceSlug": service->slug.current,
        "serviceLabel": service->title,
        "materialSlug": material->slug.current,
        "materialLabel": material->title,
        beforeImage,
        afterImage
      }`,
    );

    return raw.map((p) => ({
      id: p._id,
      title: p.title,
      municipality: p.municipality,
      featured: p.featured ?? false,
      serviceSlug: (p.serviceSlug as ServiceSlug) ?? null,
      serviceLabel: p.serviceLabel,
      materialSlug: (p.materialSlug as MaterialSlug) ?? null,
      materialLabel: p.materialLabel,
      beforeImageUrl: urlFor(p.beforeImage).width(800).height(600).fit("crop").url(),
      afterImageUrl: urlFor(p.afterImage).width(800).height(600).fit("crop").url(),
    }));
  } catch (error) {
    console.error("[sanity] error obteniendo proyectos", error);
    return [];
  }
}

export function toProjectCardData(p: SanityProject): ProjectCardData {
  return {
    title: p.title,
    tagLine: [p.serviceLabel, p.materialLabel, p.municipality].filter(Boolean).join(" · "),
    beforeImageUrl: p.beforeImageUrl,
    afterImageUrl: p.afterImageUrl,
  };
}
