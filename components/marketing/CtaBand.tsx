import Link from "next/link";
import { MailIcon, PhoneIcon } from "@/components/ui/icons";
import { PhoneMenu } from "@/components/ui/PhoneMenu";
import { TrackedEmailLink } from "@/components/ui/TrackedEmailLink";
import { CONTACT_EMAIL, PHONE_NUMBER_DISPLAY } from "@/lib/site";

type CtaBandProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
};

// Extraído del bloque de contacto final de la Home para reutilizar en el resto de páginas.
export function CtaBand({
  title = "¿Nos cuentas tu proyecto?",
  description = "Cuéntanos qué necesitas y te respondemos con un presupuesto sin compromiso.",
  ctaLabel = "Cuéntanos tu proyecto",
}: CtaBandProps) {
  return (
    <section className="bg-ink-900 py-14 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-white md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">{description}</p>
          <div className="mt-7 flex flex-wrap gap-7">
            <PhoneMenu source="cta_band" className="flex items-center gap-2.5 text-[15px] font-semibold text-white">
              <PhoneIcon className="h-5 w-5 text-brand-beige" />
              {PHONE_NUMBER_DISPLAY}
            </PhoneMenu>
            <TrackedEmailLink source="cta_band" className="flex items-center gap-2.5 text-[15px] font-semibold text-white">
              <MailIcon className="h-5 w-5 text-brand-beige" />
              {CONTACT_EMAIL}
            </TrackedEmailLink>
          </div>
        </div>
        <Link
          href="/contacto"
          className="flex h-12 shrink-0 items-center justify-center bg-accent-500 px-7 text-[15px] font-semibold text-base-50 transition hover:bg-accent-600"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
