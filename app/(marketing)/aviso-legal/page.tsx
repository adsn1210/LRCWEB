import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Aviso legal | La Reina de la Casa",
  description: "Datos identificativos, condiciones de uso y propiedad intelectual de lareinadelacasa.com.",
};

const h2 = "font-serif text-2xl font-semibold text-ink-900 mt-10 first:mt-0";
const p = "mt-4 text-base leading-relaxed text-ink-700";

// TODO: sustituir [RAZÓN SOCIAL], [NIF/CIF], [DOMICILIO SOCIAL] y [DATOS REGISTRALES] por los
// datos fiscales reales de LRC en cuanto los facilite el cliente (Docs/07-pendientes-lanzamiento.md
// sección 1.1). El resto del contenido es texto legal estándar (LSSI-CE) — revisar con un
// asesor/gestor antes del lanzamiento definitivo, no sustituye asesoramiento legal profesional.
export default function AvisoLegalPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-base-200 bg-base-100 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Legal</p>
          <h1 className="mt-2.5 font-serif text-4xl font-semibold text-ink-900 md:text-5xl">Aviso legal</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">Última actualización: 4 de septiembre de 2026.</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Aviso legal" }]} />

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className={h2}>1. Datos identificativos</h2>
          <p className={p}>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
            Información y de Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-base leading-relaxed text-ink-700">
            <li>
              <strong className="text-ink-900">Titular:</strong> [RAZÓN SOCIAL]
            </li>
            <li>
              <strong className="text-ink-900">NIF/CIF:</strong> [NIF/CIF]
            </li>
            <li>
              <strong className="text-ink-900">Domicilio social:</strong> [DOMICILIO SOCIAL]
            </li>
            <li>
              <strong className="text-ink-900">Datos registrales:</strong> [DATOS REGISTRALES, si aplica]
            </li>
            <li>
              <strong className="text-ink-900">Email de contacto:</strong> info@lareinadelacasa.com
            </li>
            <li>
              <strong className="text-ink-900">Teléfono:</strong> [TELÉFONO]
            </li>
          </ul>

          <h2 className={h2}>2. Objeto y ámbito de aplicación</h2>
          <p className={p}>
            El presente aviso legal regula el uso del sitio web lareinadelacasa.com (en adelante, &quot;la web&quot;),
            propiedad de [RAZÓN SOCIAL]. El acceso y uso de la web atribuye la condición de usuario e implica la
            aceptación plena de las condiciones incluidas en este aviso legal.
          </p>

          <h2 className={h2}>3. Condiciones de uso</h2>
          <p className={p}>
            El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que se ofrecen a través
            de la web y a no emplearlos para incurrir en actividades ilícitas o contrarias a la buena fe y al
            ordenamiento legal, o que de cualquier forma puedan dañar, inutilizar o deteriorar la web o impedir su
            normal utilización por parte de otros usuarios.
          </p>

          <h2 className={h2}>4. Propiedad intelectual e industrial</h2>
          <p className={p}>
            Todos los contenidos de la web (textos, fotografías, gráficos, imágenes, iconos, tecnología, software,
            diseño gráfico y códigos fuente) son propiedad de [RAZÓN SOCIAL] o de terceros que han autorizado su
            uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su
            reproducción, distribución o comunicación pública total o parcial sin autorización expresa.
          </p>

          <h2 className={h2}>5. Exclusión de responsabilidad</h2>
          <p className={p}>
            [RAZÓN SOCIAL] no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran
            derivarse de la falta de disponibilidad o continuidad del funcionamiento de la web, ni de los que
            pudieran derivarse del uso ilícito, negligente, fraudulento o contrario al presente aviso legal.
          </p>

          <h2 className={h2}>6. Legislación aplicable y jurisdicción</h2>
          <p className={p}>
            Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier
            controversia que pudiera surgir del acceso o uso de la web, [RAZÓN SOCIAL] y el usuario se someten a
            los juzgados y tribunales que correspondan conforme a derecho.
          </p>
        </div>
      </section>
    </main>
  );
}
