"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { XIcon } from "@/components/ui/icons";

const CONSENT_COOKIE = "lrc_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 12 meses, ver Docs/BACKEND.md sección 6

type ConsentValue = { analytics: boolean; marketing: boolean };
type View = "banner" | "configure";

// Lectura de la cookie vía useSyncExternalStore (en vez de useState+useEffect): evita el parpadeo
// del banner en visitantes recurrentes sin forzar renderizado dinámico de toda la página — la
// cookie es un sistema externo al que nos "suscribimos" en el sentido de la propia API de React.
let cachedConsent: ConsentValue | null = null;
let consentRead = false;

function parseConsent(raw: string): ConsentValue | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === "boolean" && typeof parsed?.marketing === "boolean") {
      return parsed;
    }
  } catch {
    // cookie corrupta o con formato inesperado: se trata como "sin decisión todavía"
  }
  return null;
}

function getConsentSnapshot(): ConsentValue | null {
  if (!consentRead) {
    const match = document.cookie.match(/(?:^|; )lrc_consent=([^;]*)/);
    cachedConsent = match ? parseConsent(decodeURIComponent(match[1])) : null;
    consentRead = true;
  }
  return cachedConsent;
}

function getServerConsentSnapshot(): ConsentValue | null {
  return null;
}

function subscribeConsent() {
  // La cookie solo cambia en esta pestaña a través de commit(), que ya provoca su propio
  // re-render con setState; no hay ningún evento externo real al que suscribirse.
  return () => {};
}

function writeConsentCookie(value: ConsentValue) {
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
}

// Empuja la decisión a Consent Mode v2 (Docs/BACKEND.md sección 6). `gtag` lo define el script
// consent-default de app/layout.tsx; si NEXT_PUBLIC_GTM_ID no está configurado no existe y esto
// es un no-op seguro.
function pushConsentUpdate(value: ConsentValue) {
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", {
    analytics_storage: value.analytics ? "granted" : "denied",
    ad_storage: value.marketing ? "granted" : "denied",
    ad_user_data: value.marketing ? "granted" : "denied",
    ad_personalization: value.marketing ? "granted" : "denied",
  });
}

export function CookieBanner() {
  const storedConsent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Visitante recurrente con una decisión ya guardada: hay que reenviarla a Consent Mode en cada
  // carga de página, porque GTM se carga de cero cada vez y arranca siempre en "denegado" hasta
  // que alguien le diga lo contrario (ver app/layout.tsx). commit() solo cubre la decisión tomada
  // en esta misma visita, no las de sesiones anteriores.
  useEffect(() => {
    if (storedConsent) pushConsentUpdate(storedConsent);
  }, [storedConsent]);

  function commit(value: ConsentValue) {
    writeConsentCookie(value);
    pushConsentUpdate(value);
    setDismissed(true);
  }

  if (storedConsent !== null || dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-base-200 bg-white shadow-[0_-12px_32px_-16px_rgba(34,31,27,0.2)]">
      {view === "configure" ? (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-sans text-lg font-semibold text-ink-900">Preferencias de cookies</h3>
            <button
              type="button"
              aria-label="Cerrar configuración"
              onClick={() => setView("banner")}
              className="flex h-9 w-9 items-center justify-center text-ink-700"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <ConsentRow title="Necesarias" description="Imprescindibles para que la web funcione. Siempre activas." checked disabled />
          <ConsentRow
            title="Analítica"
            description="Nos ayudan a entender cómo se usa la web (Google Analytics)."
            checked={analytics}
            onChange={() => setAnalytics((v) => !v)}
          />
          <ConsentRow
            title="Marketing"
            description="Permiten mostrar anuncios más relevantes fuera de esta web."
            checked={marketing}
            onChange={() => setMarketing((v) => !v)}
          />

          <div className="mt-5 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => commit({ analytics: false, marketing: false })}
              className="h-11 bg-ink-900 px-6 text-sm font-semibold text-white hover:bg-ink-900/90"
            >
              Rechazar todas
            </button>
            <button
              type="button"
              onClick={() => commit({ analytics, marketing })}
              className="h-11 bg-ink-900 px-6 text-sm font-semibold text-white hover:bg-ink-900/90"
            >
              Guardar preferencias
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-700">
            Usamos cookies propias y de terceros para analizar el uso de la web y mejorar tu experiencia. Puedes
            aceptarlas, rechazarlas o{" "}
            <button type="button" onClick={() => setView("configure")} className="font-semibold text-accent-600 underline">
              configurarlas
            </button>
            . Más información en nuestra{" "}
            <Link href="/politica-de-cookies" className="font-semibold text-accent-600 underline">
              política de cookies
            </Link>
            .
          </p>
          {/* Aceptar y Rechazar comparten estilo, tamaño y posición a propósito (Docs/FRONTEND.md, requisito legal). */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => commit({ analytics: false, marketing: false })}
              className="h-11 bg-ink-900 px-6 text-sm font-semibold text-white hover:bg-ink-900/90"
            >
              Rechazar todas
            </button>
            <button
              type="button"
              onClick={() => commit({ analytics: true, marketing: true })}
              className="h-11 bg-ink-900 px-6 text-sm font-semibold text-white hover:bg-ink-900/90"
            >
              Aceptar todas
            </button>
            <button type="button" onClick={() => setView("configure")} className="text-sm font-medium text-ink-700 underline">
              Configurar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsentRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-base-200 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <p className="mt-1 max-w-xl text-[13.5px] text-ink-700">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-success" : "bg-base-200"} ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
