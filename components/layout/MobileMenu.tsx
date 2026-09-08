"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon, MenuIcon, PhoneIcon, XIcon } from "@/components/ui/icons";
import { PhoneMenu } from "@/components/ui/PhoneMenu";
import { PHONE_NUMBER_DISPLAY } from "@/lib/site";

type NavItem = { label: string; href: string };

type MobileMenuProps = {
  services: NavItem[];
  materials: NavItem[];
};

export function MobileMenu({ services, materials }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<"services" | "materials" | null>(null);

  function close() {
    setOpen(false);
    setOpenGroup(null);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center text-ink-900 md:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex flex-col bg-base-50 md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-base-200 px-4">
            <Image src="/logo.webp" alt="La Reina de la Casa" width={140} height={30} className="h-8 w-auto" />
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center text-ink-900"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-8">
            <MobileGroup
              label="Servicios"
              items={services}
              isOpen={openGroup === "services"}
              onToggle={() => setOpenGroup((g) => (g === "services" ? null : "services"))}
              onNavigate={close}
            />
            <MobileGroup
              label="Materiales"
              items={materials}
              isOpen={openGroup === "materials"}
              onToggle={() => setOpenGroup((g) => (g === "materials" ? null : "materials"))}
              onNavigate={close}
            />
            <Link href="/proyectos" onClick={close} className="block border-b border-base-200 py-4 text-[17px] font-semibold text-ink-900">
              Proyectos
            </Link>
            <Link href="/sobre-nosotros" onClick={close} className="block border-b border-base-200 py-4 text-[17px] font-semibold text-ink-900">
              Sobre nosotros
            </Link>
            <Link href="/contacto" onClick={close} className="block py-4 text-[17px] font-semibold text-ink-900">
              Contacto
            </Link>
          </div>

          <div className="border-t border-base-200 p-5">
            <PhoneMenu source="mobile_menu" className="flex h-[50px] w-full items-center justify-center gap-2 border border-ink-900 text-[15px] font-semibold text-ink-900">
              <PhoneIcon className="h-5 w-5" />
              {PHONE_NUMBER_DISPLAY}
            </PhoneMenu>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function MobileGroup({
  label,
  items,
  isOpen,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-base-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-[17px] font-semibold text-ink-900"
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="flex flex-col gap-1 pb-3 pl-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={onNavigate} className="py-2.5 text-[15px] font-medium text-ink-700">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
