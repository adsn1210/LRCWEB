import Image from "next/image";
import Link from "next/link";
import { CameraIcon, ChatIcon, MailIcon, MusicNoteIcon, PhoneIcon, PinIcon, PlayIcon } from "@/components/ui/icons";
import { ManageCookiesButton } from "@/components/layout/ManageCookiesButton";

const serviceLinks = [
  { label: "Encimeras de cocina", href: "/servicios/encimeras-de-cocina" },
  { label: "Reforma de cocina", href: "/servicios/reformas-de-cocina" },
  { label: "Reforma de baño", href: "/servicios/reformas-de-bano" },
  { label: "Reforma integral", href: "/servicios/reformas-integrales" },
];

// "Enlaces" combina materiales + páginas de empresa: no hay página índice /materiales en el sitemap
// (Docs/03-arquitectura-informacion-sitemap.md), así que enlazamos directo a cada material.
const otherLinks = [
  { label: "Porcelánico", href: "/materiales/porcelanico" },
  { label: "Cuarzo compacto", href: "/materiales/cuarzo-compacto" },
  { label: "Granito", href: "/materiales/granito" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
];

const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];

// TODO: sustituir "#" por las URLs reales de redes sociales de LRC (Docs/03-arquitectura-informacion-sitemap.md: TikTok, Facebook, Instagram, YouTube)
const socialLinks = [
  { label: "Instagram", href: "#", icon: CameraIcon },
  { label: "Facebook", href: "#", icon: ChatIcon },
  { label: "TikTok", href: "#", icon: MusicNoteIcon },
  { label: "YouTube", href: "#", icon: PlayIcon },
];

export function Footer() {
  return (
    <footer className="bg-base-100 py-16 pb-7">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/logo.webp" alt="La Reina de la Casa" width={150} height={32} className="h-8 w-auto" />
            <p className="mt-4 text-sm text-ink-700">
              Encimeras de cocina y reformas integrales en Madrid. Fabricación e instalación propia.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center border border-base-200 text-ink-700 hover:border-accent-500 hover:text-accent-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Servicios" links={serviceLinks} />
          <FooterColumn title="Enlaces" links={otherLinks} />

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-900">Contacto</p>
            <div className="mt-4 flex flex-col gap-3.5">
              <p className="flex items-start gap-2.5 text-sm text-ink-700">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                [Dirección showroom], Madrid
              </p>
              <a href="tel:+34900000000" className="flex items-center gap-2.5 text-sm text-ink-700">
                <PhoneIcon className="h-4 w-4 shrink-0 text-accent-600" />
                [TELÉFONO]
              </a>
              <a href="mailto:info@lareinadelacasa.com" className="flex items-center gap-2.5 text-sm text-ink-700">
                <MailIcon className="h-4 w-4 shrink-0 text-accent-600" />
                info@lareinadelacasa.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 border-t border-base-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-700">© {new Date().getFullYear()} La Reina de la Casa. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-6">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[13.5px] text-ink-700 hover:text-accent-600">
                {l.label}
              </Link>
            ))}
            <ManageCookiesButton className="text-[13.5px] text-ink-700 underline hover:text-accent-600">
              Configurar cookies
            </ManageCookiesButton>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-900">{title}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-700 hover:text-accent-600">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
