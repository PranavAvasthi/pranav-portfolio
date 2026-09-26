import type { Metadata } from "next";
import { env } from "@/env";
import type { SiteConfig } from "@/types/site-config";
import { getCanonicalUrl } from "@/lib/seo/site-url";

interface PageMetadataOptions {
  path: string;
  title?: string;
  description?: string;
  index?: boolean;
}

export function getPageMetadata(
  config: SiteConfig,
  {
    path,
    title,
    description = config.seo.description,
    index = true,
  }: PageMetadataOptions,
): Metadata {
  const fullTitle = title
    ? `${title} | ${config.name}`
    : `${config.name} | ${config.jobTitle}`;
  const canonical = getCanonicalUrl(path);
  const profile = config.socials.find((social) => social.label === "X");
  const twitterHandle = profile
    ? `@${new URL(profile.url).pathname.split("/").filter(Boolean)[0]}`
    : undefined;
  const image = config.seo.image;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    robots: {
      index,
      follow: true,
      googleBot: { index, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
      type: "website",
      siteName: config.name,
      title: fullTitle,
      description,
      url: canonical,
      images: [
        {
          url: new URL(image.src, canonical).href,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: twitterHandle,
      images: [{ url: new URL(image.src, canonical).href, alt: image.alt }],
    },
    verification: env.GOOGLE_SITE_VERIFICATION
      ? { google: env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}
