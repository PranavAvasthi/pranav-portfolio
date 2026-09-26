import type { SiteConfig } from "@/types/site-config";
import { getCanonicalUrl } from "@/lib/seo/site-url";

export function getSiteStructuredData(config: SiteConfig) {
  const url = getCanonicalUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: config.name,
        url,
        jobTitle: config.jobTitle,
        sameAs: config.socials.map((social) => social.url),
        knowsAbout: config.seo.knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: config.name,
        description: config.seo.description,
        inLanguage: "en",
        publisher: { "@id": `${url}#person` },
      },
    ],
  };
}

export function serializeStructuredData(
  value: ReturnType<typeof getSiteStructuredData>,
): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
