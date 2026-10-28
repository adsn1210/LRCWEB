"use client";

import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

type TrackedEmailLinkProps = {
  className?: string;
  children: ReactNode;
  source: string;
};

// Enlace mailto al email de LRC que dispara email_click, mismo patrón que TrackedWhatsAppLink: un
// visitante que escribe por email es un lead igual que uno que rellena el formulario, y sin este
// evento GA4 no lo vería.
export function TrackedEmailLink({ className, children, source }: TrackedEmailLinkProps) {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => trackEvent("email_click", { source })} className={className}>
      {children}
    </a>
  );
}
