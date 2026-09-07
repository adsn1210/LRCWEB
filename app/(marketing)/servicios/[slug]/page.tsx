import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/marketing/Hero";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getServiceBySlug, services } from "@/lib/content/services";
import { getProjects, toProjectCardData } from "@/lib/sanity-projects";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} | La Reina de la Casa`,
    description: service.metaDescription,
  };
}

export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const projects = await getProjects();
  const relatedProjects = projects.filter((p) => p.serviceSlug === service.slug).slice(0, 3);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: { "@type": "HomeAndConstructionBusiness", name: "La Reina de la Casa", url: SITE_URL },
    areaServed: "Comunidad de Madrid",
    description: service.metaDescription,
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <Hero
        eyebrow={service.eyebrow}
        title={service.heroTitle}
        description={service.heroDescription}
        primaryCta={{ label: "Pide presupuesto gratis", href: "/contacto" }}
        secondaryCta={{ label: "Ver proyectos", href: "/proyectos" }}
      />

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Servicios" }, { label: service.title }]} />

      <section className="py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-8">
          <div className="flex flex-col gap-5 md:col-span-2">
            {service.intro.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-ink-700">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="border border-base-200 bg-base-100 p-7">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-900">Qué incluye</p>
            <ul className="mt-4 flex flex-col gap-3">
              {service.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProcessSteps className="bg-base-100" eyebrow="Cómo trabajamos" title="Nuestro proceso" steps={service.processSteps} />

      {relatedProjects.length > 0 && (
        <section className="py-14 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Proyectos relacionados</p>
              <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">
                Ejemplos de {service.title.toLowerCase()}
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
