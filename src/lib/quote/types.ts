/** Shared between the quote form (client) and its Server Action. */

export type QuoteField = "name" | "phone" | "email" | "eventType" | "city" | "date" | "guests" | "budget" | "message";

export type QuoteState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; reason: "invalid" | "rateLimited" | "unavailable"; fields?: QuoteField[] };

export const initialQuoteState: QuoteState = { status: "idle" };
