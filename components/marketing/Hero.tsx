import Link from "next/link";
import { PinIcon } from "@/components/ui/icons";

type HeroCta = { label: string; href: string };

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  note?: string;
};

export function Hero({ eyebrow, title, description, primaryCta, secondaryCta, note }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2b2621] via-[#423a32] to-[#59493c] py-20 md:py-32">
      {/* TODO: reemplazar por foto real de proyecto cuando LRC facilite fotografía profesional */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 600px at 15% 20%, rgba(214,169,154,.45), transparent 60%), radial-gradient(900px 700px at 85% 85%, rgba(159,165,170,.4), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-beige">{eyebrow}</p>
          <h1 className="mt-3.5 font-serif text-4xl font-semibold text-white md:text-5xl">{title}</h1>
          <p className="mt-5 text-base leading-relaxed text-white/85">{description}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className="flex h-12 items-center justify-center bg-accent-500 px-7 text-[15px] font-semibold text-base-50 transition hover:bg-accent-600"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="flex h-12 items-center justify-center border border-white/70 px-7 text-[15px] font-semibold text-white transition hover:bg-white hover:text-ink-900"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
          {note && (
            <div className="mt-8 flex items-center gap-2.5 text-white/70">
              <PinIcon className="h-4 w-4" />
              <span className="text-sm">{note}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
