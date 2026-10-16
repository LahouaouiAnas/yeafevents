"use client";

import Image from "next/image";
import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ImageAsset } from "@/lib/content/types";
import { submitQuoteRequest } from "@/lib/quote/actions";
import { track } from "@/lib/tracking/meta";
import { initialQuoteState, type QuoteField } from "@/lib/quote/types";

type EventComposerProps = {
  locale: Locale;
  labels: Dictionary["contact"]["form"];
  composer: Dictionary["contact"]["composer"];
  eventTypes: { value: string; label: string; image?: ImageAsset }[];
  /** WhatsApp number in international format without "+", or empty to hide the handoff. */
  whatsapp: string;
};

type Answers = {
  eventType: string;
  date: string;
  city: string;
  guests: string;
  budget: string;
  /** Package picked with its "Choose" button (?type=…&pack=…). */
  pack: string;
  message: string;
  name: string;
  phone: string;
  email: string;
};

const STEPS = ["type", "when", "guests", "budget", "wishes", "contact"] as const;
type Step = (typeof STEPS)[number];

/** Where each server-validated field is asked, to send the visitor back to it. */
const fieldStep: Record<QuoteField, Step> = {
  eventType: "type",
  date: "when",
  city: "when",
  guests: "guests",
  budget: "budget",
  pack: "type",
  message: "wishes",
  name: "contact",
  phone: "contact",
  email: "contact",
};

const empty: Answers = { eventType: "", date: "", city: "", guests: "", budget: "", pack: "", message: "", name: "", phone: "", email: "" };

const inputClass =
  "mt-3 w-full border-0 border-b border-ivory/25 bg-transparent px-0 py-3 text-lg text-ivory transition-colors duration-300 placeholder:text-stone/50 hover:border-ivory/50 focus:border-champagne focus:ring-0 focus:outline-none aria-invalid:border-[#d98b7a]";

