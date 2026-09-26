"use client";

import { useId } from "react";
import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_LIMITS } from "@/lib/validations/contact";

const fieldClassName =
  "mt-2 w-full rounded-none border-0 border-b border-foreground/35 bg-transparent px-0 py-3 text-base leading-6 text-foreground placeholder:text-(--muted)/70 focus:border-(--accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent) aria-invalid:border-(--accent) disabled:opacity-60";

export function ContactForm() {
  const id = useId();
  const { errors, status, handleSubmit, handleChange, isConfigured } =
    useContactForm();
  const sending = status.state === "sending";

  return (
    <form
      className="min-w-0 border-t border-foreground/25 pt-6"
      onSubmit={handleSubmit}
      onChange={handleChange}
      method="post"
      noValidate
      aria-labelledby={`${id}-title`}
    >
      <p
        id={`${id}-title`}
        className="mb-1 text-lg font-semibold tracking-[-0.02em]"
      >
        Send a message
      </p>
      <p className="mb-7 text-sm leading-6 text-(--muted)">
        Tell me what you have in mind. All fields are required.
      </p>
      <fieldset
        disabled={sending || !isConfigured}
        aria-busy={sending}
        className="contact-form-fields m-0 min-w-0 border-0 p-0"
      >
        <legend className="sr-only">Your contact details and message</legend>
        <div className="grid gap-7 min-[1100px]:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className="text-sm font-medium">
              Your name
            </label>
            <input
              id={`${id}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="What should I call you?"
              required
              maxLength={CONTACT_LIMITS.name}
              className={fieldClassName}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
            />
            {errors.name && (
              <p id={`${id}-name-error`} className="mt-3 text-xs leading-5">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="text-sm font-medium">
              Your email
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              required
              maxLength={CONTACT_LIMITS.email}
              className={fieldClassName}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${id}-email-error` : undefined}
            />
            {errors.email && (
              <p id={`${id}-email-error`} className="mt-3 text-xs leading-5">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="mt-7">
          <label htmlFor={`${id}-message`} className="text-sm font-medium">
            Your message
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            placeholder="An idea, a question, or something we could build together…"
            required
            minLength={10}
            maxLength={CONTACT_LIMITS.message}
            rows={4}
            className={`${fieldClassName} min-h-32 resize-y`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? `${id}-message-error` : undefined
            }
          />
          {errors.message && (
            <p id={`${id}-message-error`} className="mt-3 text-xs leading-5">
              {errors.message}
            </p>
          )}
        </div>
        <div hidden aria-hidden="true">
          <label htmlFor={`${id}-botcheck`}>Leave this unchecked</label>
          <input
            id={`${id}-botcheck`}
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button
          className="primary-link mt-7 min-h-12 w-full text-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none disabled:hover:bg-size-[0_100%] disabled:hover:shadow-none min-[450px]:w-auto"
          type="submit"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
      </fieldset>
      <div
        className="mt-4 min-h-12 text-sm leading-6"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {!isConfigured ? (
          <p className="text-(--muted)">
            The form is unavailable right now. Please use the email link to get
            in touch.
          </p>
        ) : status.state === "success" || status.state === "error" ? (
          <p>{status.message}</p>
        ) : sending ? (
          <p className="text-(--muted)">Sending your message…</p>
        ) : null}
      </div>
      <noscript>
        <p className="text-sm text-(--muted)">
          Please use the email link to get in touch when JavaScript is disabled.
        </p>
      </noscript>
    </form>
  );
}
