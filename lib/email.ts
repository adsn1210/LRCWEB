import { Resend } from "resend";

// Envío del aviso de "nuevo lead" al email de LRC. Ver Docs/BACKEND.md secciones 2, 4 y 7.
export const resend = new Resend(process.env.RESEND_API_KEY);
