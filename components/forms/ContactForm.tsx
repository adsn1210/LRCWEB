"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/(marketing)/contacto/actions";
import type { SubmitLeadState } from "@/lib/validations";

const initialState: SubmitLeadState = { status: "idle" };

const serviceOptions = [
  { value: "encimeras", label: "Encimeras de cocina" },
  { value: "reforma-cocina", label: "Reforma de cocina" },
  { value: "reforma-bano", label: "Reforma de baño" },
  { value: "reforma-integral", label: "Reforma integral" },
  { value: "otro", label: "Otro" },
];

const fieldClass =
  "border border-base-200 bg-white px-4 py-3 text-base text-ink-900 outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.status === "success") {
    return (
      <div className="border border-base-200 bg-white p-8">
        <h3 className="font-serif text-2xl font-semibold text-ink-900">¡Gracias! Ya tenemos tu solicitud.</h3>
        <p className="mt-3 text-base leading-relaxed text-ink-700">
          Te contestamos en cuanto podamos, normalmente en menos de 24-48h laborables. Si lo tuyo es urgente,
          escríbenos directamente por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-ink-900">
          Nombre *
        </label>
        <input id="name" name="name" type="text" required minLength={2} autoComplete="name" className={fieldClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phoneOrEmail" className="text-sm font-semibold text-ink-900">
          Teléfono o email *
        </label>
        <input
          id="phoneOrEmail"
          name="phoneOrEmail"
          type="text"
          required
          minLength={6}
          autoComplete="tel"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service" className="text-sm font-semibold text-ink-900">
          ¿Qué necesitas? *
        </label>
        <select id="service" name="service" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Selecciona una opción
          </option>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold text-ink-900">
          Cuéntanos tu proyecto
        </label>
        <textarea id="message" name="message" rows={4} maxLength={1000} className={fieldClass} />
      </div>

      {/* Honeypot: oculto por CSS (nunca display:none) para que solo lo rellenen bots. Docs/BACKEND.md sección 4. */}
      <div aria-hidden="true" className="h-0 w-0 overflow-hidden">
        <label htmlFor="honeypot">No rellenar este campo</label>
        <input id="honeypot" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && <p className="text-sm font-medium text-danger">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 items-center justify-center bg-accent-500 px-7 text-[15px] font-semibold text-base-50 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
