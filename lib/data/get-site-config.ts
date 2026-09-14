import siteConfig from "@/data/site-config.json";
import type { SiteConfig } from "@/types/site-config";

export async function getSiteConfig(): Promise<SiteConfig> {
  return siteConfig;
}
