# 07 · Enviar el reporte por email (AWS SES / Nodemailer)

Extiende el playbook 06 para enviar el reporte por email: con AWS SES (link de descarga) o Nodemailer (PDF adjunto). Incluye template HTML, trigger manual y envío programado.

## Paso 1 — Configurar SES
SES en la **misma región** que la Lambda (`{{REGION}}`). Por defecto está en **sandbox** (solo envías a direcciones verificadas); para producción solicita salir del sandbox (Paso 8).

## Paso 2 — Verificar identidades
SES → Verified identities → Create identity:
- **Email individual** (rápido, dev): `reportes@{{DOMAIN}}` → confirma el link que llega.
- **Dominio** (prod, recomendado): agrega los registros TXT/CNAME a tu DNS (verificación ~24-72h); permite enviar desde cualquier `@{{DOMAIN}}`.
- En sandbox, verifica también el **destinatario**.

## Paso 3 — Permisos IAM (en el role de la Lambda)
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["ses:SendEmail", "ses:SendRawEmail"],
    "Resource": "arn:aws:ses:{{REGION}}:<ACCOUNT_ID>:identity/{{DOMAIN}}"
  }]
}
```

## Paso 4 — Template HTML (`lib/emailTemplate.mjs`)
Función que devuelve el HTML del email (tablas inline para compatibilidad con clientes de correo):
```js
export function buildEmailHtml({ total, totalAmount, downloadUrl, period }) {
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);
  return `<!DOCTYPE html><html lang="es"><body style="margin:0;background:#F3F4F6;font-family:-apple-system,sans-serif">
    <table width="100%"><tr><td align="center" style="padding:32px 16px">
      <table width="600" style="background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="background:#1C2536;padding:24px 32px">
          <span style="color:#818cf8;font-weight:800;font-size:20px">Reporte</span>
        </td></tr>
        <tr><td style="padding:32px">
          <h2 style="color:#111827;margin:0 0 8px">Reporte generado</h2>
          <p style="color:#6B7280;font-size:14px">Período: <strong>${period ?? "Hoy"}</strong></p>
          <table width="100%" style="margin:16px 0">
            <tr>
              <td width="48%" style="background:#F4F6F8;border-radius:8px;padding:16px">
                <div style="font-size:28px;font-weight:800;color:#4f46e5">${total}</div>
                <div style="font-size:12px;color:#6B7280">Registros</div></td>
              <td width="4%"></td>
              <td width="48%" style="background:#F4F6F8;border-radius:8px;padding:16px">
                <div style="font-size:20px;font-weight:800;color:#059669">${fmt(totalAmount)}</div>
                <div style="font-size:12px;color:#6B7280">Total</div></td>
            </tr>
          </table>
          <a href="${downloadUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 28px;border-radius:8px;font-weight:700;text-decoration:none">⬇ Descargar PDF</a>
        </td></tr>
        <tr><td style="background:#F9FAFB;padding:16px 32px;border-top:1px solid #E5E7EB">
          <p style="font-size:11px;color:#9CA3AF;margin:0">Email automático. No respondas. · reportes@{{DOMAIN}}</p>
        </td></tr>
      </table>
    </td></tr></table></body></html>`;
}
```

## Paso 5a — Envío con SES + link (`lib/sendEmail.mjs`)
```js
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { buildEmailHtml } from "./emailTemplate.mjs";
const ses = new SESClient({ region: process.env.AWS_REGION ?? "{{REGION}}" });

export async function sendReportEmail({ to, downloadUrl, total, totalAmount, period }) {
  const toAddresses = Array.isArray(to) ? to : [to];
  const from = process.env.SES_FROM_EMAIL;
  if (!from) throw new Error("SES_FROM_EMAIL no configurada");
  const html = buildEmailHtml({ total, totalAmount, downloadUrl, period });
  return ses.send(new SendEmailCommand({
    Source: `Reportes <${from}>`,
    Destination: { ToAddresses: toAddresses },
    Message: {
      Subject: { Data: `Reporte — ${period ?? new Date().toLocaleDateString("es-MX")}`, Charset: "UTF-8" },
      Body: {
        Html: { Data: html, Charset: "UTF-8" },
        Text: { Data: `Reporte generado. Descarga: ${downloadUrl} (expira en 1h).`, Charset: "UTF-8" },
      },
    },
  }));
}
```

## Paso 5b — Alternativa: Nodemailer + PDF adjunto (`lib/sendEmailNodemailer.mjs`)
Usa cualquier SMTP (SES SMTP, Gmail, SendGrid…). Permite adjuntar el PDF directamente.
```js
import nodemailer from "nodemailer";
import { buildEmailHtml } from "./emailTemplate.mjs";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "email-smtp.{{REGION}}.amazonaws.com",
  port: 587, secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
