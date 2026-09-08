import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon, PhoneIcon } from "@/components/ui/icons";
import { PhoneMenu } from "@/components/ui/PhoneMenu";
import { PHONE_NUMBER_DISPLAY } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

const services = [
  { label: "Encimeras de cocina", href: "/servicios/encimeras-de-cocina" },
  { label: "Reforma de cocina", href: "/servicios/reformas-de-cocina" },
  { label: "Reforma de baño", href: "/servicios/reformas-de-bano" },
  { label: "Reforma integral", href: "/servicios/reformas-integrales" },
];

const materials = [
  { label: "Porcelánico", href: "/materiales/porcelanico" },
  { label: "Cuarzo compacto", href: "/materiales/cuarzo-compacto" },
  { label: "Granito", href: "/materiales/granito" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-200 bg-base-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <Link href="/" aria-label="La Reina de la Casa — Inicio">
          <Image src="/logo.webp" alt="La Reina de la Casa" width={160} height={34} priority className="h-8 w-auto md:h-9" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center md:flex">
          <NavDropdown label="Servicios" items={services} />
          <NavDropdown label="Materiales" items={materials} />
          <Link href="/proyectos" className="flex h-20 items-center px-4 text-[15px] font-medium text-ink-900 hover:text-accent-600">
            Proyectos
          </Link>
          <Link href="/sobre-nosotros" className="flex h-20 items-center px-4 text-[15px] font-medium text-ink-900 hover:text-accent-600">
            Sobre nosotros
          </Link>
          <Link href="/contacto" className="flex h-20 items-center px-4 text-[15px] font-medium text-ink-900 hover:text-accent-600">
            Contacto
          </Link>
        </nav>

        <div className="hidden md:flex">
          <PhoneMenu source="header" className="flex items-center gap-2 text-[15px] font-semibold text-ink-900">
            <PhoneIcon className="h-5 w-5 text-accent-600" />
            {PHONE_NUMBER_DISPLAY}
          </PhoneMenu>
        </div>

        <MobileMenu services={services} materials={materials} />
      </div>
    </header>
  );
}

function NavDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-20 items-center gap-1.5 px-4 text-[15px] font-medium text-ink-900 hover:text-accent-600"
      >
        {label}
        <ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full min-w-60 -translate-y-1 border border-base-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-3 text-sm font-medium text-ink-900 hover:bg-base-100 hover:text-accent-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
