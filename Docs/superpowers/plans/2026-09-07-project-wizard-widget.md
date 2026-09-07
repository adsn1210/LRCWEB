# Widget "Cuéntanos tu proyecto" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat `ContactForm` with a single 3-step wizard component (`ProjectWizard`) used both embedded on `/contacto` and inside a modal opened from a new fixed CTA button (`ProjectWizardButton`) visible on every other marketing page.

**Architecture:** One presentation-agnostic component (`ProjectWizard`) holds all 3 steps, local step/field state, and calls the existing `submitLead` server action. It is rendered directly inside `/contacto/page.tsx` (no modal chrome) and inside `ProjectWizardButton`'s modal (mounted in `app/(marketing)/layout.tsx`, hidden on `/contacto` itself). `submitLead`, `leadSchema`, and the `leads` table gain two new fields (`budget`, `urgency`) and a dynamic `source_page` instead of a hardcoded one.

**Tech Stack:** Next.js App Router (React 19, Server Actions), Tailwind CSS v4, Zod v4, `postgres` (Supabase), Resend. No test runner exists in this repo (no Jest/Vitest/Playwright) — see Global Constraints.

**Spec:** `Docs/superpowers/specs/2026-09-07-project-wizard-widget-design.md`

## Global Constraints

- **No automated test framework in this repo.** `package.json` has no Jest/Vitest/Playwright. Per the spec's own Testing section, this plan does NOT introduce one (out of scope, deferred as future work). Every task's verification step is `npx tsc --noEmit` (must pass with no errors), `npm run lint` (must pass with no errors), and — for tasks that produce a renderable page — a manual check in the browser via `npm run dev`. This replaces the usual write-test/run-test/implement TDD cycle for this plan only.
- TypeScript strict mode; one component per file; client components only where interactive (`"use client"`), matching `Docs/BACKEND.md` sección 8.
- Design tokens from `Docs/FRONTEND.md`: `bg-accent-500`/`accent-600` for CTAs, `--color-brand-*` for the 4 project-type tiles, 44×44px minimum tap targets, `focus-visible:ring-2 ring-accent-500` on interactive elements.
- GA4 events fire via `dataLayer.push(...)` from components (never hardcoded in GTM), per `Docs/BACKEND.md` sección 6.
- Never commit real Supabase/Resend credentials. `db/schema.sql` uses `create table if not exists`, so schema changes for the already-deployed production table need a separate `alter table` migration, applied manually in the Supabase SQL editor (see Task 1 and Task 6) — this plan does not attempt to run it automatically.
- Commits: small, descriptive, Spanish (matching existing commit history), each ending with the Claude attribution footer already used in this session.

---

### Task 1: Add `budget`/`urgency` to the leads schema

**Files:**
- Modify: `db/schema.sql`
- Create: `db/migrations/0001_add_budget_urgency.sql`
- Modify: `db/README.md`

**Interfaces:**
- Produces: `leads` table (desired state) with two new nullable columns — `budget integer`, `urgency text check (urgency in ('mas-3-meses', 'menos-3-meses', 'lo-antes-posible'))` — that Task 3's `insert` statement will target by name.

- [ ] **Step 1: Update `db/schema.sql` to the desired end-state schema**

Replace the file's contents with:

```sql
-- Tabla de leads (Docs/BACKEND.md sección 4). Base: Postgres de Supabase.
-- Histórico propio de leads, independiente del email de notificación (Resend).

create table if not exists leads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  name         text not null,
  contact      text not null, -- teléfono o email
  service      text not null check (service in ('encimeras', 'reforma-cocina', 'reforma-bano', 'reforma-integral', 'otro')),
  message      text,
  source_page  text,
  budget       integer,
  urgency      text check (urgency in ('mas-3-meses', 'menos-3-meses', 'lo-antes-posible'))
);
```

- [ ] **Step 2: Create the migration for the already-deployed table**

`create table if not exists` will not touch a table that already exists, and the production `leads`
table already has rows (confirmed 2026-09-07). Create `db/migrations/0001_add_budget_urgency.sql`:

```sql
-- Migracion para el proyecto Supabase ya desplegado, de antes de que existiera el wizard de 3
-- pasos (2026-09-07). Ejecutar manualmente en el SQL Editor de Supabase - ver db/README.md.
alter table leads add column if not exists budget integer;
alter table leads add column if not exists urgency text
  check (urgency in ('mas-3-meses', 'menos-3-meses', 'lo-antes-posible'));
```

- [ ] **Step 3: Document the migrations folder in `db/README.md`**

Append this section to the existing file (keep the existing paragraph above it):

