export function isEmbeddedPreview(
  value: string | string[] | undefined,
): boolean {
  return Array.isArray(value) ? value.includes("true") : value === "true";
}
