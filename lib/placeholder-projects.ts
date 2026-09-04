import type { ProjectCardData } from "@/components/marketing/ProjectCard";
import type { MaterialSlug, ServiceSlug } from "@/lib/slugs";

export type PlaceholderProject = {
  id: string;
  title: string;
  serviceSlug: ServiceSlug;
  serviceLabel: string;
  materialSlug?: MaterialSlug;
  materialLabel?: string;
  municipality: string;
  beforeGradient: string;
  afterGradient: string;
};

// TODO: sustituir por proyectos reales desde Sanity (documento `project`, ver Docs/BACKEND.md
// sección 3) en cuanto LRC facilite fotografías; de momento se muestran con degradados de
// textura como placeholder, igual que en la Home.
export const placeholderProjects: PlaceholderProject[] = [
  {
    id: "reforma-cocina-alcorcon",
    title: "Reforma de cocina",
    serviceSlug: "reformas-de-cocina",
    serviceLabel: "Reforma de cocina",
    materialSlug: "cuarzo-compacto",
    materialLabel: "Cuarzo compacto",
    municipality: "Alcorcón",
    beforeGradient: "linear-gradient(135deg,#8d867c,#5f584f)",
    afterGradient: "linear-gradient(135deg,#efe9e4,#d6a99a 55%,#c98f7c)",
  },
  {
    id: "encimera-porcelanico-getafe",
    title: "Encimera de porcelánico",
    serviceSlug: "encimeras-de-cocina",
    serviceLabel: "Encimeras de cocina",
    materialSlug: "porcelanico",
    materialLabel: "Porcelánico",
    municipality: "Getafe",
    beforeGradient: "linear-gradient(135deg,#9a948a,#665f55)",
    afterGradient: "linear-gradient(135deg,#e9e5dd,#cec7ba 45%,#e2ddd2)",
  },
  {
    id: "reforma-bano-pozuelo",
    title: "Reforma de baño",
    serviceSlug: "reformas-de-bano",
    serviceLabel: "Reforma de baño",
    materialSlug: "granito",
    materialLabel: "Granito",
    municipality: "Pozuelo de Alarcón",
    beforeGradient: "linear-gradient(135deg,#8b8f92,#54585c)",
    afterGradient: "linear-gradient(135deg,#dfe1e2,#9fa5aa 50%,#6f757a)",
  },
  {
    id: "reforma-integral-vivienda-leganes",
    title: "Reforma integral de vivienda",
    serviceSlug: "reformas-integrales",
    serviceLabel: "Reforma integral",
    municipality: "Leganés",
    beforeGradient: "linear-gradient(135deg,#93897c,#5c5348)",
    afterGradient: "linear-gradient(135deg,#e5e1da,#cecbc4 50%,#b9b2a6)",
  },
  {
    id: "encimera-cuarzo-mostoles",
    title: "Encimera de cuarzo compacto",
    serviceSlug: "encimeras-de-cocina",
    serviceLabel: "Encimeras de cocina",
    materialSlug: "cuarzo-compacto",
    materialLabel: "Cuarzo compacto",
    municipality: "Móstoles",
    beforeGradient: "linear-gradient(135deg,#8d867c,#5f584f)",
    afterGradient: "linear-gradient(135deg,#efe9e4,#d6a99a 55%,#c98f7c)",
  },
  {
    id: "reforma-cocina-las-rozas",
    title: "Reforma de cocina",
    serviceSlug: "reformas-de-cocina",
    serviceLabel: "Reforma de cocina",
    materialSlug: "porcelanico",
    materialLabel: "Porcelánico",
    municipality: "Las Rozas de Madrid",
    beforeGradient: "linear-gradient(135deg,#9a948a,#665f55)",
    afterGradient: "linear-gradient(135deg,#e9e5dd,#cec7ba 45%,#e2ddd2)",
  },
  {
    id: "reforma-local-comercial-madrid",
    title: "Reforma de local comercial",
    serviceSlug: "reformas-integrales",
    serviceLabel: "Reforma integral",
    municipality: "Madrid capital",
    beforeGradient: "linear-gradient(135deg,#93897c,#5c5348)",
    afterGradient: "linear-gradient(135deg,#e5e1da,#cecbc4 50%,#b9b2a6)",
  },
  {
    id: "encimera-granito-alcobendas",
    title: "Encimera de granito",
    serviceSlug: "encimeras-de-cocina",
    serviceLabel: "Encimeras de cocina",
    materialSlug: "granito",
    materialLabel: "Granito",
    municipality: "Alcobendas",
    beforeGradient: "linear-gradient(135deg,#8b8f92,#54585c)",
    afterGradient: "linear-gradient(135deg,#dfe1e2,#9fa5aa 50%,#6f757a)",
  },
  {
    id: "reforma-bano-getafe",
    title: "Reforma de baño",
    serviceSlug: "reformas-de-bano",
    serviceLabel: "Reforma de baño",
    materialSlug: "cuarzo-compacto",
    materialLabel: "Cuarzo compacto",
    municipality: "Getafe",
    beforeGradient: "linear-gradient(135deg,#8d867c,#5f584f)",
    afterGradient: "linear-gradient(135deg,#efe9e4,#d6a99a 55%,#c98f7c)",
  },
];

export function getProjectsByService(serviceSlug: ServiceSlug, limit = 3): PlaceholderProject[] {
  return placeholderProjects.filter((p) => p.serviceSlug === serviceSlug).slice(0, limit);
}

export function getProjectsByMaterial(materialSlug: MaterialSlug, limit = 3): PlaceholderProject[] {
  return placeholderProjects.filter((p) => p.materialSlug === materialSlug).slice(0, limit);
}

export function toProjectCardData(p: PlaceholderProject): ProjectCardData {
  return {
    title: p.title,
    tagLine: [p.serviceLabel, p.materialLabel, p.municipality].filter(Boolean).join(" · "),
    beforeGradient: p.beforeGradient,
    afterGradient: p.afterGradient,
  };
}