```markdown

## Migraciones

`schema.sql` refleja el estado deseado para un proyecto Supabase nuevo (usa `create table if not
exists`, así que no toca una tabla que ya existe). Para aplicar un cambio de esquema sobre el
proyecto Supabase real que ya tiene datos, se añade un archivo numerado en `migrations/` con las
sentencias `alter table` necesarias, y se ejecuta a mano en el SQL Editor de Supabase — no hay
herramienta de migraciones automática en este proyecto.
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect no errors (this task touches no `.ts`/`.tsx` files, this just
confirms the repo is still clean before continuing).

- [ ] **Step 5: Commit**

```bash
git add db/schema.sql db/migrations/0001_add_budget_urgency.sql db/README.md
git commit -m "$(cat <<'EOF'
Anadir columnas budget y urgency a la tabla leads

Preparacion para el wizard de 3 pasos: la tabla ya desplegada
necesita una migracion alter table aparte porque schema.sql usa
create table if not exists y no la toca.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EEct4rRZ9Q6phnb5tkqmv4
EOF
)"
```

**Do not run the migration against the real Supabase project yet.** That happens in Task 6, once the
code that depends on it is ready to test end-to-end, and only after confirming with the user.

---

### Task 2: Extend `leadSchema` with `budget` and `urgency`

**Files:**
- Modify: `lib/validations.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `leadSchema` now accepts optional `budget` (coerced number, 1000–30000) and `urgency`
  (`"mas-3-meses" | "menos-3-meses" | "lo-antes-posible"`) fields. `LeadInput` (inferred type) gains
  these two optional fields — Task 3 destructures them from `parsed.data`.

- [ ] **Step 1: Edit `lib/validations.ts`**

Replace the `leadSchema` definition with:

```ts
import { z } from "zod";

// Ver Docs/BACKEND.md sección 4.
export const leadSchema = z.object({
  name: z.string().min(2),
  phoneOrEmail: z.string().min(6),
  service: z.enum(["encimeras", "reforma-cocina", "reforma-bano", "reforma-integral", "otro"]),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0), // debe llegar vacío; si no, es spam → descartar en silencio
  budget: z.coerce.number().min(1000).max(30000).optional(),
  urgency: z.enum(["mas-3-meses", "menos-3-meses", "lo-antes-posible"]).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type SubmitLeadState = {
  status: "idle" | "success" | "error";
  message?: string;
};
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/validations.ts
git commit -m "$(cat <<'EOF'
Anadir budget y urgency opcionales a leadSchema

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EEct4rRZ9Q6phnb5tkqmv4
EOF
)"
```

---

### Task 3: Make `submitLead` accept `source_page`, `budget`, `urgency`

**Files:**
- Modify: `app/(marketing)/contacto/actions.ts`

**Interfaces:**
- Consumes: `leadSchema` from Task 2 (now parses `budget`/`urgency`).
- Produces: `submitLead(_prevState, formData)` unchanged in signature; now reads a `source_page`
  hidden field from `formData` (falls back to `"/contacto"`), and inserts `budget`/`urgency` into
  Supabase. Task 4's `ProjectWizard` relies on this reading a field named exactly `source_page`.

- [ ] **Step 1: Edit `app/(marketing)/contacto/actions.ts`**

Replace the whole file with:

```ts
"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { resend } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadSchema, type SubmitLeadState } from "@/lib/validations";

export async function submitLead(_prevState: SubmitLeadState, formData: FormData): Promise<SubmitLeadState> {
  const raw = {
    name: formData.get("name"),
    phoneOrEmail: formData.get("phoneOrEmail"),
    service: formData.get("service"),
    message: formData.get("message") || undefined,
    honeypot: formData.get("honeypot") ?? "",
    budget: formData.get("budget") || undefined,
    urgency: formData.get("urgency") || undefined,
  };

  const sourcePage = (formData.get("source_page") as string) || "/contacto";

  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    // El honeypot debe llegar vacío; si trae contenido, la propia validación de leadSchema ya
    // lo rechaza (max(0)). Lo tratamos como spam y fingimos éxito, sin dar pistas al bot.
    if (typeof raw.honeypot === "string" && raw.honeypot.length > 0) {
      return { status: "success" };
    }
    return { status: "error", message: "Revisa los campos del formulario e inténtalo de nuevo." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return { status: "error", message: "Demasiadas solicitudes seguidas. Inténtalo de nuevo en unos minutos." };
  }

  const { name, phoneOrEmail, service, message, budget, urgency } = parsed.data;

  try {
    await db`
      insert into leads (name, contact, service, message, source_page, budget, urgency)
      values (${name}, ${phoneOrEmail}, ${service}, ${message ?? null}, ${sourcePage}, ${budget ?? null}, ${urgency ?? null})
    `;
  } catch (error) {
    console.error("[contacto] error guardando el lead en Supabase", error);
    return {
      status: "error",
      message: "No hemos podido enviar tu solicitud. Escríbenos por WhatsApp o llámanos mientras lo solucionamos.",
    };
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "LRC Web <notificaciones@contact.lareinadelacasa.com>",
        to: process.env.LEAD_NOTIFICATION_EMAIL || "info@lareinadelacasa.com",
        replyTo: phoneOrEmail.includes("@") ? phoneOrEmail : undefined,
        subject: `Nuevo lead desde la web: ${name}`,
        text: `Nombre: ${name}\nContacto: ${phoneOrEmail}\nServicio: ${service}\nPresupuesto: ${
          budget ? `${budget}€` : "(no indicado)"
        }\nUrgencia: ${urgency ?? "(no indicada)"}\nMensaje: ${message ?? "(sin mensaje)"}`,
      });
    } catch (error) {
      // El lead ya está guardado en Supabase aunque el email falle: no rompemos la respuesta al usuario.
      console.error("[contacto] error enviando el email de aviso", error);
    }
  } else {
    console.warn("[contacto] RESEND_API_KEY no configurada: no se envía el aviso por email (el lead sí se guardó).");
  }

  return { status: "success" };
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.

Note: this will not insert successfully against the real Supabase project until Task 1's migration
is applied (Task 6). That's expected — nothing calls this action yet in this task.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/contacto/actions.ts"
git commit -m "$(cat <<'EOF'
Leer source_page de un campo oculto y guardar budget/urgency

source_page deja de estar fijado a '/contacto' en el codigo: ahora
distingue si el lead viene del formulario embebido o del widget
flotante, sin que submitLead necesite saber de donde llama.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EEct4rRZ9Q6phnb5tkqmv4
EOF
)"
```

