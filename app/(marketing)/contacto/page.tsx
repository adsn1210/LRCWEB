import type { Metadata } from "next";
import { ProjectWizard } from "@/components/forms/ProjectWizard";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { PhoneMenu } from "@/components/ui/PhoneMenu";
import { TrackedWhatsAppLink } from "@/components/ui/TrackedWhatsAppLink";
import { PHONE_NUMBER_DISPLAY } from "@/lib/site";

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
          <ProjectWizard sourcePage="/contacto" />

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <PhoneMenu source="contacto_page" className="flex items-center gap-3 text-base font-semibold text-ink-900">
                <PhoneIcon className="h-5 w-5 text-accent-600" />
                {PHONE_NUMBER_DISPLAY}
              </PhoneMenu>
              <TrackedWhatsAppLink
                source="contacto_page"
                className="flex items-center gap-3 text-base font-semibold text-ink-900"
                aria-label="Escríbenos por WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5 text-accent-600" />
                Escríbenos por WhatsApp
              </TrackedWhatsAppLink>
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
                <span>
                  Lunes a sábado
                  <br />
                  8:00–14:00 y 16:00–20:00
                </span>
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
