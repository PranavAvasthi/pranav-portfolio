import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { parse } from "opentype.js";
import { getSignaturePaths } from "@/lib/animations/signature-path";
import type { SignatureData } from "@/types/signature";

const getSignatureFont = cache(async () => {
  const buffer = await readFile(
    join(process.cwd(), "public/fonts/GreatVibes-Regular.ttf"),
  );
  return parse(
    buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ),
  );
});

export async function getSignature(text: string): Promise<SignatureData> {
  return getSignaturePaths(text, await getSignatureFont());
}
