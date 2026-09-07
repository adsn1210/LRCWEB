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
  };

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

  const { name, phoneOrEmail, service, message } = parsed.data;

  try {
    await db`
      insert into leads (name, contact, service, message, source_page)
      values (${name}, ${phoneOrEmail}, ${service}, ${message ?? null}, '/contacto')
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
        text: `Nombre: ${name}\nContacto: ${phoneOrEmail}\nServicio: ${service}\nMensaje: ${message ?? "(sin mensaje)"}`,
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
