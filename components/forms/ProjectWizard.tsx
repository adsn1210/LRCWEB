"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitLead } from "@/app/(marketing)/contacto/actions";
import { trackEvent } from "@/lib/analytics";
import type { SubmitLeadState } from "@/lib/validations";
import { BathIcon, CountertopIcon, HouseIcon, PotIcon } from "@/components/ui/icons";

const initialState: SubmitLeadState = { status: "idle" };

type WizardStep = 1 | 2 | 3;

// TODO: reemplazar por asset definitivo — de momento icono + color de marca en vez de foto real
const projectOptions = [
  { value: "encimeras", label: "Encimeras de cocina", icon: CountertopIcon, tone: "bg-brand-taupe" },
  { value: "reforma-cocina", label: "Reforma de cocina", icon: PotIcon, tone: "bg-brand-beige" },
  { value: "reforma-bano", label: "Reforma de baño", icon: BathIcon, tone: "bg-brand-gray" },
  { value: "reforma-integral", label: "Reforma integral", icon: HouseIcon, tone: "bg-brand-gray-pale" },
] as const;

const urgencyOptions = [
  {
    value: "mas-3-meses",
    label: "Más de 3 meses",
    tone: "border-success text-success has-[:checked]:bg-success has-[:checked]:text-white",
  },
  {
    value: "menos-3-meses",
    label: "Menos de 3 meses",
    tone: "border-amber-500 text-amber-600 has-[:checked]:bg-amber-500 has-[:checked]:text-white",
  },
  {
    value: "lo-antes-posible",
    label: "Lo antes posible",
    tone: "border-danger text-danger has-[:checked]:bg-danger has-[:checked]:text-white",
  },
] as const;

const fieldClass =
  "border border-base-200 bg-white px-4 py-3 text-base text-ink-900 outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500";

function isStepValid(container: HTMLDivElement | null) {
  if (!container) return true;
  const fields = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input, textarea, select",
  );
  for (const field of fields) {
    if (!field.reportValidity()) return false;
  }
  return true;
}

type ProjectWizardProps = {
  sourcePage: string;
};

export function ProjectWizard({ sourcePage }: ProjectWizardProps) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const [step, setStep] = useState<WizardStep>(1);
  const [budgetValue, setBudgetValue] = useState(10000);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("lead_widget_step", { step, source_page: sourcePage });
  }, [step, sourcePage]);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("lead_form_submit", { source_page: sourcePage });
    }
  }, [state.status, sourcePage]);

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

  const goNext = () => {
    if (step === 1 && !isStepValid(step1Ref.current)) return;
    if (step === 2 && !isStepValid(step2Ref.current)) return;
    setStep((current) => (current < 3 ? ((current + 1) as WizardStep) : current));
  };

  const goBack = () => {
    setStep((current) => (current > 1 ? ((current - 1) as WizardStep) : current));
  };

  // Con <form action={formAction}> React vacía el formulario al terminar la acción, también cuando
  // falla: el visitante perdía lo escrito y, al reintentar desde el paso 3, el navegador no podía
  // enfocar el campo "Nombre" vacío del paso 1, que está oculto ("An invalid form control is not
  // focusable"). Enviando desde onSubmit se conservan los valores; si va bien, se muestra el
  // mensaje de gracias y el formulario desaparece igualmente.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((dot) => (
          <span key={dot} className={`h-1.5 flex-1 rounded-full ${dot <= step ? "bg-accent-500" : "bg-base-200"}`} />
        ))}
      </div>
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Paso {step} de 3</p>

      <input type="hidden" name="source_page" value={sourcePage} />
      {/* Honeypot: oculto por CSS (nunca display:none) para que solo lo rellenen bots. Docs/BACKEND.md sección 4. */}
      <div aria-hidden="true" className="h-0 w-0 overflow-hidden">
        <label htmlFor="honeypot">No rellenar este campo</label>
        <input id="honeypot" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div ref={step1Ref} hidden={step !== 1} className="flex flex-col gap-5">
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
          <label htmlFor="message" className="text-sm font-semibold text-ink-900">
            Cuéntanos tu proyecto (opcional)
          </label>
          <textarea id="message" name="message" rows={3} maxLength={1000} className={fieldClass} />
        </div>
      </div>

      <div ref={step2Ref} hidden={step !== 2} className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-ink-900">¿Qué necesitas? *</p>
        <div className="grid grid-cols-2 gap-3">
          {projectOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer flex-col overflow-hidden border border-base-200 transition hover:border-accent-500 has-[:checked]:border-accent-500 has-[:checked]:ring-2 has-[:checked]:ring-accent-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500 has-[:focus-visible]:ring-offset-2"
            >
              <input type="radio" name="service" value={option.value} required className="sr-only" />
              <span className={`flex h-20 items-center justify-center text-white ${option.tone}`}>
                <option.icon className="h-8 w-8" />
              </span>
              <span className="p-2 text-center text-sm font-semibold text-ink-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div hidden={step !== 3} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-sm font-semibold text-ink-900">
            Presupuesto aproximado
          </label>
          <input
            id="budget"
            name="budget"
            type="range"
            min={1000}
            max={30000}
            step={500}
            value={budgetValue}
            onChange={(event) => setBudgetValue(Number(event.target.value))}
            className="w-full accent-accent-500"
          />
          <p className="text-center text-lg font-semibold text-ink-900">
            {budgetValue >= 30000 ? "30.000 € o más" : `${budgetValue.toLocaleString("es-ES")} €`}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-ink-900">¿Qué prisa tienes? *</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {urgencyOptions.map((option) => (
              <label
                key={option.value}
                className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center border px-3 py-2.5 text-center text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500 has-[:focus-visible]:ring-offset-2 ${option.tone}`}
              >
                <input type="radio" name="urgency" value={option.value} required className="sr-only" />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {state.status === "error" && state.message && <p className="text-sm font-medium text-danger">{state.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 items-center justify-center bg-accent-500 px-7 text-[15px] font-semibold text-base-50 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar solicitud"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="flex h-11 items-center px-4 text-sm font-semibold text-ink-700 hover:text-ink-900"
          >
            Atrás
          </button>
        ) : (
          <span />
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={goNext}
            className="flex h-11 items-center bg-ink-900 px-6 text-sm font-semibold text-base-50 transition hover:bg-ink-700"
          >
            Siguiente
          </button>
        )}
      </div>
    </form>
  );
}
