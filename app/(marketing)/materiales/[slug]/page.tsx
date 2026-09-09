import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/marketing/Hero";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getMaterialBySlug, materials } from "@/lib/content/materials";
import { getProjects, toProjectCardData } from "@/lib/sanity-projects";

export const revalidate = 3600;

export function generateStaticParams() {
  return materials.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);
  if (!material) return {};
  return {
    title: `${material.title} | La Reina de la Casa`,
    description: material.metaDescription,
  };
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);
  if (!material) notFound();

  const projects = await getProjects();
  const relatedProjects = projects.filter((p) => p.materialSlug === material.slug).slice(0, 3);

  return (
    <main className="flex-1">
      <Hero
        eyebrow={material.eyebrow}
        title={material.heroTitle}
        description={material.heroDescription}
        primaryCta={{ label: "Pide presupuesto gratis", href: "/contacto" }}
        secondaryCta={{ label: "Ver encimeras de cocina", href: "/servicios/encimeras-de-cocina" }}
        imageUrl={material.heroImage}
      />

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Materiales" }, { label: material.title }]} />

      <section className="py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-8">
          <div className="flex flex-col gap-5 md:col-span-2">
            {material.intro.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-ink-700">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="border border-base-200 bg-base-100 p-7">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-900">Características</p>
            <ul className="mt-4 flex flex-col gap-3">
              {material.features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Acabados</p>
            <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Variedades disponibles</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
              {/* TODO: confirmar acabados exactos con el catálogo real de proveedores de LRC */}
              Estos son los acabados más habituales; en el taller te enseñamos las muestras físicas disponibles en
              cada momento, ya que color y textura reales se aprecian mejor en la pieza que en pantalla.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {material.varieties.map((v) => (
              <div key={v.name} className="border border-base-200 bg-white p-6">
                <h3 className="font-sans text-lg font-semibold text-ink-900">{v.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Mantenimiento</p>
          <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Cuidados básicos</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {material.care.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-ink-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="bg-base-100 py-14 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Proyectos relacionados</p>
              <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">
                Proyectos con {material.title.toLowerCase()}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} {...toProjectCardData(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </main>
  );
}
