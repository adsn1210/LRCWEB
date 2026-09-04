import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PinIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Sobre nosotros | La Reina de la Casa",
  description:
    "Fabricamos e instalamos encimeras y reformas en Madrid con taller propio y un único equipo, de la primera visita a la última pieza.",
};

// TODO: contenido genérico a falta de historia real, fecha de fundación y equipo que facilite
// LRC (ver Docs/05-contenidos-y-diseno.md "Activos que hay que recopilar del cliente"). Página
// pensada para poder editarse por completo más adelante (código o, si se decide, un futuro
// schema de Sanity) sin depender de este texto de partida.
const processSteps = [
  { title: "Visita y presupuesto", description: "Valoramos tu espacio y te damos un presupuesto cerrado, sin sorpresas ni letra pequeña." },
  { title: "Diseño y materiales", description: "Elegimos juntos el material y el diseño que mejor encajan con tu casa y tu presupuesto." },
  { title: "Fabricación e instalación", description: "Fabricamos a medida en nuestro taller e instalamos con nuestro propio equipo." },
  { title: "Entrega y garantía", description: "Revisamos cada detalle contigo y respondemos con garantía tras la instalación." },
];

const commitments = [
  "Presupuesto cerrado, sin sorpresas en la factura final",
  "Materiales explicados con detalle, sin tecnicismos",
  "Fabricación e instalación por nuestro propio equipo",
  "Garantía tras la instalación",
  "Un único interlocutor durante toda la obra",
];

export default function SobreNosotrosPage() {
  return (
    <main className="flex-1">
      <Hero
        eyebrow="Sobre nosotros"
        title="Detrás de cada encimera, un equipo que fabrica e instala con sus propias manos"
        description="Diseñamos, fabricamos e instalamos encimeras y reformas en Madrid, con taller propio y un único equipo de principio a fin."
        primaryCta={{ label: "Pide presupuesto gratis", href: "/contacto" }}
        secondaryCta={{ label: "Ver proyectos", href: "/proyectos" }}
      />

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Sobre nosotros" }]} />

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Nuestra historia</p>
          <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Fabricamos lo que instalamos</h2>
          <div className="mt-6 flex flex-col gap-5">
            <p className="text-base leading-relaxed text-ink-700">
              La Reina de la Casa nació en Madrid con una idea sencilla: que quien fabrica la encimera sea quien la
              instala. Muchas empresas del sector subcontratan el montaje a terceros; nosotros preferimos
              responsabilizarnos de todo el proceso, desde la primera visita hasta la última pieza colocada.
            </p>
            <p className="text-base leading-relaxed text-ink-700">
              Con los años hemos ampliado nuestro trabajo de las encimeras a la reforma completa de cocinas, baños y
              viviendas, siempre con la misma filosofía: un presupuesto cerrado desde el principio, materiales que
              explicamos con detalle, y un equipo propio que responde si algo no sale como se esperaba.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          {/* TODO: sustituir por foto real del showroom/taller cuando LRC la facilite */}
          <div
            className="h-72 md:h-96"
            style={{ background: "linear-gradient(135deg,#e5e1da,#cecbc4 50%,#ad8e7f)" }}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Dónde trabajamos</p>
            <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Nuestro showroom y taller</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-700">
              Fabricamos cada encimera en nuestro propio taller, donde cortamos y trabajamos porcelánico, cuarzo
              compacto y granito a medida según el plantillado de cada proyecto. En el showroom puedes ver y tocar
              muestras reales de todos los materiales antes de decidir — algo que en foto nunca se aprecia del todo
              bien.
            </p>
            <p className="mt-5 flex items-start gap-2.5 text-sm text-ink-700">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
              [Dirección showroom], Madrid — visítanos con cita previa
            </p>
          </div>
        </div>
      </section>

      <ProcessSteps eyebrow="Cómo trabajamos" title="De la primera visita a la última pieza" steps={processSteps} />

      <section className="bg-base-100 py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Nuestro compromiso</p>
          <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">Lo que puedes esperar de nosotros</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {commitments.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-ink-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
