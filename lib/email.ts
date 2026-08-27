import { Resend } from "resend";

// Envío del aviso de "nuevo lead" al email de LRC. Ver Docs/BACKEND.md secciones 2, 4 y 7.
// El SDK de Resend lanza en el propio constructor si falta la API key (a diferencia de `postgres`,
// que solo falla al primer query) — `resend` es `null` mientras no exista RESEND_API_KEY (p. ej. en
// desarrollo local antes de dar de alta la cuenta), y los llamantes deben comprobarlo antes de usarlo.
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