/** Today in the visitor's own time zone, as YYYY-MM-DD (toISOString would use UTC). */
function localToday(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * "Compose my event": the quote request asked one question per screen, with a running recap.
 * Sent to the same Server Action as before (validation, spam traps, rate limit, email and
 * Sanity delivery); after sending, or instead of it, the summary can go on to WhatsApp.
 */
export function EventComposer({ locale, labels, composer, eventTypes, whatsapp }: EventComposerProps) {
  const id = useId();
  const [state, submit, pending] = useActionState(submitQuoteRequest, initialQuoteState);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState("");
  const startedAt = useRef("");
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // The page is pre-rendered, so "today" and the load time must come from the visitor's browser.
  useEffect(() => {
    startedAt.current = String(Date.now());
    // Arriving from a package's "Choose" button: event type and package are already answered.
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") ?? "";
    if (eventTypes.some((option) => option.value === type)) {
      const pack = (params.get("pack") ?? "").slice(0, 120);
      startTransition(() => {
        setAnswers((current) => ({ ...current, eventType: type, pack }));
        setIndex(1);
      });
    }
  }, [eventTypes]);

  // Move focus to the new question, but not on first load.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [index]);

  // A sent request is the conversion that matters for ads (sent to Meta only with consent).
  useEffect(() => {
    if (state.status === "success") track("Lead", { content_category: answers.eventType, content_name: answers.pack || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per successful submission
  }, [state]);

  // A field rejected by the server sends the visitor back to the question that asks it.
  useEffect(() => {
    const first = state.status === "error" && state.reason === "invalid" ? state.fields?.[0] : undefined;
    if (first) {
      const target = STEPS.indexOf(fieldStep[first]);
      moved.current = true;
      startTransition(() => setIndex(target));
    }
  }, [state]);

  const step: Step = STEPS[index] ?? "type";
  // Only the "when" question needs it, and it is never the server-rendered one.
  const today = step === "when" ? localToday() : "";
  const options = [...eventTypes, { value: "other", label: labels.eventTypeOther }];
  const typeLabel = options.find((option) => option.value === answers.eventType)?.label ?? "";
  const invalid = new Set<QuoteField>(state.status === "error" && state.reason === "invalid" ? (state.fields ?? []) : []);
  const isInvalid = (name: QuoteField) => invalid.has(name) || undefined;
  const field = (name: string) => `${id}-${name}`;

  const set = (name: keyof Answers, value: string) => {
    setAnswers((current) => ({ ...current, [name]: value }));
    setHint("");
  };

  const go = (target: number) => {
    moved.current = true;
    setHint("");
    setIndex(Math.max(0, Math.min(STEPS.length - 1, target)));
  };

  const next = () => {
    if (step === "type" && !answers.eventType) {
      setHint(composer.chooseOne);
      return;
    }
    if (step === "when" && answers.date && today && answers.date < today) {
      setHint(labels.datePast);
      return;
    }
    go(index + 1);
  };

  const recap: { label: string; value: string }[] = [
    { label: labels.eventType, value: typeLabel },
    ...(answers.pack ? [{ label: composer.pack, value: answers.pack }] : []),
    { label: labels.date, value: answers.date ? new Date(`${answers.date}T12:00:00`).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "long" }) : "" },
    { label: labels.city, value: answers.city },
    { label: labels.guests, value: answers.guests },
    { label: labels.budget, value: answers.budget },
  ];

  const summary = [
    composer.whatsappIntro,
    ...recap.map((item) => `• ${item.label} : ${item.value || composer.notSet}`),
    answers.message && `\n${answers.message}`,
    answers.name && `\n${answers.name}`,
  ]
    .filter(Boolean)
    .join("\n");

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== "contact") {
      next();
      return;
    }
    const data = new FormData();
    data.set("locale", locale);
    data.set("startedAt", startedAt.current);
    data.set("website", honeypot.current?.value ?? "");
    for (const [name, value] of Object.entries(answers)) data.set(name, value);
    startTransition(() => submit(data));
  }

  if (state.status === "success") {
    return (
      <div role="status" className="border border-champagne/30 p-8 sm:p-12">
        <p className="eyebrow text-champagne">{composer.recap}</p>
        <h3 className="mt-5 font-display text-3xl font-normal sm:text-4xl">{composer.successTitle}</h3>
        <p className="mt-5 max-w-xl leading-relaxed text-ivory/85">{labels.success}</p>
        <Recap items={recap} notSet={composer.notSet} />
        {whatsapp && (
          <a href={waLink(whatsapp, summary)} target="_blank" rel="noopener noreferrer" className="btn-line mt-10 inline-flex items-center gap-3 px-7 py-4">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#25d366]" />
            {composer.whatsappAfter}
          </a>
        )}
      </div>
    );
  }

  const serverMessage = pending ? labels.sending : state.status === "error" ? labels[state.reason] : "";

  return (
    <form onSubmit={send} noValidate={step !== "contact"} className="grid gap-12 lg:grid-cols-[1fr_17rem] lg:gap-16">
      {/* Spam trap: invisible to people, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={field("website")}>Website</label>
        <input ref={honeypot} id={field("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Progress current={index} labels={composer} />

        <fieldset className="mt-12 min-h-[22rem]">
          <legend className="contents">
            <h3 ref={heading} tabIndex={-1} className="font-display text-3xl leading-tight font-normal text-balance focus:outline-none sm:text-[2.6rem]">
              {composer.steps[step].title}
            </h3>
          </legend>
          <p className="mt-3 text-stone">{composer.steps[step].hint}</p>

          <div className="mt-10">
            {step === "type" && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {options.map((option) => (
                  <li key={option.value}>
                    <Choice
                      checked={answers.eventType === option.value}
                      onSelect={() => {
                        // Another type than the chosen package's: the package no longer applies.
                        if (option.value !== answers.eventType) set("pack", "");
                        set("eventType", option.value);
                        go(index + 1);
                      }}
                    >
                      {"image" in option && option.image ? (
                        <span className="relative block aspect-[4/3] overflow-hidden">
                          <Image src={option.image.src} alt="" fill sizes="(min-width: 640px) 220px, 45vw" className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
                        </span>
                      ) : (
                        <span aria-hidden="true" className="media-fallback block aspect-[4/3]" />
                      )}
                      <span className="block px-4 py-3 font-display text-lg">{option.label}</span>
                    </Choice>
                  </li>
                ))}
              </ul>
            )}

            {step === "when" && (
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <label htmlFor={field("date")} className="eyebrow text-stone">
                    {labels.date}
                  </label>
                  <input
                    id={field("date")}
                    type="date"
                    min={today || undefined}
                    value={answers.date}
                    aria-invalid={isInvalid("date")}
                    onChange={(event) => set("date", event.target.value)}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                  {answers.date && today && answers.date < today && <p className="mt-2 text-sm text-[#d98b7a]">{labels.datePast}</p>}
                </div>
                <div>
                  <label htmlFor={field("city")} className="eyebrow text-stone">
                    {labels.city}
                  </label>
                  <input
                    id={field("city")}
                    type="text"
                    autoComplete="address-level2"
                    maxLength={120}
                    value={answers.city}
                    onChange={(event) => set("city", event.target.value)}
                    className={inputClass}
                  />
                  <Chips values={composer.cities} current={answers.city} onPick={(value) => set("city", value)} />
                </div>
              </div>
            )}

            {step === "guests" && (
              <div className="max-w-sm">
                <label htmlFor={field("guests")} className="eyebrow text-stone">
                  {labels.guests}
                </label>
                <input
                  id={field("guests")}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={answers.guests}
                  aria-invalid={isInvalid("guests")}
                  onChange={(event) => set("guests", event.target.value)}
                  className={`${inputClass} font-display text-4xl`}
                />
                <Chips values={composer.guestPresets} current={answers.guests} onPick={(value) => set("guests", value)} suffix="+" />
              </div>
            )}

            {step === "budget" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {labels.budgets.map((budget) => (
                  <li key={budget}>
                    <Choice
                      checked={answers.budget === budget}
                      onSelect={() => {
                        set("budget", budget);
                        go(index + 1);
                      }}
                    >
                      <span className="block px-5 py-5 font-display text-xl">{budget}</span>
                    </Choice>
                  </li>
                ))}
              </ul>
            )}

            {step === "wishes" && (
              <div>
                <label htmlFor={field("message")} className="eyebrow text-stone">
                  {labels.message}
                </label>
                <textarea
                  id={field("message")}
                  rows={6}
                  maxLength={5000}
                  value={answers.message}
                  placeholder={labels.messagePlaceholder}
                  onChange={(event) => set("message", event.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>
            )}

            {step === "contact" && (
              <div className="grid gap-8 sm:grid-cols-2">
                <Text id={field("name")} label={labels.name} required requiredLabel={labels.required}>
                  <input id={field("name")} type="text" autoComplete="name" required maxLength={120} value={answers.name} aria-invalid={isInvalid("name")} onChange={(event) => set("name", event.target.value)} className={inputClass} />
                </Text>
                <Text id={field("phone")} label={labels.phone} required requiredLabel={labels.required}>
                  <input id={field("phone")} type="tel" autoComplete="tel" required maxLength={40} value={answers.phone} aria-invalid={isInvalid("phone")} onChange={(event) => set("phone", event.target.value)} className={inputClass} />
                </Text>
                <div className="sm:col-span-2">
                  <Text id={field("email")} label={labels.email} required requiredLabel={labels.required}>
                    <input id={field("email")} type="email" autoComplete="email" required maxLength={160} value={answers.email} aria-invalid={isInvalid("email")} onChange={(event) => set("email", event.target.value)} className={inputClass} />
                  </Text>
                </div>
              </div>
            )}
          </div>
        </fieldset>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-ivory/10 pt-8">
          {index > 0 && (
            <button type="button" onClick={() => go(index - 1)} className="text-sm tracking-[0.2em] text-stone uppercase transition-colors hover:text-ivory">
              <span aria-hidden="true">←</span> {composer.back}
            </button>
          )}
          <span className="grow" />
          {step !== "type" && step !== "contact" && (
            <button type="button" onClick={() => go(index + 1)} className="text-sm text-stone underline decoration-ivory/25 underline-offset-[6px] transition-colors hover:text-ivory">
              {composer.skip}
            </button>
          )}
          <button type="submit" disabled={pending} className="btn-gold inline-flex items-center gap-3 px-8 py-4 disabled:cursor-wait disabled:opacity-60">
            {step === "contact" ? labels.submit : composer.next} <span aria-hidden="true">→</span>
          </button>
        </div>
        <p role="status" className="mt-5 min-h-6 text-sm text-champagne">
          {hint || serverMessage}
        </p>
      </div>

      <aside className="h-fit border border-ivory/10 bg-coal/60 p-6 lg:sticky lg:top-28">
        <p className="eyebrow text-champagne">{composer.recap}</p>
        <Recap items={recap} notSet={composer.notSet} />
        {whatsapp && step === "contact" && (
          <a href={waLink(whatsapp, summary)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-gold-soft underline decoration-champagne/40 underline-offset-[6px] hover:decoration-gold-soft">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#25d366]" />
            {composer.whatsappInstead}
          </a>
        )}
      </aside>
    </form>
  );
}

/** Numbered steps on a gold line that fills as the visitor advances. */
function Progress({ current, labels }: { current: number; labels: EventComposerProps["composer"] }) {
  const total = STEPS.length;
  return (
    <div>
      <p className="flex items-baseline gap-3 text-stone">
        <span className="eyebrow">{labels.step}</span>
        <span className="font-display text-2xl text-gold-soft">{String(current + 1).padStart(2, "0")}</span>
        <span className="text-sm">/ {String(total).padStart(2, "0")}</span>
      </p>
      <div role="progressbar" aria-label={labels.progress} aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1} className="mt-4 h-px w-full bg-ivory/15">
        <div className="h-px origin-left bg-champagne transition-transform duration-700 ease-out-soft" style={{ transform: `scaleX(${(current + 1) / total})` }} />
      </div>
    </div>
  );
}

/** A large selectable tile; choosing it moves on to the next question. */
function Choice({ checked, onSelect, children }: { checked: boolean; onSelect: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onSelect}
      className={`group block h-full w-full overflow-hidden border text-left transition-colors duration-300 ${
        checked ? "border-champagne bg-champagne/10 text-gold-soft" : "border-ivory/15 hover:border-champagne/60"
      }`}
    >
      {children}
    </button>
  );
}

/** Quick answers that fill the field above them. */
function Chips({ values, current, onPick, suffix = "" }: { values: readonly string[]; current: string; onPick: (value: string) => void; suffix?: string }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={current === value}
          onClick={() => onPick(value)}
          className="border border-ivory/20 px-4 py-2 text-sm text-ivory/80 transition-colors hover:border-champagne hover:text-gold-soft aria-pressed:border-champagne aria-pressed:bg-champagne/10 aria-pressed:text-gold-soft"
        >
          {value}
          {suffix}
        </button>
      ))}
    </div>
  );
}

function Recap({ items, notSet }: { items: { label: string; value: string }[]; notSet: string }) {
  return (
    <dl className="mt-5 divide-y divide-ivory/10 text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4 py-3">
          <dt className="text-stone">{item.label}</dt>
          <dd className={`text-right ${item.value ? "text-ivory" : "text-stone/60 italic"}`}>{item.value || notSet}</dd>
        </div>
      ))}
    </dl>
  );
}

function Text({ id, label, required = false, requiredLabel, children }: { id: string; label: string; required?: boolean; requiredLabel?: string; children: ReactNode }) {
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
