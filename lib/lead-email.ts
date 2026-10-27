import { SITE_URL } from "@/lib/site";
import { isEmail, type LeadInput } from "@/lib/validations";

// Email de aviso de "nuevo lead" que recibe LRC (enviado con Resend desde contacto/actions.ts).
// HTML con tablas y estilos en línea: es lo único que Gmail/Outlook renderizan de forma fiable.
// Colores = tokens de Docs/FRONTEND.md sección 2. Siempre se manda también la versión en texto plano.

type LeadEmailInput = Omit<LeadInput, "honeypot"> & {
  savedToDb: boolean;
};

const colors = {
  base50: "#FAF9F7",
  base100: "#F3F1EC",
  base200: "#E5E1DA",
  ink700: "#4A453D",
  ink900: "#221F1B",
  accent500: "#AD8E7F",
  success: "#3F7D5C",
  amber: "#D97706",
  danger: "#B3413A",
};

const serviceLabels: Record<LeadInput["service"], string> = {
  encimeras: "Encimeras de cocina",
  "reforma-cocina": "Reforma de cocina",
  "reforma-bano": "Reforma de baño",
  "reforma-integral": "Reforma integral",
  otro: "Otro",
};

const urgencyLabels: Record<NonNullable<LeadInput["urgency"]>, { label: string; color: string }> = {
  "mas-3-meses": { label: "Más de 3 meses", color: colors.success },
  "menos-3-meses": { label: "Menos de 3 meses", color: colors.amber },
  "lo-antes-posible": { label: "Lo antes posible", color: colors.danger },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBudget(budget?: number) {
  if (!budget) return "No indicado";
  return budget >= 30000 ? "30.000 € o más" : `${budget.toLocaleString("es-ES")} €`;
}

// Teléfono escrito a mano por el visitante → solo dígitos con prefijo 34 si es un número español
// de 9 cifras. Devuelve null si no parece un teléfono (p. ej. si dejó un email).
function toPhoneDigits(contact: string) {
  if (contact.includes("@")) return null;
  let digits = contact.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9) digits = `34${digits}`;
  return digits.length >= 9 ? digits : null;
}

function button(href: string, label: string, background: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;background:${background};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;">${label}</a>`;
}

function row(label: string, valueHtml: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${colors.base200};width:140px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${colors.ink700};">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${colors.base200};vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${colors.ink900};">${valueHtml}</td>
  </tr>`;
}

export function buildLeadEmail(lead: LeadEmailInput) {
  const { name, phoneOrEmail, service, message, budget, urgency, sourcePage, savedToDb } = lead;
  const serviceLabel = serviceLabels[service];
  const urgencyInfo = urgency ? urgencyLabels[urgency] : null;
  const receivedAt = new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "full",
    timeStyle: "short",
  });

  const contactIsEmail = isEmail(phoneOrEmail);
  const phoneDigits = toPhoneDigits(phoneOrEmail);

  const subject = `${urgency === "lo-antes-posible" ? "🔴 " : ""}Nuevo lead: ${name} · ${serviceLabel}`;

  const actions = [
    contactIsEmail ? button(`mailto:${phoneOrEmail}`, "Responder por email", colors.ink900) : "",
    phoneDigits ? button(`tel:+${phoneDigits}`, "Llamar", colors.ink900) : "",
    phoneDigits ? button(`https://wa.me/${phoneDigits}`, "Escribir por WhatsApp", "#25D366") : "",
  ].join("");

  const urgencyBadge = urgencyInfo
    ? `<span style="display:inline-block;padding:4px 10px;background:${urgencyInfo.color};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;">${urgencyInfo.label}</span>`
    : "No indicada";

  const dbWarning = savedToDb
    ? ""
    : `<tr><td style="padding:14px 32px;background:${colors.danger};font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#ffffff;">
        <strong>Atención:</strong> este lead no se ha podido guardar en la base de datos. Este email es la única copia.
      </td></tr>`;

  const messageBlock = message
    ? `<tr><td style="padding:0 32px 24px;">
        <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${colors.ink700};">Su mensaje</p>
        <div style="padding:16px;background:${colors.base100};border-left:4px solid ${colors.accent500};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${colors.ink900};white-space:pre-line;">${escapeHtml(message)}</div>
      </td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${colors.base100};">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(`${serviceLabel} · ${formatBudget(budget)} · ${urgencyInfo?.label ?? "Sin urgencia indicada"}`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.base100};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${colors.base200};">
        <tr><td style="padding:24px 32px;background:${colors.accent500};">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#ffffff;">La Reina de la Casa</p>
          <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Nueva solicitud desde la web</p>
        </td></tr>
        ${dbWarning}
        <tr><td style="padding:28px 32px 8px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:bold;color:${colors.ink900};">${escapeHtml(name)}</p>
          <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${colors.ink700};">${escapeHtml(receivedAt)}</p>
        </td></tr>
        <tr><td style="padding:16px 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Servicio", escapeHtml(serviceLabel))}
            ${row("Presupuesto", escapeHtml(formatBudget(budget)))}
            ${row("Urgencia", urgencyBadge)}
            ${row("Contacto", escapeHtml(phoneOrEmail))}
          </table>
        </td></tr>
        ${messageBlock}
        ${actions ? `<tr><td style="padding:0 32px 24px;">${actions}</td></tr>` : ""}
        <tr><td style="padding:16px 32px;background:${colors.base50};border-top:1px solid ${colors.base200};font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${colors.ink700};">
          Enviado desde el formulario de <a href="${escapeHtml(SITE_URL + sourcePage)}" style="color:${colors.ink700};">${escapeHtml(SITE_URL.replace(/^https?:\/\//, "") + sourcePage)}</a>.
          ${contactIsEmail ? "Si respondes a este email, la respuesta le llega directamente al cliente." : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    savedToDb ? null : "ATENCIÓN: este lead no se ha podido guardar en la base de datos. Este email es la única copia.\n",
    `Nuevo lead desde la web (${receivedAt})`,
    "",
    `Nombre: ${name}`,
    `Contacto: ${phoneOrEmail}`,
    `Servicio: ${serviceLabel}`,
    `Presupuesto: ${formatBudget(budget)}`,
    `Urgencia: ${urgencyInfo?.label ?? "No indicada"}`,
    `Mensaje: ${message ?? "(sin mensaje)"}`,
    "",
    `Página: ${SITE_URL}${sourcePage}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}