---

### Task 4: Build `ProjectWizard` and wire it into `/contacto`

**Files:**
- Create: `lib/analytics.ts`
- Create: `components/forms/ProjectWizard.tsx`
- Modify: `app/(marketing)/contacto/page.tsx`
- Delete: `components/forms/ContactForm.tsx`

**Interfaces:**
- Consumes: `submitLead` (Task 3), `leadSchema`'s field names (`name`, `phoneOrEmail`, `message`,
  `service`, `budget`, `urgency`, `honeypot`) as the exact `name` attributes of its inputs, icons
  `CountertopIcon`/`PotIcon`/`BathIcon`/`HouseIcon` from `components/ui/icons.tsx`.
- Produces: `export function ProjectWizard({ sourcePage }: { sourcePage: string })` — a client
  component with no other required props. Task 5's `ProjectWizardButton` renders
  `<ProjectWizard sourcePage="widget-flotante" />` inside its modal. Also produces
  `export function trackEvent(event: string, params?: Record<string, unknown>)` from
  `lib/analytics.ts`, which Task 5 reuses.

- [ ] **Step 1: Create `lib/analytics.ts`**

```ts
// Envío de eventos a GA4 vía dataLayer (Docs/BACKEND.md sección 6). Se dispara desde los
// componentes, nunca hardcoded en GTM, para que quede versionado en el código qué evento
// corresponde a qué acción.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
```

- [ ] **Step 2: Create `components/forms/ProjectWizard.tsx`**

```tsx
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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

  return (
    <form action={formAction} className="flex flex-col gap-6">
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
              className="flex cursor-pointer flex-col overflow-hidden border border-base-200 transition hover:border-accent-500 has-[:checked]:border-accent-500 has-[:checked]:ring-2 has-[:checked]:ring-accent-500"
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
                className={`flex flex-1 cursor-pointer items-center justify-center border px-3 py-2.5 text-center text-sm font-semibold transition ${option.tone}`}
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
```

- [ ] **Step 3: Wire it into `/contacto`**

In `app/(marketing)/contacto/page.tsx`, change the import and usage:

```diff
-import { ContactForm } from "@/components/forms/ContactForm";
+import { ProjectWizard } from "@/components/forms/ProjectWizard";
```

```diff
-          <ContactForm />
+          <ProjectWizard sourcePage="/contacto" />
```

- [ ] **Step 4: Delete the superseded component**

```bash
git rm "components/forms/ContactForm.tsx"
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.

Manual check: run `npm run dev`, open `/contacto`. Confirm:
- The wizard renders embedded (no modal/overlay), with a 3-dot progress bar.
- Step 1 requires name (min 2 chars) and phone/email (min 6 chars) before "Siguiente" advances.
- Step 2 requires picking one of the 4 tiles before advancing; the picked tile gets a visible
  accent border/ring.
- Step 3 shows the budget slider (updates its € label live) and the 3 colored urgency options;
  "Atrás" returns to step 2 with the previously picked tile still selected.
- Clicking "Enviar solicitud" attempts a submission (it's expected to show the Supabase error
  message right now, since Task 1's migration hasn't been applied yet — that's fine, verified in
  Task 6).

- [ ] **Step 6: Commit**

```bash
git add lib/analytics.ts components/forms/ProjectWizard.tsx "app/(marketing)/contacto/page.tsx"
git commit -m "$(cat <<'EOF'
Sustituir ContactForm por el wizard ProjectWizard en /contacto

