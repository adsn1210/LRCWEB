import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad | La Reina de la Casa",
  description: "Cómo tratamos los datos que nos facilitas a través del formulario de contacto de lareinadelacasa.com.",
  path: "/politica-de-privacidad",
});

const h2 = "font-serif text-2xl font-semibold text-ink-900 mt-10 first:mt-0";
const p = "mt-4 text-base leading-relaxed text-ink-700";

// Datos fiscales reales (La Reina de la Casa Studio S.L., NIF B75576538) añadidos 2026-09-04.
// El contenido sigue la estructura estándar del RGPD — revisar con un asesor/gestor antes del
// lanzamiento definitivo, no sustituye asesoramiento legal profesional.
export default function PoliticaDePrivacidadPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-base-200 bg-base-100 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Legal</p>
          <h1 className="mt-2.5 font-serif text-4xl font-semibold text-ink-900 md:text-5xl">Política de privacidad</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">Última actualización: 4 de septiembre de 2026.</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Política de privacidad" }]} />

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className={h2}>1. Responsable del tratamiento</h2>
          <ul className="mt-4 flex flex-col gap-2 text-base leading-relaxed text-ink-700">
            <li>
              <strong className="text-ink-900">Titular:</strong> La Reina de la Casa Studio S.L.
            </li>
            <li>
              <strong className="text-ink-900">NIF/CIF:</strong> B75576538
            </li>
            <li>
              <strong className="text-ink-900">Domicilio:</strong> Calle Hermosilla, 48, Planta 1, Puerta D, 28001
              Madrid
            </li>
            <li>
              <strong className="text-ink-900">Email de contacto:</strong> info@lareinadelacasa.com
            </li>
          </ul>

          <h2 className={h2}>2. ¿Qué datos tratamos y con qué finalidad?</h2>
          <p className={p}>
            Cuando rellenas el formulario de contacto de esta web, tratamos los siguientes datos: nombre, teléfono
            o email de contacto, el tipo de servicio que te interesa y, si lo escribes, el mensaje que nos envías.
            Los usamos exclusivamente para responder a tu solicitud de información o presupuesto — no los usamos
            para ninguna otra finalidad ni los cedemos a terceros con fines comerciales.
          </p>

          <h2 className={h2}>3. Legitimación</h2>
          <p className={p}>
            La base legal para el tratamiento de tus datos es tu propio consentimiento, que otorgas al rellenar y
            enviar voluntariamente el formulario de contacto.
          </p>

          <h2 className={h2}>4. ¿A quién comunicamos tus datos?</h2>
          <p className={p}>
            Tus datos se almacenan en una base de datos gestionada por Supabase (que actúa como encargado del
            tratamiento) y el aviso de tu solicitud se envía por email a través de Resend. Ambos proveedores tratan
            los datos únicamente siguiendo nuestras instrucciones, para el envío y almacenamiento del propio
            formulario, y no los usan con fines propios. No cedemos tus datos a ningún otro tercero, salvo
            obligación legal.
          </p>

          <h2 className={h2}>5. ¿Cuánto tiempo conservamos tus datos?</h2>
          <p className={p}>
            Conservamos tus datos mientras exista una relación comercial o de interés contigo y, una vez
            finalizada, durante los plazos de prescripción legalmente aplicables, salvo que solicites antes su
            supresión.
          </p>

          <h2 className={h2}>6. Tus derechos</h2>
          <p className={p}>
            Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición,
            limitación del tratamiento y portabilidad de tus datos escribiéndonos a{" "}
            <a href="mailto:info@lareinadelacasa.com" className="font-semibold text-accent-600 underline">
              info@lareinadelacasa.com
            </a>
            . Si consideras que no hemos atendido correctamente tu solicitud, tienes derecho a presentar una
            reclamación ante la Agencia Española de Protección de Datos (
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-600 underline">
              aepd.es
            </a>
            ).
          </p>

          <h2 className={h2}>7. Seguridad</h2>
          <p className={p}>
            Aplicamos las medidas técnicas y organizativas razonables para proteger tus datos frente a accesos no
            autorizados, pérdida o alteración.
          </p>

          <h2 className={h2}>8. Menores de edad</h2>
          <p className={p}>
            Los servicios ofrecidos a través de esta web están dirigidos a mayores de edad. No recogemos
            conscientemente datos de menores de edad a través del formulario de contacto.
          </p>
        </div>
      </section>
    </main>
  );
}
