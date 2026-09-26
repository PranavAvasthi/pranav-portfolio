"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { env } from "@/env";
import { submitContact } from "@/lib/api/submit-contact";
import { validateContactMessage } from "@/lib/validations/contact";
import type { ContactFieldErrors, ContactFormStatus } from "@/types/contact";

export function useContactForm() {
  const [status, setStatus] = useState<ContactFormStatus>({ state: "idle" });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const request = useRef<AbortController | null>(null);
  const accessKey = env.NEXT_PUBLIC_WEB3FORMS_KEY;

  useEffect(() => () => request.current?.abort(), []);

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    if (request.current) return;
    setStatus({ state: "idle" });
    const input = event.target;
    if (
      !(
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement
      )
    )
      return;
    const field = input.name;
    if (field === "name" || field === "email" || field === "message") {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (request.current || !accessKey) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) {
      setStatus({
        state: "error",
        message: "Your message couldn’t be sent. Please email me directly.",
      });
      return;
    }

    const validation = validateContactMessage({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    });
    if (!validation.success) {
      setErrors(validation.errors);
      setStatus({
        state: "error",
        message: "Please check the highlighted fields.",
      });
      const firstField = Object.keys(validation.errors)[0];
      const input = form.elements.namedItem(firstField);
      if (input instanceof HTMLElement) input.focus();
      return;
    }

    setErrors({});
    setStatus({ state: "sending" });
    const controller = new AbortController();
    request.current = controller;
    try {
      const result = await submitContact(
        validation.data,
        accessKey,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      if (result.success) {
        form.reset();
        setStatus({
          state: "success",
          message:
            "Message sent. Thanks for reaching out — I’ll get back to you by email.",
        });
      } else {
        setStatus({ state: "error", message: result.message });
      }
    } finally {
      if (request.current === controller) request.current = null;
    }
  };

  return {
    errors,
    status,
    handleSubmit,
    handleChange,
    isConfigured: Boolean(accessKey),
  };
}
