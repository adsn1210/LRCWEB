"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ProjectWizard } from "@/components/forms/ProjectWizard";
import { trackEvent } from "@/lib/analytics";
import { XIcon } from "@/components/ui/icons";

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function ProjectWizardButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const triggerButton = triggerButtonRef.current;

    // Mueve el foco al botón de cerrar en cuanto se abre el modal.
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      // Atrapa el foco dentro del modal mientras está abierto.
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Devuelve el foco al botón que abrió el modal al cerrarlo.
      triggerButton?.focus();
    };
  }, [open]);

  if (pathname === "/contacto") return null;

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("lead_widget_open");
        }}
        className="fixed right-6 top-[55%] z-[90] flex h-14 items-center justify-center bg-ink-900 px-6 text-center text-[15px] font-semibold text-base-50 shadow-lg shadow-ink-900/40 transition hover:bg-ink-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
      >
        Cuéntanos tu proyecto
      </button>

      {open && (
        <div
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/60 p-4"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cuéntanos tu proyecto"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 md:p-8"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-ink-700 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <XIcon className="h-5 w-5" />
            </button>
            {/* La ruta real (no una etiqueta tipo "widget-flotante"): se usa para el enlace del
                email de aviso y debe empezar por "/" (ver leadSchema). /contacto nunca muestra el
                widget, así que cualquier otra ruta identifica ya que el lead vino de aquí. */}
            <ProjectWizard sourcePage={pathname} />
          </div>
        </div>
      )}
    </>
  );
}
