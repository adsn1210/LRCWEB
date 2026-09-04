"use client";

import type { ReactNode } from "react";

// Borra la decisión guardada y recarga para que CookieBanner vuelva a mostrarse (su estado de
// consentimiento se cachea a nivel de módulo tras la primera lectura, así que un simple borrado de
// cookie sin recargar no lo haría reaparecer). Ver components/layout/CookieBanner.tsx.
export function ManageCookiesButton({ className, children }: { className?: string; children: ReactNode }) {
  function handleClick() {
    document.cookie = "lrc_consent=; path=/; max-age=0";
    window.location.reload();
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
