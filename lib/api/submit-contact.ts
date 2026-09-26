import { z } from "zod";
import type { ContactMessage, ContactSubmissionResult } from "@/types/contact";
import { SITE_URL } from "@/lib/seo/site-url";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const responseSchema = z.object({ success: z.boolean() });

function getEmailHeaderName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

export async function submitContact(
  message: ContactMessage,
  accessKey: string,
  signal?: AbortSignal,
): Promise<ContactSubmissionResult> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) cancel();
  signal?.addEventListener("abort", cancel, { once: true });
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15_000);

  try {
    const senderName = getEmailHeaderName(message.name);
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "omit",
      signal: controller.signal,
      body: JSON.stringify({
        ...message,
        access_key: accessKey,
        subject: `New portfolio enquiry from ${senderName}`,
        from_name: `${senderName} via Pranav's portfolio`,
        replyto: message.email,
        source: new URL(SITE_URL).hostname,
        botcheck: false,
      }),
    });

    if (response.status === 429) {
      return {
        success: false,
        message:
          "Too many attempts. Please wait a little before trying again, or email me directly.",
      };
    }

    const body: unknown = await response.json();
    const result = responseSchema.safeParse(body);
    if (response.ok && result.success && result.data.success) {
      return { success: true };
    }

    return {
      success: false,
      message:
        "Your message couldn’t be sent. Please try again or email me directly.",
    };
  } catch {
    return {
      success: false,
      message: timedOut
        ? "The request timed out, so delivery couldn’t be confirmed. Please try again or email me directly."
        : "Delivery couldn’t be confirmed. Please check your connection and try again, or email me directly.",
    };
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}
