export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactMessage, string>>;

export type ContactSubmissionResult =
  | { success: true }
  | { success: false; message: string };

export type ContactFormStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };
