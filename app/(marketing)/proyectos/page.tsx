import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectGallery } from "@/components/marketing/ProjectGallery";
import { CtaBand } from "@/components/marketing/CtaBand";
import { placeholderProjects } from "@/lib/placeholder-projects";
import { services } from "@/lib/content/services";
import { materials } from "@/lib/content/materials";

export const metadata: Metadata = {
  title: "Proyectos | La Reina de la Casa",
  description:
    "Encimeras y reformas realizadas en Madrid y alrededores: filtra por tipo de servicio y material para ver ejemplos reales.",
};

const serviceOptions = services.map((s) => ({ slug: s.slug, label: s.title }));
const materialOptions = materials.map((m) => ({ slug: m.slug, label: m.title }));

export default function ProyectosPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-base-200 bg-base-100 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Proyectos</p>
          <h1 className="mt-2.5 font-serif text-4xl font-semibold text-ink-900 md:text-5xl">Proyectos reales en Madrid</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">
            Filtra por tipo de servicio o material para ver ejemplos parecidos a lo que necesitas.
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Proyectos" }]} />

      {/* TODO: sustituir estos proyectos placeholder por documentos `project` reales de Sanity
          (con fotos antes/después) en cuanto LRC facilite el material fotográfico. De momento
          esta es la página con menos contenido real, a la espera de esos recursos. */}
      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ProjectGallery projects={placeholderProjects} serviceOptions={serviceOptions} materialOptions={materialOptions} />
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
