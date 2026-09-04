import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ManageCookiesButton } from "@/components/layout/ManageCookiesButton";

export const metadata: Metadata = {
  title: "Política de cookies | La Reina de la Casa",
  description: "Qué cookies utiliza lareinadelacasa.com, con qué finalidad y cómo puedes gestionar tus preferencias.",
};

const h2 = "font-serif text-2xl font-semibold text-ink-900 mt-10 first:mt-0";
const p = "mt-4 text-base leading-relaxed text-ink-700";

export default function PoliticaDeCookiesPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-base-200 bg-base-100 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Legal</p>
          <h1 className="mt-2.5 font-serif text-4xl font-semibold text-ink-900 md:text-5xl">Política de cookies</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">Última actualización: 4 de septiembre de 2026.</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Política de cookies" }]} />

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className={h2}>¿Qué son las cookies?</h2>
          <p className={p}>
            Las cookies son pequeños archivos de texto que un sitio web guarda en tu navegador cuando lo visitas.
            Sirven para recordar información sobre tu visita, como tu idioma preferido o, en nuestro caso, tu
            decisión sobre el propio uso de cookies, y en algunos casos para analizar de forma agregada cómo se usa
            la web.
          </p>

          <h2 className={h2}>Tipos de cookies que usamos</h2>
          <p className={p}>
            <strong className="text-ink-900">Necesarias:</strong> imprescindibles para que la web funcione
            correctamente (por ejemplo, recordar tu decisión sobre cookies). Siempre están activas y no requieren tu
            consentimiento porque no recogen datos con fines de analítica o publicidad.
          </p>
          <p className={p}>
            <strong className="text-ink-900">Analíticas:</strong> nos ayudan a entender cómo se usa la web (páginas
            más visitadas, de dónde vienen las visitas) mediante Google Analytics. Solo se activan si das tu
            consentimiento explícito.
          </p>
          <p className={p}>
            <strong className="text-ink-900">Marketing:</strong> permitirían, en el futuro, mostrar anuncios más
            relevantes fuera de esta web. Solo se activarían si das tu consentimiento explícito; a día de hoy no
            tenemos ninguna campaña activa que las utilice.
          </p>

          <h2 className={h2}>Cookies concretas utilizadas</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-base-200">
                  <th className="py-2.5 pr-4 font-semibold text-ink-900">Cookie</th>
                  <th className="py-2.5 pr-4 font-semibold text-ink-900">Tipo</th>
                  <th className="py-2.5 pr-4 font-semibold text-ink-900">Duración</th>
                  <th className="py-2.5 font-semibold text-ink-900">Finalidad</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-base-200">
                  <td className="py-2.5 pr-4 text-ink-700">lrc_consent</td>
                  <td className="py-2.5 pr-4 text-ink-700">Necesaria (propia)</td>
                  <td className="py-2.5 pr-4 text-ink-700">12 meses</td>
                  <td className="py-2.5 text-ink-700">Recordar tu decisión sobre cookies, para no volver a preguntarte en cada visita.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-ink-700">_ga, _ga_*</td>
                  <td className="py-2.5 pr-4 text-ink-700">Analítica (Google Analytics, tercero)</td>
                  <td className="py-2.5 pr-4 text-ink-700">Hasta 13 meses</td>
                  <td className="py-2.5 text-ink-700">Medir el uso de la web de forma agregada. Solo se instalan si aceptas cookies analíticas.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className={h2}>Cómo gestionar tus preferencias</h2>
          <p className={p}>
            Puedes cambiar tu decisión sobre cookies en cualquier momento, incluso después de haberla tomado la
            primera vez:
          </p>
          <ManageCookiesButton className="mt-5 flex h-12 items-center justify-center bg-accent-500 px-7 text-[15px] font-semibold text-base-50 transition hover:bg-accent-600">
            Volver a configurar mis cookies
          </ManageCookiesButton>
          <p className={p}>
            También puedes bloquear o eliminar las cookies desde la configuración de tu navegador en cualquier
            momento; ten en cuenta que bloquear las cookies necesarias puede afectar al funcionamiento de la web.
          </p>

          <h2 className={h2}>Más información</h2>
          <p className={p}>
            Para cualquier duda sobre esta política de cookies, puedes escribirnos a{" "}
            <a href="mailto:info@lareinadelacasa.com" className="font-semibold text-accent-600 underline">
              info@lareinadelacasa.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
