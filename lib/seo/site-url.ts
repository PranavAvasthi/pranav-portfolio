export const SITE_URL = "https://pranavavasthi.in";

export function getCanonicalUrl(path = "/"): string {
  const url = new URL(path, SITE_URL);
  if (url.origin !== new URL(SITE_URL).origin) {
    throw new Error(
      "Canonical URLs must belong to the configured portfolio domain.",
    );
  }
  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}