Wizard de 3 pasos (datos basicos, tipo de proyecto con tarjetas de
icono+color, presupuesto y urgencia) embebido en la pagina de
contacto, reutilizando el mismo submitLead de siempre.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EEct4rRZ9Q6phnb5tkqmv4
EOF
)"
```

---

### Task 5: Build the floating CTA and mount it site-wide

**Files:**
- Create: `components/layout/ProjectWizardButton.tsx`
- Modify: `app/(marketing)/layout.tsx`

**Interfaces:**
- Consumes: `ProjectWizard` (Task 4) with `sourcePage="widget-flotante"`, `trackEvent` (Task 4),
  `XIcon` from `components/ui/icons.tsx`.
- Produces: `export function ProjectWizardButton()` — no props, self-contained (reads
  `usePathname()` itself to hide on `/contacto`).

- [ ] **Step 1: Create `components/layout/ProjectWizardButton.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ProjectWizard } from "@/components/forms/ProjectWizard";
import { trackEvent } from "@/lib/analytics";
import { XIcon } from "@/components/ui/icons";

export function ProjectWizardButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (pathname === "/contacto") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("lead_widget_open");
        }}
        className="fixed left-6 top-[55%] z-[90] flex h-14 items-center justify-center bg-accent-500 px-6 text-center text-[15px] font-semibold text-base-50 shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
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
            role="dialog"
            aria-modal="true"
            aria-label="Cuéntanos tu proyecto"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 md:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-ink-700 hover:text-ink-900"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <ProjectWizard sourcePage="widget-flotante" />
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Mount it in `app/(marketing)/layout.tsx`**

```diff
 import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
+import { ProjectWizardButton } from "@/components/layout/ProjectWizardButton";
```

```diff
       <WhatsAppButton />
+      <ProjectWizardButton />
       <CookieBanner />
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.

Manual check: run `npm run dev`.
- On the home page (`/`), confirm the "Cuéntanos tu proyecto" button is visible on the left side,
  roughly just below the vertical middle, and doesn't visually collide with the WhatsApp button
  (bottom-right).
- Click it: a modal opens with the same 3-step wizard, an "X" close button (top-right of the
  modal), pressing `Escape` closes it, and clicking the dark overlay outside the modal card also
  closes it.
- Navigate to `/contacto`: confirm the floating button is NOT rendered there (the wizard is already
  embedded on the page).

- [ ] **Step 4: Commit**

```bash
git add components/layout/ProjectWizardButton.tsx "app/(marketing)/layout.tsx"
git commit -m "$(cat <<'EOF'
Anadir boton flotante "Cuentanos tu proyecto" en el resto de paginas

Abre el mismo ProjectWizard en un modal; se oculta en /contacto,
donde el wizard ya esta embebido en la pagina.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EEct4rRZ9Q6phnb5tkqmv4
EOF
)"
```

---

### Task 6: Apply the migration and verify both entry points end-to-end

**Files:** none (verification-only task; the migration file was created in Task 1).

This task touches the real, already-live Supabase project. **Ask the user for explicit
confirmation before running the migration** — it's a schema change on a production database with
real lead data, per the project's own risk rules.

- [ ] **Step 1: Apply the migration**

Ask the user to run `db/migrations/0001_add_budget_urgency.sql` in the Supabase SQL editor for the
production project (or, if they've connected the Supabase MCP integration and explicitly authorize
it, run it that way instead). Do not proceed to Step 2 until this is confirmed done.

- [ ] **Step 2: End-to-end check via `/contacto` (embedded)**

With `npm run dev` running: complete the wizard on `/contacto` with real-looking test data, submit,
and confirm:
- The success screen ("¡Gracias! Ya tenemos tu solicitud.") appears.
- A new row exists in Supabase's `leads` table with `source_page = '/contacto'` and non-null
  `budget`/`urgency` matching what was picked.
- The Resend notification email arrives (per the fix already shipped for `RESEND_FROM_EMAIL`).

- [ ] **Step 3: End-to-end check via the floating widget**

From `/` (or any page other than `/contacto`), open the floating widget, complete it with different
test data, submit, and confirm the same three things as Step 2, but with `source_page =
'widget-flotante'`.

- [ ] **Step 4: Confirm GA4 events fire**

With the browser's network tab or GTM Preview mode open, confirm `lead_widget_open` fires on
opening the modal, `lead_widget_step` fires when moving between steps (both contexts), and
`lead_form_submit` fires once per successful submission.

No commit for this task — it's verification of work already committed in Tasks 1–5. If any check
fails, fix the specific broken piece in its own small commit before considering the feature done.
