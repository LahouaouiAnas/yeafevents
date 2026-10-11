"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { submitQuoteRequest } from "@/lib/quote/actions";
import { initialQuoteState, type QuoteField } from "@/lib/quote/types";

type QuoteFormProps = {
  locale: Locale;
  labels: Dictionary["contact"]["form"];
  eventTypes: { value: string; label: string }[];
};

const fieldBase =
  "mt-2 w-full border-0 border-b border-ivory/25 bg-transparent px-0 py-3 text-base transition-colors duration-300 placeholder:text-stone/60 hover:border-ivory/50 focus:border-champagne focus:ring-0 focus:outline-none aria-invalid:border-[#d98b7a]";
const fieldClass = `${fieldBase} text-ivory`;

/** Today in the visitor's own time zone, as YYYY-MM-DD (toISOString would use UTC). */
function localToday(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Quote request form. Sent to a Server Action (validation, spam traps, rate limit, email and
 * Sanity delivery). The action is called from onSubmit rather than `action={…}` so that the
 * fields keep their values when the server reports an error.
 */
export function QuoteForm({ locale, labels, eventTypes }: QuoteFormProps) {
  const id = useId();
  const [state, submit, pending] = useActionState(submitQuoteRequest, initialQuoteState);
  const dateRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // The page is pre-rendered, so "today" and the load time must come from the visitor's browser.
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = localToday();
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }

  if (state.status === "success") {
    return (
      <p role="status" className="max-w-xl border-l border-champagne pl-6 font-display text-2xl leading-snug font-normal text-ivory">
        {labels.success}
      </p>
    );
  }

  const invalid = new Set<QuoteField>(state.status === "error" && state.reason === "invalid" ? (state.fields ?? []) : []);
  const isInvalid = (name: QuoteField) => invalid.has(name) || undefined;
  const message = pending ? labels.sending : state.status === "error" ? labels[state.reason] : "";
  const field = (name: string) => `${id}-${name}`;

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      {/* Spam trap: invisible to people, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={field("website")}>Website</label>
        <input id={field("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id={field("name")} label={labels.name} required requiredLabel={labels.required}>
        <input id={field("name")} name="name" type="text" autoComplete="name" required maxLength={120} aria-invalid={isInvalid("name")} className={fieldClass} />
      </Field>
      <Field id={field("phone")} label={labels.phone} required requiredLabel={labels.required}>
        <input id={field("phone")} name="phone" type="tel" autoComplete="tel" required maxLength={40} aria-invalid={isInvalid("phone")} className={fieldClass} />
      </Field>
      <Field id={field("email")} label={labels.email} required requiredLabel={labels.required}>
        <input id={field("email")} name="email" type="email" autoComplete="email" required maxLength={160} aria-invalid={isInvalid("email")} className={fieldClass} />
      </Field>
      <Field id={field("eventType")} label={labels.eventType} required requiredLabel={labels.required}>
        <Select
          id={field("eventType")}
          name="eventType"
          required
          invalid={isInvalid("eventType")}
          placeholder={labels.eventTypePlaceholder}
          options={[...eventTypes, { value: "other", label: labels.eventTypeOther }]}
        />
      </Field>
      <Field id={field("city")} label={labels.city}>
        <input id={field("city")} name="city" type="text" autoComplete="address-level2" maxLength={120} className={fieldClass} />
      </Field>
      <Field id={field("date")} label={labels.date}>
        <input
          ref={dateRef}
          id={field("date")}
          name="date"
          type="date"
          aria-invalid={isInvalid("date")}
          className={fieldClass}
          onInvalid={(event) => {
            if (event.currentTarget.validity.rangeUnderflow) event.currentTarget.setCustomValidity(labels.datePast);
          }}
          onInput={(event) => event.currentTarget.setCustomValidity("")}
        />
      </Field>
      <Field id={field("guests")} label={labels.guests}>
        <input id={field("guests")} name="guests" type="number" min={1} inputMode="numeric" aria-invalid={isInvalid("guests")} className={fieldClass} />
      </Field>
      <Field id={field("budget")} label={labels.budget}>
        <Select
          id={field("budget")}
          name="budget"
          placeholder={labels.budgetPlaceholder}
          options={labels.budgets.map((budget) => ({ value: budget, label: budget }))}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field id={field("message")} label={labels.message}>
          <textarea
            id={field("message")}
            name="message"
            rows={5}
            maxLength={5000}
            placeholder={labels.messagePlaceholder}
            className={`${fieldClass} resize-y`}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-3 bg-ivory px-8 py-4 text-xs font-medium tracking-[0.18em] text-night uppercase transition-colors duration-500 hover:bg-champagne disabled:cursor-wait disabled:opacity-60"
        >
          {labels.submit} <span aria-hidden="true">→</span>
        </button>
        <p role="status" className="mt-6 max-w-xl text-sm leading-relaxed text-champagne">
          {message}
        </p>
      </div>
    </form>
  );
}

/**
 * Native <select> (keyboard, mobile pickers and autofill stay intact) restyled for the dark theme:
 * custom chevron, muted placeholder until a choice is made, dark option list.
 */
function Select({
  id,
  name,
  placeholder,
  options,
  required = false,
  invalid,
}: {
  id: string;
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  required?: boolean;
  invalid?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="group relative">
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={invalid}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={`${fieldBase} cursor-pointer appearance-none pr-10 [&>option]:bg-coal [&>option]:text-ivory ${
          value ? "text-ivory" : "text-stone/70"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-1 bottom-[1.15rem] h-2 w-3 text-ivory/50 transition-colors duration-300 group-focus-within:text-champagne group-hover:text-ivory"
      >
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function Field({
  id,
  label,
  required = false,
  requiredLabel,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  requiredLabel?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-stone">
        {label}
        {required && (
          <span className="text-champagne" title={requiredLabel}>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
