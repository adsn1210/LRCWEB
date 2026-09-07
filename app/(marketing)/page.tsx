import type { Metadata } from "next";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient, urlFor } from "@/lib/sanity";
import { Hero } from "@/components/marketing/Hero";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { MaterialCard } from "@/components/marketing/MaterialCard";
import { ProjectCard, type ProjectCardData } from "@/components/marketing/ProjectCard";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ArrowRightIcon, BathIcon, CountertopIcon, HouseIcon, PotIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "La Reina de la Casa | Encimeras y reformas en Madrid",
  description:
    "Encimeras de cocina (porcelánico, cuarzo compacto, granito), muebles a medida y reformas integrales de cocina, baño y vivienda en Madrid.",
};

// La home ahora lee siteSettings.heroImage de Sanity (ver getHeroImageUrl más abajo); sin
// revalidate quedaría fija en el contenido del build. Mismo intervalo que las páginas de
// servicio/material (Docs/BACKEND.md sección 5).
export const revalidate = 3600;

const services = [
  {
    icon: CountertopIcon,
    title: "Encimeras de cocina",
    description: "Porcelánico, cuarzo compacto y granito a medida, con plantillado e instalación por nuestro equipo.",
    href: "/servicios/encimeras-de-cocina",
  },
  {
    icon: PotIcon,
    title: "Reforma de cocina",
    description: "Diseño, mobiliario a medida, encimera y electrodomésticos: tu cocina nueva sin complicaciones.",
    href: "/servicios/reformas-de-cocina",
  },
  {
    icon: BathIcon,
    title: "Reforma de baño",
    description: "Alicatado, sanitarios, mampara y encimera de baño con acabados a la altura de tu cocina.",
    href: "/servicios/reformas-de-bano",
  },
  {
    icon: HouseIcon,
    title: "Reforma integral",
    description: "Vivienda o local completo: albañilería, instalaciones y acabados con un único interlocutor.",
    href: "/servicios/reformas-integrales",
  },
];

const materials = [
  {
    title: "Porcelánico",
    description: "Muy resistente a rayaduras y altas temperaturas, en formatos de gran tamaño y sin juntas visibles.",
    href: "/materiales/porcelanico",
    gradient: "linear-gradient(135deg,#e9e5dd,#cec7ba 45%,#e2ddd2)",
  },
  {
    title: "Cuarzo compacto",
    description: "Superficie no porosa, fácil de limpiar y con una amplia gama de colores y texturas.",
    href: "/materiales/cuarzo-compacto",
    gradient: "linear-gradient(135deg,#efe9e4,#d6a99a 55%,#c98f7c)",
  },
  {
    title: "Granito",
    description: "Piedra natural de máxima dureza, con vetas únicas en cada pieza.",
    href: "/materiales/granito",
    gradient: "linear-gradient(135deg,#dfe1e2,#9fa5aa 50%,#6f757a)",
  },
];

// TODO: sustituir por proyectos reales desde Sanity (documento `project`, featured=true) en cuanto
// LRC facilite fotografías; de momento se muestran con degradados de textura como placeholder.
const featuredProjects: ProjectCardData[] = [
  {
    title: "Reforma de cocina",
    tagLine: "Reforma de cocina · Cuarzo compacto · Alcorcón",
    beforeGradient: "linear-gradient(135deg,#8d867c,#5f584f)",
    afterGradient: "linear-gradient(135deg,#efe9e4,#d6a99a 55%,#c98f7c)",
  },
  {
    title: "Encimera de porcelánico",
    tagLine: "Encimeras de cocina · Porcelánico · Getafe",
    beforeGradient: "linear-gradient(135deg,#9a948a,#665f55)",
    afterGradient: "linear-gradient(135deg,#e9e5dd,#cec7ba 45%,#e2ddd2)",
  },
  {
    title: "Reforma de baño",
    tagLine: "Reforma de baño · Granito · Pozuelo de Alarcón",
    beforeGradient: "linear-gradient(135deg,#8b8f92,#54585c)",
    afterGradient: "linear-gradient(135deg,#dfe1e2,#9fa5aa 50%,#6f757a)",
  },
];

const processSteps = [
  { title: "Visita y presupuesto", description: "Valoramos tu espacio y te damos un presupuesto cerrado, sin sorpresas ni letra pequeña." },
  { title: "Diseño y materiales", description: "Elegimos juntos el material y el diseño que mejor encajan con tu casa y tu presupuesto." },
  { title: "Fabricación e instalación", description: "Fabricamos a medida en nuestro taller e instalamos con nuestro propio equipo." },
  { title: "Entrega y garantía", description: "Revisamos cada detalle contigo y respondemos con garantía tras la instalación." },
];

// El resto de esta página sigue con contenido de ejemplo (ver TODOs más abajo); esta es la primera
// pieza que lee un documento real de Sanity. Si Sanity no responde (config pendiente, red, etc.),
// no debe romper la home: se sigue mostrando el degradado decorativo de Hero.tsx.
async function getHeroImageUrl(): Promise<string | undefined> {
  try {
    const settings = await sanityClient.fetch<{ heroImage?: SanityImageSource } | null>(
      `*[_type == "siteSettings"][0]{ heroImage }`,
    );
    if (!settings?.heroImage) return undefined;
    return urlFor(settings.heroImage).width(1600).height(900).fit("crop").url();
  } catch (error) {
    console.error("[home] error obteniendo siteSettings de Sanity", error);
    return undefined;
  }
}

export default async function Home() {
  const heroImageUrl = await getHeroImageUrl();

  return (
    <main className="flex-1">
      <Hero
        eyebrow="Encimeras y reformas en Madrid"
        title="Cocinas y reformas que se notan en los detalles"
        description="Fabricamos e instalamos encimeras de porcelánico, cuarzo compacto y granito, y llevamos tu reforma de cocina, baño o vivienda de principio a fin — desde el primer boceto hasta la última pieza."
        primaryCta={{ label: "Pide presupuesto gratis", href: "/contacto" }}
        secondaryCta={{ label: "Ver proyectos", href: "/proyectos" }}
        note="Madrid capital y alrededores · Fabricación propia"
        imageUrl={heroImageUrl}
      />

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Qué hacemos</p>
              <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Un equipo, todo el proceso</h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-ink-700">
              Del encimera suelta a la reforma integral: nos encargamos del diseño, la fabricación y la instalación.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.href} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Proyectos reales</p>
              <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Proyectos que hablan por nosotros</h2>
            </div>
            <Link href="/proyectos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
              Ver todos los proyectos
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Materiales</p>
              <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Elige el material de tu encimera</h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-ink-700">
              Trabajamos directamente con fabricantes: te asesoramos sobre el material más adecuado para tu día a día.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {materials.map((m) => (
              <MaterialCard key={m.href} {...m} />
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps
        className="bg-base-100"
        eyebrow="Cómo trabajamos"
        title="De la primera visita a la última pieza"
        steps={processSteps}
      />

      <CtaBand />
    </main>
  );
}
