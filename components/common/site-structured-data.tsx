import type { SiteConfig } from "@/types/site-config";
import {
  getSiteStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data";

interface SiteStructuredDataProps {
  config: SiteConfig;
}

export function SiteStructuredData({ config }: SiteStructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(getSiteStructuredData(config)),
      }}
    />
  );
}
