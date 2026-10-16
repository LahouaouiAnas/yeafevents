import { hasLocale, type Locale } from "@/i18n/config";
import type { QuoteField } from "./types";

export type QuoteRequest = {
  locale: Locale;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  city?: string;
  date?: string;
  guests?: number;
  budget?: string;
  /** Package chosen with its "Choose" button, as shown on the site. */
  pack?: string;
  message?: string;
};

const limits: Record<QuoteField, number> = {
  name: 120,
  phone: 40,
  email: 160,
  eventType: 40,
  city: 120,
  date: 10,
  guests: 7,
  budget: 80,
  pack: 120,
  message: 5000,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d][\d\s().-]{5,}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/** Trimmed text of a form field; newlines are kept only where they make sense (the message). */
function text(form: FormData, name: QuoteField): string {
  const value = form.get(name);
  if (typeof value !== "string") return "";
  const trimmed = value.trim().slice(0, limits[name]);
  return name === "message" ? trimmed : trimmed.replace(/\s+/g, " ");
}

/** Server-side validation; the browser's own checks are only a convenience. */
export function parseQuoteRequest(
  form: FormData,
  eventTypes: readonly string[],
): { request: QuoteRequest; invalid?: never } | { request?: never; invalid: QuoteField[] } {
  const invalid: QuoteField[] = [];
  const localeValue = form.get("locale");
  const locale: Locale = typeof localeValue === "string" && hasLocale(localeValue) ? localeValue : "fr";

  const name = text(form, "name");
  const phone = text(form, "phone");
  const email = text(form, "email");
  const eventType = text(form, "eventType");
  const city = text(form, "city");
  const date = text(form, "date");
  const guestsText = text(form, "guests");
  const budget = text(form, "budget");
  const pack = text(form, "pack");
  const message = text(form, "message");

  if (name.length < 2) invalid.push("name");
  if (!phonePattern.test(phone) || phone.replace(/\D/g, "").length < 6) invalid.push("phone");
  if (!emailPattern.test(email)) invalid.push("email");
  if (!eventTypes.includes(eventType)) invalid.push("eventType");
  if (date && (!datePattern.test(date) || Number.isNaN(Date.parse(date)))) invalid.push("date");
  const guests = guestsText ? Number(guestsText) : undefined;
  if (guests !== undefined && (!Number.isInteger(guests) || guests < 1)) invalid.push("guests");

  if (invalid.length > 0) return { invalid };
  return {
    request: {
      locale,
      name,
      phone,
      email,
      eventType,
      city: city || undefined,
      date: date || undefined,
      guests,
      budget: budget || undefined,
      pack: pack || undefined,
      message: message || undefined,
    },
  };
}