export async function sendReportEmailWithAttachment({ to, pdfBuffer, fileName, total, totalAmount, period }) {
  const html = buildEmailHtml({ total, totalAmount, period, downloadUrl: "(adjunto)" });
  await transporter.sendMail({
    from: `"Reportes" <${process.env.SES_FROM_EMAIL}>`,
    to: Array.isArray(to) ? to.join(",") : to,
    subject: `Reporte — ${period ?? "Hoy"}`,
    html,
    attachments: [{ filename: fileName, content: pdfBuffer, contentType: "application/pdf" }],
  });
}
```
> SES SMTP: IAM → Users → policy `AmazonSesSendingAccess` → Create SMTP credentials (genera user/pass específicos).

## Paso 6 — Handler final (PDF + email)
```js
import { fetchData } from "./lib/fetchData.mjs";
import { generatePdf } from "./lib/generatePdf.mjs";
import { uploadPdfToS3 } from "./lib/uploadToS3.mjs";
import { sendReportEmail } from "./lib/sendEmail.mjs";

export const handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const toEmails = body.emails ?? process.env.REPORT_RECIPIENTS?.split(",") ?? [];
    if (toEmails.length === 0) throw new Error("Sin destinatarios (body.emails o REPORT_RECIPIENTS)");
    const rows = await fetchData({ startDate: body.startDate, endDate: body.endDate });
    const totalAmount = rows.reduce((s, r) => s + (r.amount ?? 0), 0);
    const period = body.startDate && body.endDate ? `${body.startDate} al ${body.endDate}`
      : new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
    const pdf = await generatePdf(rows);
    const fileName = `{{MODULE}}-${new Date().toISOString().slice(0,10)}-${Date.now()}.pdf`;
    const downloadUrl = await uploadPdfToS3(pdf, fileName);
    await sendReportEmail({ to: toEmails, downloadUrl, total: rows.length, totalAmount, period });
    return { statusCode: 200, body: JSON.stringify({ success: true, recipients: toEmails, fileName }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
```
Env extra: `SES_FROM_EMAIL`, `REPORT_RECIPIENTS` (coma-separados).

## Paso 7 — Envío automático diario (EventBridge)
Lambda → Add trigger → EventBridge → Schedule expression. Ej:
| cron | cuándo |
|------|--------|
| `cron(0 8 * * ? *)` | diario 8:00 UTC |
| `cron(0 8 ? * MON *)` | lunes 8:00 UTC |
| `cron(0 8 1 * ? *)` | día 1 de cada mes |
| `rate(12 hours)` | cada 12h |
Configure input → Constant JSON `{"source":"eventbridge-scheduled"}` (el handler usará `REPORT_RECIPIENTS`).

## Paso 8 — Endpoint "Enviar por Email" en el host
`app/api/reports/send-email/route.ts` reenvía `{ emails }` a la Lambda; un botón en la UI pide el email y hace `POST`. (Mismo patrón que el botón de descarga del playbook 06.)

## Paso 9 — Salir del sandbox SES (producción)
SES → Account dashboard → Request production access → tipo Transactional, describe el caso de uso y volumen. Aprobación en 24-48h. Luego envías a cualquier dirección.

## Checklist
- [ ] SES en la región de la Lambda; remitente verificado
- [ ] IAM con `ses:SendEmail/SendRawEmail`
- [ ] Template HTML con tablas inline
- [ ] Envío por link (SES) o adjunto (Nodemailer) elegido
- [ ] Handler integra fetch+PDF+S3+email
- [ ] Env: SES_FROM_EMAIL, REPORT_RECIPIENTS (+ SMTP_* si Nodemailer)
- [ ] EventBridge para envío programado (si aplica)
- [ ] Endpoint host + botón UI
- [ ] Producción: fuera del sandbox SES
