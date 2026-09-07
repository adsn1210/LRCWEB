"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { PHONE_NUMBER_TEL, WHATSAPP_URL } from "@/lib/site";

type PhoneMenuProps = {
  className?: string;
  children: ReactNode;
};

// Botón de teléfono reutilizado en cabecera, menú móvil, footer, /contacto y CtaBand: al pulsarlo
// despliega "Llamar" / "WhatsApp" en vez de marcar directamente, ya que ambos canales usan el mismo
// número (ver lib/site.ts). `className`/`children` los define cada sitio para no romper su estilo
// visual actual (mismo patrón que ManageCookiesButton).
export function PhoneMenu({ className, children }: PhoneMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`${className ?? ""} outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2`}
      >
        {children}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[95] mt-2 flex w-48 flex-col border border-base-200 bg-white shadow-xl">
          <a
            href={`tel:${PHONE_NUMBER_TEL}`}
            className="flex h-11 items-center gap-2.5 px-4 text-sm font-medium text-ink-900 outline-none hover:bg-base-100 focus-visible:bg-base-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500"
          >
            <PhoneIcon className="h-4 w-4 text-accent-600" />
            Llamar
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2.5 px-4 text-sm font-medium text-ink-900 outline-none hover:bg-base-100 focus-visible:bg-base-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500"
          >
            {/* El verde de WhatsApp, fuera de la paleta de LRC a propósito, ver WhatsAppButton.tsx */}
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
