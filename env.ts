import { z } from "zod";

const web3FormsKey = z
  .string()
  .trim()
  .pipe(z.uuid())
  .safeParse(process.env.NEXT_PUBLIC_WEB3FORMS_KEY);

export const env = {
  NEXT_PUBLIC_WEB3FORMS_KEY: web3FormsKey.success ? web3FormsKey.data : null,
};
