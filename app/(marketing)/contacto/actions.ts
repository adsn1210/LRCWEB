"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { resend } from "@/lib/email";
import { buildLeadEmail } from "@/lib/lead-email";
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

  // Guardado en Supabase y aviso por email son independientes: si uno de los dos falla, el lead
  // sigue llegando por el otro. Solo se muestra error al visitante si fallan ambos. (En oct 2026
  // Supabase pausó el proyecto por inactividad y se perdían todos los leads.)
  let savedToDb = true;
  try {
    await db`
      insert into leads (name, contact, service, message, source_page, budget, urgency)
      values (${name}, ${phoneOrEmail}, ${service}, ${message ?? null}, ${sourcePage}, ${budget ?? null}, ${urgency ?? null})
    `;
  } catch (error) {
    savedToDb = false;
    console.error("[contacto] error guardando el lead en Supabase", error);
  }

  let emailSent = false;
  if (resend) {
    const email = buildLeadEmail({ name, phoneOrEmail, service, message, budget, urgency, sourcePage, savedToDb });
    try {
      // El SDK de Resend no lanza si la API rechaza el envío: devuelve el fallo en `error`.
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "LRC Web <notificaciones@contact.lareinadelacasa.com>",
        to: process.env.LEAD_NOTIFICATION_EMAIL || "info@lareinadelacasa.com",
        replyTo: phoneOrEmail.includes("@") ? phoneOrEmail : undefined,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      if (error) {
        console.error("[contacto] Resend rechazó el email de aviso", error);
      } else {
        emailSent = true;
      }
    } catch (error) {
      console.error("[contacto] error enviando el email de aviso", error);
    }
  } else {
    console.warn("[contacto] RESEND_API_KEY no configurada: no se envía el aviso por email.");
  }

  if (!savedToDb && !emailSent) {
    return {
      status: "error",
      message: "No hemos podido enviar tu solicitud. Escríbenos por WhatsApp o llámanos mientras lo solucionamos.",
    };
  }

  return { status: "success" };
}
