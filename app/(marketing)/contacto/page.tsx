import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto | La Reina de la Casa",
  description:
    "Pide presupuesto sin compromiso para tu encimera o reforma en Madrid: teléfono, WhatsApp, email y formulario de contacto.",
};

export default function ContactoPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-base-200 bg-base-100 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Contacto</p>
          <h1 className="mt-2.5 font-serif text-4xl font-semibold text-ink-900 md:text-5xl">Hablemos de tu proyecto</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">
            Cuéntanos qué necesitas y te respondemos con un presupuesto sin compromiso. Si lo prefieres, también
            puedes llamarnos o escribirnos directamente por WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:px-8">
          <ContactForm />

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <a href="tel:+34900000000" className="flex items-center gap-3 text-base font-semibold text-ink-900">
                <PhoneIcon className="h-5 w-5 text-accent-600" />
                [TELÉFONO]
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-semibold text-ink-900"
                aria-label="Escríbenos por WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5 text-accent-600" />
                Escríbenos por WhatsApp
              </a>
              <a href="mailto:info@lareinadelacasa.com" className="flex items-center gap-3 text-base font-semibold text-ink-900">
                <MailIcon className="h-5 w-5 text-accent-600" />
                info@lareinadelacasa.com
              </a>
              <p className="flex items-start gap-3 text-base text-ink-700">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                [Dirección showroom], Madrid
              </p>
              <p className="flex items-start gap-3 text-base text-ink-700">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                [Horario de atención]
              </p>
            </div>

            {/* TODO: sustituir por un mapa de Google Maps embebido cuando LRC facilite la dirección del showroom */}
            <div className="flex h-64 items-center justify-center border border-dashed border-base-200 bg-base-100 px-6 text-center">
              <p className="text-sm text-ink-700">Mapa del showroom — pendiente de la dirección real</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
