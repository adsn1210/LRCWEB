"use client";

import type { ReactNode } from "react";
import { WHATSAPP_URL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

type TrackedWhatsAppLinkProps = {
  className?: string;
  children: ReactNode;
  source: string;
  "aria-label"?: string;
};

// Enlace de WhatsApp reutilizado donde no hace falta el desplegable "Llamar/WhatsApp" de PhoneMenu
// (botón flotante, enlace directo de /contacto): dispara whatsapp_click (Docs/BACKEND.md sección 6)
// antes de abrir wa.me en una pestaña nueva.
export function TrackedWhatsAppLink({ className, children, source, ...rest }: TrackedWhatsAppLinkProps) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { source })}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
