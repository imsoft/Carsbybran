import { BASE_URL, SITE_NAME } from "@/lib/seo";

/** Canonical site URL for assets (override in preview/staging if needed). */
function assetOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return fromEnv || BASE_URL;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nlToBr(text: string): string {
  return escapeHtml(text).replace(/\r\n/g, "\n").split("\n").join("<br/>");
}

export type ContactNotificationPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * HTML para Resend / clientes de correo: tablas + estilos inline (sin Tailwind).
 * Logo en SVG (algunos clientes antiguos pueden no mostrarlo; sustituir por PNG si hace falta).
 */
export function buildContactNotificationHtml(payload: ContactNotificationPayload): string {
  const origin = assetOrigin();
  const logoUrl = `${origin}/images/site/carsbybran-logo-light.svg`;

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = nlToBr(payload.message);

  const accent = "#dc2626";
  const headerBg = "#0f172a";
  const outerBg = "#f1f5f9";
  const cardBg = "#ffffff";
  const text = "#0f172a";
  const muted = "#64748b";
  const border = "#e2e8f0";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${SITE_NAME} — Contacto</title>
</head>
<body style="margin:0;padding:0;background-color:${outerBg};font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${outerBg};padding:28px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:${cardBg};border-radius:12px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 6px -1px rgba(15,23,42,0.08);">
        <tr>
          <td style="background-color:${headerBg};padding:24px 28px;text-align:center;border-bottom:4px solid ${accent};">
            <a href="${origin}" style="text-decoration:none;display:inline-block;">
              <img src="${logoUrl}" alt="${SITE_NAME}" width="200" style="display:block;margin:0 auto;max-width:200px;height:auto;border:0;outline:none;"/>
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 28px 8px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${accent};">Nuevo mensaje de contacto</p>
            <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;line-height:1.3;color:${text};">Has recibido un mensaje desde el sitio web</h1>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${muted};width:120px;vertical-align:top;"><strong style="color:${text};">Nombre</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${text};">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${muted};vertical-align:top;"><strong style="color:${text};">Email</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;"><a href="mailto:${safeEmail}" style="color:${accent};text-decoration:none;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${muted};vertical-align:top;"><strong style="color:${text};">Asunto</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${text};">${safeSubject}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 28px;">
            <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:${text};">Mensaje</p>
            <div style="font-size:15px;line-height:1.6;color:${text};background-color:${outerBg};border-radius:8px;padding:16px 18px;border:1px solid ${border};">${safeMessage}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 24px;text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.5;color:${muted};">
              Respondiendo a este correo se usará <strong style="color:${text};">Responder a</strong> del cliente de email (${safeEmail}).
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px;background-color:${outerBg};border-top:1px solid ${border};text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:${muted};">
              <a href="${origin}" style="color:${muted};text-decoration:underline;">${origin.replace(/^https?:\/\//, "")}</a>
              · ${SITE_NAME}
            </p>
            <p style="margin:0;font-size:11px;color:${muted};opacity:0.9;">Mensaje enviado desde el formulario de contacto.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function buildContactNotificationText(payload: ContactNotificationPayload): string {
  const origin = assetOrigin();
  return [
    `${SITE_NAME} — Nuevo contacto`,
    "",
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `Asunto: ${payload.subject}`,
    "",
    "Mensaje:",
    payload.message,
    "",
    `---`,
    `${origin}`,
    "Mensaje enviado desde el formulario de contacto.",
  ].join("\n");
}
