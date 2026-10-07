import nodemailer from "nodemailer";
import { createClient } from "next-sanity";
import { siteConfig } from "@/config/site";
import { sanityConfig } from "@/lib/cms/config";
import type { QuoteRequest } from "./validate";

/**
 * Where a quote request goes. Each channel is optional and configured by environment
 * variables, so the form keeps working with whichever is set up:
 * - email through SMTP (SMTP_USER / SMTP_PASSWORD, e.g. the contact@ mailbox at Hostinger);
 * - a "Demande de devis" document in Sanity (SANITY_API_WRITE_TOKEN).
 */

const smtp = {
  host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT ?? 465),
  user: process.env.SMTP_USER ?? "",
  password: process.env.SMTP_PASSWORD ?? "",
};
const inbox = process.env.QUOTE_TO_EMAIL ?? siteConfig.contact.email ?? "";

const transporter =
  smtp.user && smtp.password
    ? nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.password },
      })
    : null;

const writeToken = process.env.SANITY_API_WRITE_TOKEN ?? "";
const writeClient =
  writeToken && sanityConfig.projectId ? createClient({ ...sanityConfig, token: writeToken, useCdn: false }) : null;

export const hasDeliveryChannel = Boolean((transporter && inbox) || writeClient);

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

function rows(request: QuoteRequest, eventLabel: string): [string, string][] {
  const entries: [string, string | number | undefined][] = [
    ["Nom", request.name],
    ["Téléphone", request.phone],
    ["Email", request.email],
    ["Type d'événement", eventLabel],
    ["Ville", request.city],
    ["Date envisagée", request.date],
    ["Invités", request.guests],
    ["Budget", request.budget],
    ["Langue du site", request.locale.toUpperCase()],
  ];
  return entries.filter((entry): entry is [string, string | number] => entry[1] !== undefined).map(([k, v]) => [k, String(v)]);
}

async function emailAgency(request: QuoteRequest, eventLabel: string) {
  if (!transporter || !inbox) return false;
  const list = rows(request, eventLabel);
  const text = [...list.map(([k, v]) => `${k} : ${v}`), "", "Message :", request.message ?? "—"].join("\n");
  const html = `
    <h2 style="font-family:Georgia,serif;font-weight:normal">Nouvelle demande de devis</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${list.map(([k, v]) => `<tr><td style="color:#777">${escapeHtml(k)}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`).join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#777">Message :</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(request.message ?? "—")}</p>`;

  await transporter.sendMail({
    from: { name: "Site Yeaf Events", address: smtp.user },
    to: inbox,
    replyTo: { name: request.name, address: request.email },
    subject: `Demande de devis – ${eventLabel} – ${request.name}`,
    text,
    html,
  });
  return true;
}

const confirmation = {
  fr: {
    subject: "Nous avons bien reçu votre demande – Yeaf Events",
    body: (name: string) =>
      `Bonjour ${name},\n\nMerci pour votre message : nous avons bien reçu votre demande et nous revenons vers vous très rapidement pour en parler.\n\nÀ très vite,\nL'équipe Yeaf Events`,
  },
  en: {
    subject: "We have received your request – Yeaf Events",
    body: (name: string) =>
      `Hello ${name},\n\nThank you for your message: we have received your request and will get back to you very soon to discuss it.\n\nSpeak soon,\nThe Yeaf Events team`,
  },
} as const;

/** Best effort: a failed acknowledgement must not turn a received request into an error. */
async function emailClient(request: QuoteRequest) {
  if (!transporter) return;
  const copy = confirmation[request.locale];
  const contactLines = [siteConfig.contact.email, ...siteConfig.contact.phones].filter(Boolean).join("\n");
  try {
    await transporter.sendMail({
      from: { name: "Yeaf Events", address: smtp.user },
      to: { name: request.name, address: request.email },
      replyTo: inbox || undefined,
      subject: copy.subject,
      text: `${copy.body(request.name)}\n\n${contactLines}`,
    });
  } catch (error) {
    console.error("[quote] confirmation email failed", error);
  }
}

async function saveToSanity(request: QuoteRequest, eventLabel: string) {
  if (!writeClient) return false;
  await writeClient.create({
    _type: "quoteRequest",
    receivedAt: new Date().toISOString(),
    status: "new",
    ...request,
    eventType: eventLabel,
  });
  return true;
}

/** True when at least one channel stored the request. */
export async function deliverQuoteRequest(request: QuoteRequest, eventLabel: string): Promise<boolean> {
  const results = await Promise.allSettled([emailAgency(request, eventLabel), saveToSanity(request, eventLabel)]);
  for (const result of results) if (result.status === "rejected") console.error("[quote] delivery failed", result.reason);
  const delivered = results.some((result) => result.status === "fulfilled" && result.value);
  if (delivered) await emailClient(request);
  return delivered;
}
