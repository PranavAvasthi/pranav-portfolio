import { z } from "zod";

const web3FormsKey = z
  .string()
  .trim()
  .pipe(z.uuid())
  .safeParse(process.env.NEXT_PUBLIC_WEB3FORMS_KEY);

const googleSiteVerification = z
  .string()
  .trim()
  .min(1)
  .safeParse(process.env.GOOGLE_SITE_VERIFICATION);

export const env = {
  NEXT_PUBLIC_WEB3FORMS_KEY: web3FormsKey.success ? web3FormsKey.data : null,
  GOOGLE_SITE_VERIFICATION: googleSiteVerification.success
    ? googleSiteVerification.data
    : null,
};
